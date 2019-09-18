import express from 'express';
import cypress from 'cypress';
import bodyParser from 'body-parser';
import nodeCache from 'node-cache';
import uuidv4 from 'uuid/v4';

const PORT = 5000;
const cache = new nodeCache({ stdTTL: 30, checkperiod: 120 });
const sessionCache = new nodeCache({ stdTTL: 500, checkperiod: 120 });
const caches = new Map([['cache', cache], ['session', sessionCache]]);

const app = express();
app.use(bodyParser.json())

app.post('/cypress/v1/run/:specName', (req, res) => {

  if (req.body.uuid == undefined) {
    req.body.uuid = uuidv4();
  } else {
    req.body.session = sessionCache.get(req.body.uuid);
  }
  req.body.port = PORT;
  console.log('Requesting spec ' + req.params.specName + ' with configuration:');
  console.log(req.body);

  cypress.run({
    spec: 'cypress/integration/' + req.params.specName + '.js',
    env: req.body
  })
    .then(results => {
      let responseValues = cache.get(req.body.uuid) == undefined ? {} : cache.get(req.body.uuid);
      responseValues.uuid = req.body.uuid;
      res.status(200).send({
        values: responseValues,
        status: results.totalFailed,
        result: results
      })
    })
    .catch((err) => {
      console.error(err)
    });
});

app.post('/cache/v1/:type/:id', (req, res) => {

  console.log('Caching ' + req.params.type + ' with ID ' + req.params.id);
  console.log(req.body);

  caches.get(req.params.type).set(req.params.id, req.body, function (error, success) {
    if (!error && success) {
      res.status(200).send({
        id: req.params.id,
        cache: cache.get(req.params.id)
      });
    } else {
      res.status(500).send({
        id: req.params.id
      });
    }
  });

});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});