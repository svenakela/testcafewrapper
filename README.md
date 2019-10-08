# BROWSER INTERACTION WRAPPER

Wrapping the test tool [TestCafe](https://devexpress.github.io/testcafe/) with a REST interface making it possible to run specs with an http request.

## Usage

- You need npm on your computer

- Clone this repository

- Execute `npm install --save-dev` to setup the project

- Run the server with `npm run start` 

- Make a spec request to the server: 
    `curl -v -w '@curl_time.txt' --header 'Content-Type: application/json' --data '{"specData":{"personId":"197001016666","uuid":"42092208-432d-445b-9714-bfdd0f01a5e5"}}' http://localhost:5000/specs/v1/test/test/testcafe`

- Make your own specs, store them under `./specs/` and request them with `http://localhost/specs/v1/{country}/{bank}/{spec-name}`

## Interaction

### Sending Parameters

When invoking a spec via the REST interface, parameters can be sent to the spec as a JSON string. The JSON structure will be injected into the spec page and can be reached by the `getParameters()` function.

    const support = await Support.build(t)
    const params = await support.getParameters()
    await t.expect(params.personId).eql('197001016666', 'Not Okey, mKay?')

To send parameters from a client add them as a JSON body. In the example below the spec will get `personId` and `uuid`to work with. What to send is up to the spec itself, the server passes the `specData` config through. Also, in the example below the spec is running with a different browser than default, `firefox` instead of `chrome:headless`. This is handy when developing new specs.

    curl -v -w '@curl_time.txt' --header 'Content-Type: application/json' --data '{"specData":{"personId":"197001016666","uuid":"42092208-432d-445b-9714-bfdd0f01a5e5"}, "config":{"browser":"firefox"}}' http://localhost:5000/specs/v1/test/test/testcafe

### Creating Responses

Data set by the `storeSession(val)` function can be restored with `restoreSession()` in a later spec. If the second spec is requested with the same UUID set in the body as the first spec gives in the response. The session cookie data will be set automatically from that ID.

## Making Specifications

When running a spec, there are a few support features in the `Support` class found in `lib/support`. The support class is created by using the static builder `Support.build(t)` where `t` is the TestController you get from TestCafé in a spec file.

### Login Support

