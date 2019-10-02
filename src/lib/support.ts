import { Role } from 'testcafe';
import http from 'http';
import pino from 'pino';

export default class Support {

  private logger = pino();
  private t: TestController = null;
  private params: any = null;

  constructor(testController: TestController, async_params: any) {
    if (typeof async_params === 'undefined') {
      throw new Error('Cannot be called directly');
    }
    this.t = testController;
    this.params = async_params;
  }

  static async build(testController: TestController) {
    var async_params = await this.evalParameters(testController);
    return new Support(testController, async_params);
  }
      
  static async evalParameters(t: TestController) {
    //@ts-ignore This function is executed in the browser so ok to suppress error.
    let params = await t.eval(() => getParametersFromRunner666());
    return params;
  }

  private cached(cache: string, value: string, params: any) {
    this.logger.info('CACHE POST:', params.uuid, value);
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

  cacheResponse(value: string) {
    return this.cached('response', value, this.params);
  }

  storeSession(userRole: Role) {
    let serializedUserRole = JSON.stringify(userRole);
    return this.cached('session', serializedUserRole, this.params);
  }

  async restoreSession() {
    let userRole = this.deSerializeUserRole(this.getSessionData());
    this.t.useRole(userRole);
  }

  getParameters() {
    return this.params;
  }

  getSessionData() {
    return this.params.session;
  }

  deSerializeUserRole(userRoleObject: Role) {
		let instance: Role = Role('', async t => {});               

		Object.assign(instance, userRoleObject);
		return instance;
	}

}
