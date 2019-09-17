import express from 'express';
import cypress from 'cypress';
import bodyParser from 'body-parser';
import nodeCache from 'node-cache';

const PORT = 5000;
const uuidv4 = require('uuid/v4');
const cache = new nodeCache({ stdTTL: 30, checkperiod: 120 });
const app = express();
app.use(bodyParser.json())

app.post('/cypress/v1/run/:specName', (req, res) => {

  req.body.uuid = uuidv4();
  req.body.port = PORT;
  console.log('Requesting spec ' + req.params.specName + ' with configuration:');
  console.log(req.body);

  cypress.run({
      spec: 'cypress/integration/' + req.params.specName + '.js',
      env: req.body
    })
    .then(results => {
      res.status(200).send({
      values: cache.get(req.body.uuid),
      status: results.totalFailed,
      result: results
      })
    })
    .catch((err) => {
      console.error(err)
    });
});

app.post('/cache/:id', (req, res) => {

  console.log('Caching values with ID ' + req.params.id);
  console.log(req.body);
  cache.set(req.params.id, req.body, function(error, success){
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