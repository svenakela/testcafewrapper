import express from 'express';
import testcafe from 'testcafe';
import bodyParser from 'body-parser';
import nodeCache from 'node-cache';
import uuidv4 from 'uuid/v4';
import pino from 'pino';
import expressPino from 'express-pino-logger';
import { defaultCafeConfig } from './lib/defaultcafeconfig';

const PORT = 5000;
const SPECPATH = 'specs/';
const cache = new nodeCache({ stdTTL: 30, checkperiod: 120 });
const sessionCache = new nodeCache({ stdTTL: 900, checkperiod: 120 });
const caches = new Map([['response', cache], ['session', sessionCache]]);
const logger = pino();
const app = express();
app.use(bodyParser.json())
app.use(expressPino({ logger: logger }));

app.post('/papi/v1/:country/:bankName/:specName', async (req, res, next) => {

  const { country, bankName, specName } = req.params;
  let {testData, config} = req.body;
  const uuid = (testData == undefined || testData.uuid == undefined) ? uuidv4() : testData.uuid;

  testData.uuid = uuid;
  testData.session = sessionCache.get(uuid);
  testData.port = PORT;
  req.log.info('Requesting spec', specName, 'with configuration:', testData);

  const scriptContent = `
    function getParametersFromRunner666() {
      return ${JSON.stringify(testData)};
    }
  `

  if (config == undefined) {
    config = defaultCafeConfig;
  }

  testcafe('localhost').then(cafe => {
    cafe.createRunner()
      .src([SPECPATH, country, bankName, specName].join('/') + '.test.js')
      .browsers(config.browser)
      .clientScripts({ content: scriptContent })
      .reporter('json')
      .run(config)
      .then(result => {
        let responseValues = cache.get(uuid) == undefined ? {} : cache.get(uuid);
        res.status(200).send({
          result: result,
          values: responseValues,
          uuid: testData.uuid
        });
      })
      .catch(err => {
        next(err);
      });
  })
    .catch(err => {
      next(err);
    });

});

app.post('/cache/v1/:type/:id', (req, res) => {

  const { type, id } = req.params;
  const { body } = req;

  caches.get(type).set(id, body, function (error, success) {
    if (!error && success) {
      res.status(200).send({
        id: id,
        cache: caches.get(type).get(id)
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