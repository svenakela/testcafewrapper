import express from 'express';
import testcafe from 'testcafe';
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
app.use(expressPino({ logger: logger }));

app.post('/cafe/v1/run/:specName', async (req, res) => {

  const { specName } = req.params;
  const uuid = req.body.uuid == undefined ? uuidv4() : req.body.uuid;
  req.body.session = sessionCache.get(uuid);
  req.body.port = PORT;
  req.log.info('Requesting spec', specName, 'with configuration:', req.body);

  testcafe('localhost').then(cafe => {
    cafe.createRunner()
      .src('tests/' + specName + '.test.js')
      .reporter('json')
      .run()
      .then(result => {
        res.status(200).send({
          result: result
        });
      })
      .catch(err => {
        res.status(500).send({
          error: err
        });
      });
  });

});

app.post('/cache/v1/:type/:id', (req, res) => {

  const {type, id} = req.params;

  req.log.info('Caching', type, 'with ID', req.body);
  caches.get(type).set(id, req.body, function (error, success) {
    if (!error && success) {
      res.status(200).send({
        id: id,
        cache: cache.get(id)
      });
    } else {
      res.status(500).send({
        id: id
      });
    }
  });

});

app.listen(PORT, () => {
  logger.info('Listening on port', PORT);
});