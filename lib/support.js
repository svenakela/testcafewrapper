import { Role } from 'testcafe';
import SimpleRequestHook from './simple_request_hook';
import http from 'http';
import pino from 'pino';

const logger = pino();

function cached(cache, value, params) {
  logger.info('CACHE POST:', params.uuid, value);
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

  async restoreSession() {
    const requestHook = new SimpleRequestHook();
    let userRole = this.deSerializeUserRole(this.getSessionData());
    await this.t.addRequestHooks(requestHook).useRole(userRole);
  }

  getParameters() {
    return this.params;
  }

  getSessionData() {
    return this.params.session;
  }

  deSerializeUserRole(userRoleObject) {
		let instance = new Role('', t => {});               

		Object.assign(instance, userRoleObject);
		return instance;
	}

  async login(loginPage, loginActions) {
    const user = Role(loginPage, loginActions, { preserveUrl: true });
    await this.t.useRole(user);
    this.storeSession(user);
  }

}
