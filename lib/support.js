import { ClientFunction } from 'testcafe';
import http from 'http';
import pino from 'pino';

const logger = pino();

function cached(cache, value, params) {
  logger.info('GETTING PARAMS', params);
  let options = {
    url: 'http://localhost',
    port: params.port,
    path: '/cache/v1/' + cache + '/' + params.uuid,
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

async function evalParameters(t) {
  let params = await t.eval(() => getParametersFromRunner666());
  return params;
}

export default class Support {
  constructor(testController, async_params) {
    if (typeof async_params === 'undefined') {
      throw new Error('Cannot be called directly');
    }
    this.t = testController;
    this.params = async_params;
  }

  static async build(testController) {
    var async_params = await evalParameters(testController);
    return new Support(testController, async_params);
  }

  cacheResponse(value) {
    return cached('response', value, this.params);
  }

  storeSession(value) {
    return cached('session', value, this.params);
  }

  restoreSession() {
    if (this.params && this.params.session && this.params.session.cookies) {
      logger.info('Restoring session values');
      const setCookie = ClientFunction((key, value) => {
        document.cookie = key + "=" + value;
      });
      this.params.session.cookies.forEach(function (cookie) {
        setCookie(cookie.name, cookie.value);
      });
    } else {
      logger.warn('Cannot restore session values because they do not exist');
    }
  }

  getCookies = ClientFunction(() => {
      var pairs = document.cookie.split(";");
      var cookies = [];
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("=");
        cookies[i] = { name: (pair[0] + '').trim(), value: unescape(pair.slice(1).join('=')) };
      }
      return cookies;
    });

  getParameters() {
    return this.params;
  }

}
