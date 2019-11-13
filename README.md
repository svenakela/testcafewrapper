# BROWSER INTERACTION WRAPPER

Wrapping the test tool [TestCafe](https://devexpress.github.io/testcafe/) with a REST interface making it possible to run specs with an http request.

## Usage

- You need npm on your computer

- Clone this repository

- Execute `npm install --save-dev` to setup the project

- Run the server with `npm run start` 

- Make a spec request to the server: 
    `curl -v -w '@curl_time.txt' --header 'Content-Type: application/json' --data '{"specData":{"personId":"197001016666","uuid":"42092208-432d-445b-9714-bfdd0f01a5e5"}}' http://localhost:5000/specs/v1/test/test/testcafe`

- Make your own specs, store them under `./specs/{dir/subdir}` and request them with `http://localhost/specs/v1/{dir/subdir/spec-name}`. The two levels dir structure is explained below. 

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

### Specs Structure

There are two levels in the REST call and they represent the directory structure for the tests. The reason is that the project is used for several products and projects, hence the specs are saved under `specs/{product}/{project}/{spec_name}`. You can choose whatever directory names you want, out of the box the wrapper requires two directory layers and they can be named as you like.

The specifications should be named `{test_name}.test.js`. When calling the test you only use the `{test_name}` part. Let's say a test is created with the name `playing_game_allowed.test.js` under the directory `specs/gaming/tuxcart/` your URL will be 
`http://localhost:5000/specs/v1/gaming/tuxcart/playing_game_allowed`.

### Support functions

When running a spec, there are a few support features in the `Support` class found in `lib/support`. The support class is created by using the static builder `Support.build(t)` where `t` is the TestController you get from TestCafé in a spec file.

### Session Support

If a page requires sessions over several requests make sure to use the `Support.doRequest(url, action)` function. By doing this the spec can go through a login step and then the session will be cached in 15 min waiting to be used in sequential specs. In every request the response to the client present a UUID. If this UUID is sent with a following request the session will automatically be added onto the new request and the authenticated user can continue to work on the page.

    await support.doRequest('https://privat.ib.seb.se/wow/1000/1000/wow1020.aspx', async t => {
        // Do your web page interaction, logging in and such
    })

Then, in a following request

      await support.doRequest(null, async t => {
          await t.click(Selector('#mi2')).wait(5000)
      });

### Response data

Data saved with the `cacheResponse` function will be appended to the client response. Prepare you data object and stringify it to the cache.

    support.cacheResponse(JSON.stringify(accounts))

Only one data object can exist per spec, but the data object can contain several objects or JSON structures.
