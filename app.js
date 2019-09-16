import express from 'express';
import cypress from 'cypress';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;

app.use(bodyParser.json())

app.post('/cypress/v1/run/:specName', (req, res) => {

  console.log('Requesting spec ' + req.params.specName + ' with configuration:');
  console.log(req.body);

  cypress.run({
      spec: 'cypress/integration/' + req.params.specName + '.js',
      env: req.body
    })
    .then(results => {
      res.status(200).send({
      status: results.totalFailed,
      result: results 
      })
    })
    .catch((err) => {
      console.error(err)
    });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});