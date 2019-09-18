import express from 'express';
import cypress from 'cypress';
import bodyParser from 'body-parser';
import nodeCache from 'node-cache';
import uuidv4 from 'uuid/v4';
import pino from 'pino';
import expressPino from 'express-pino-logger';

const PORT = 5000;
const cache = new nodeCache({ stdTTL: 30, checkperiod: 120 });
const sessionCache = new nodeCache({ stdTTL: 500, checkperiod: 120 });
const caches = new Map([['cache', cache], ['session', sessionCache]]);
const logger = pino();
const app = express();
app.use(bodyParser.json())
app.use(expressPino({logger: logger}));

app.post('/cypress/v1/run/:specName', async (req, res) => {
  
  const uuid  = req.body.uuid == undefined ? uuidv4() : req.body.uuid;
  req.body.session = sessionCache.get(uuid);
  req.body.port = PORT;
  req.log.info('Requesting spec', req.params.specName, 'with configuration:', req.body);

  cypress.run({
    spec: 'cypress/integration/' + req.params.specName + '.spec.js',
    env: req.body
  })
    .then(results => {
      let responseValues = cache.get(uuid) == undefined ? {} : cache.get(uuid);
      responseValues.uuid = uuid;
      res.status(200).send({
        values: responseValues,
        status: results.totalFailed,
        result: results
      })
    })
    .catch((err) => {
      req.log.error(err)
      res.status(500).send({
        error: err
      })
    });
});

app.post('/cache/v1/:type/:id', (req, res) => {

  req.log.info('Caching', req.params.type, 'with ID', req.body);
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
  logger.info('Listening on port', PORT);
});