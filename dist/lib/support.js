"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testcafe_1 = require("testcafe");
const http_1 = __importDefault(require("http"));
const pino_1 = __importDefault(require("pino"));
class Support {
    constructor(testController, async_params) {
        this.logger = pino_1.default();
        this.t = null;
        this.params = null;
        if (typeof async_params === 'undefined') {
            throw new Error('Cannot be called directly');
        }
        this.t = testController;
        this.params = async_params;
    }
    static build(testController) {
        return __awaiter(this, void 0, void 0, function* () {
            var async_params = yield this.evalParameters(testController);
            return new Support(testController, async_params);
        });
    }
    static evalParameters(t) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore This function is executed in the browser so ok to suppress error.
            let params = yield t.eval(() => getParametersFromRunner666());
            return params;
        });
    }
    cached(cache, value, params) {
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
        const request = http_1.default.request(options);
        request.write(value);
        request.end();
        return options;
    }
    cacheResponse(value) {
        return this.cached('response', value, this.params);
    }
    storeSession(userRole) {
        let serializedUserRole = JSON.stringify(userRole);
        return this.cached('session', serializedUserRole, this.params);
    }
    restoreSession() {
        return __awaiter(this, void 0, void 0, function* () {
            let userRole = this.deSerializeUserRole(this.getSessionData());
            this.t.useRole(userRole);
        });
    }
    getParameters() {
        return this.params;
    }
    getSessionData() {
        return this.params.session;
    }
    deSerializeUserRole(userRoleObject) {
        let instance = testcafe_1.Role('', (t) => __awaiter(this, void 0, void 0, function* () { }));
        Object.assign(instance, userRoleObject);
        return instance;
    }
}
exports.default = Support;
//# sourceMappingURL=support.js.map