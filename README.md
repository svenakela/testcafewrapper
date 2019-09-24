# TESTCAFÉ REST WRAPPER

Wrapping the test tool [TestCafe](https://devexpress.github.io/testcafe/) with a REST interface making it possible to run test specs with an http request.

## Usage

- You need npm on your computer

- Clone this repository

- Execute `npm install --save-dev` to setup the project

- Run the server with `npm run start` 

- Make a test request to the server: 
    `curl -v -w '@curl_time.txt' --header 'Content-Type: application/json' --data '{"personId":"197001016666"}' http://localhost:5000/cafe/v1/run/testcafe`

- Make your own specs, store them under `./tests/` and request them with `http://localhost/cafe/v1/run/{your-spec-name-here}`

### Request Interaction and Support

When running a test, there are a few support features in the `Support` class found in `lib/support`. The support class is created by using the static builder `Support.build(t)`.

### Sending Parameters

When invoking a test via the REST interface, parameters can be sent to the test as a JSON string. The JSON structure will be injected into the test page and can be reached by the `getParameters()` function.

    const support = await Support.build(t)
    const params = await support.getParameters()
    await t.expect(params.personId).eql('197001016666', 'Not Okey, mKay?')

### Get Cookies

Get yer cookies with `const cooks = await support.getCookies()`.

### Session objects

Data set by the `storeSession(val)` function can be restored with `restoreSession()` in a later test. If the second test is requested with the same UUID set in the body as the first test gives in the response. The session cookie data will be set automatically from that ID.

    