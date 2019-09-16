# CYPRESS.IO REST WRAPPER

Wrapping the test tool [Cypress](https://cypress.io) with a REST interface making it possible to run test specs to be executed with an http request.

## Usage

- Clone this repository
- Run the server with `npm run start` 
- Make a test request to the server: `curl -v --header 'Content-Type: application/json' --data '{"personId":"197001016666"}'  http://localhost:5000/cypress/v1/run/test`
- Make your own specs, store them under `cypress/integration` and request them with `http://localhost/cypress/v1/run/{your-spec-name-here}`

