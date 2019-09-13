import express from 'express';
import cypress from 'cypress';

const app = express();
const PORT = 5000;

app.get('/cypress/v1/run/:specName', (req, res) => {
  cypress.run({
    spec: 'cypress/integration/' + req.params.specName})
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