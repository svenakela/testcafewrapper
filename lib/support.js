import { Role, RequestMock } from 'testcafe';
import SimpleRequestHook from './request_hooks/simple_request_hook';
import BrowserCookieHook from './request_hooks/browser_cookie_request_hook';
import http from 'http';
import pino from 'pino';

const logger = pino();

function cached(cache, value, params) {
  logger.info(`CACHE POST: ${params.uuid}, ${value}`);
  let options = {
    method: 'POST',
    url: 'http://localhost',
    port: params.port,
    path: '/cache/v1/' + cache + '/' + params.uuid,
    json: true,
    body: value,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const request = http.request(options);
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

  storeSession(userRole) {
    let serializedUserRole = JSON.stringify(userRole);
    return cached('session', serializedUserRole, this.params);
  }

  getParameters() {
    return this.params;
  }

  getSessionData() {
    return this.params.session;
  }

  deSerializeUserRole(userRoleObject) {
    let instance = new Role('', t => { });

    Object.assign(instance, userRoleObject);
    return instance;
  }

  async doRequest(loginPage, actions) {
    let user;

    if (this.getSessionData() == undefined) {
      user = Role(loginPage, actions, { preserveUrl: true });
      await this.useRole(user);
    } else {
      user = this.deSerializeUserRole(this.getSessionData());
      await this.useRole(user);
      await actions(this.t);
    }
    
    const cookieObject = JSON.parse(user.stateSnapshot.cookies);
    const cookieHook = new BrowserCookieHook(cookieObject.cookies);
    const preservedUrl = user.url;

    var requestMock = RequestMock()
      .onRequestTo(preservedUrl)
      .respond((req, res) => {});

    await this.t.addRequestHooks([cookieHook, requestMock]).eval(() => location.reload(true));

    user.stateSnapshot.cookies = JSON.stringify(cookieObject);
    user.url = preservedUrl;

    this.storeSession(user);
  }

  async useRole(user) {
    const requestHook = new SimpleRequestHook(this.getParameters().requestHeaders);
    await this.t.addRequestHooks(requestHook).useRole(user)
  }
}
