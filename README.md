# TESTCAFÉ REST WRAPPER

Wrapping the test tool [TestCafe](https://devexpress.github.io/testcafe/) with a REST interface making it possible to run test specs with an http request.

## Usage

- You need npm on your computer

- Clone this repository

- Execute `npm install` to setup the project

- Run the server with `npm run start` 

- Make a test request to the server: 
    `curl -v -w '@curl_time.txt' --header 'Content-Type: application/json' --data '{"personId":"197001016666"}' http://localhost:5000/cafe/v1/run/test`

- Make your own specs, store them under `./tests/` and request them with `http://localhost/cafe/v1/run/{your-spec-name-here}`

### Request Interaction

Tests can cache a JSON value with the function `cache`. The value cached will automatically be added to the response that is sent back to the http client.

     // TODO EXAMPLE

Tests can log to Node.js logger

     // TODO EXAMPLE

