// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const http = require('http');
const pino = require('pino')();

const cached = (cache, value, config) => {
  let options = {
    url: 'http://localhost',
    port: config.env.port,
    path: '/cache/v1/' + cache + '/' + config.env.uuid,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let request = http.request(options);
  request.write(value);
  request.end();
  return options;
}

module.exports = (on, config) => {
  on('task', {
    cache(value) {
      value.uuid = config.env.uuid;
      return cached('cache', value, config);
    },

    storeSession(value) {
      return cached('session', value, config);
    },

    log(value) {
      pino.info(value);
      return null;
    }
  })
}

