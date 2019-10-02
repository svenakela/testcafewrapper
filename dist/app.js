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
const express_1 = __importDefault(require("express"));
const testcafe_1 = __importDefault(require("testcafe"));
const body_parser_1 = __importDefault(require("body-parser"));
const node_cache_1 = __importDefault(require("node-cache"));
const v4_1 = __importDefault(require("uuid/v4"));
const pino_1 = __importDefault(require("pino"));
const express_pino_logger_1 = __importDefault(require("express-pino-logger"));
const PORT = 5000;
const cache = new node_cache_1.default({ stdTTL: 30, checkperiod: 120 });
const sessionCache = new node_cache_1.default({ stdTTL: 900, checkperiod: 120 });
const caches = new Map([['response', cache], ['session', sessionCache]]);
const logger = pino_1.default();
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(express_pino_logger_1.default({ logger: logger }));
app.post('/cafe/v1/run/:specName', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { specName } = req.params;
    const uuid = req.body.uuid == undefined ? v4_1.default() : req.body.uuid;
    req.body.uuid = uuid;
    req.body.session = sessionCache.get(uuid);
    req.body.port = PORT;
    req.log.info('Requesting spec', specName, 'with configuration:', req.body);
    const scriptContent = `
    function getParametersFromRunner666() {
      return ${JSON.stringify(req.body)};
    }
  `;
    testcafe_1.default('localhost').then(cafe => {
        cafe.createRunner()
            .src('dist/specs/' + specName + '.test.js')
            .clientScripts({ content: scriptContent })
            .reporter('json')
            .run()
            .then(result => {
            let responseValues = cache.get(req.body.uuid) == undefined ? {} : cache.get(req.body.uuid);
            res.status(200).send({
                result: result,
                values: responseValues,
                uuid: req.body.uuid
            });
        })
            .catch(err => {
            next(err);
        });
    })
        .catch(err => {
        next(err);
    });
}));
app.post('/cache/v1/:type/:id', (req, res) => {
    const { type, id } = req.params;
    const { body } = req;
    caches.get(type).set(id, body, function (error, success) {
        if (!error && success) {
            res.status(200).send({
                id: id,
                cache: caches.get(type).get(id)
            });
        }
        else {
            res.status(500).send({
                id: id
            });
        }
    });
});
app.listen(PORT, () => {
    logger.info('Listening on port', PORT);
});
//# sourceMappingURL=app.js.map