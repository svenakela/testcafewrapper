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
const support_1 = __importDefault(require("../lib/support"));
const pino_1 = __importDefault(require("pino"));
const logger = pino_1.default();
fixture `testcafe`
    .page `http://devexpress.github.io/testcafe/example`;
test('testcafe', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const support = yield support_1.default.build(t);
    support.cacheResponse('{"x": "y"}');
    const params = yield support.getParameters();
    yield t.expect(params.personId).eql('197001016666', 'Not Okey, mKay?');
    const cooks = yield support.getSessionData();
    logger.info('Got cookies:', cooks);
    support.storeSession(cooks);
}));
//# sourceMappingURL=testcafe.test.js.map