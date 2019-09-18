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

module.exports = (on, config) => {
  on('task', {
    cache (value) {
      console.log(config.env.uuid);
      value.uuid = config.env.uuid;
      let options = {
        url: 'http://localhost',
        port: config.env.port,
        path: '/cache/' + config.env.uuid,
        method: 'POST',
        headers : {
          'Content-Type': 'application/json'
        }
      };
      let request = http.request(options);
      request.write(value);
      request.end();
      return options;
    },
    
    storeSession (value) {
        console.log(config.env.uuid);
        let options = {
          url: 'http://localhost',
          port: config.env.port,
          path: '/session-cache/' + config.env.uuid,
          method: 'POST',
          headers : {
            'Content-Type': 'application/json'
          }
        };
        let request = http.request(options);
        request.write(value);
        request.end();
        return options;
      }
  })
}

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

//module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
//}
