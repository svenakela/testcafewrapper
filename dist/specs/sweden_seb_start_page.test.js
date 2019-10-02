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
Object.defineProperty(exports, "__esModule", { value: true });
const testcafe_1 = require("testcafe");
const support_1 = require("../lib/support");
fixture `lokal.seb.test`;
test('Välj konton', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const support = yield support_1.Support.build(t);
    yield support.restoreSession();
    yield t
        .click(testcafe_1.Selector('#mi2'))
        .wait(5000);
}));
//# sourceMappingURL=sweden_seb_start_page.test.js.map