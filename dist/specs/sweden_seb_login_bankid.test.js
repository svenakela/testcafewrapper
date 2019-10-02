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
    // Create the support class we use to communicate with testcafe
    const support = yield support_1.Support.build(t);
    // Let the user login, bank id
    const userRole = testcafe_1.Role('https://seb.se', (t) => __awaiter(void 0, void 0, void 0, function* () {
        yield t
            .click(testcafe_1.Selector('button').withText('Logga in'))
            .click(testcafe_1.Selector('[title="Privat"][data-link-name="Privat"].pw-dropdown__link'))
            .typeText(testcafe_1.Selector('#AM1'), support.getParameters().personId)
            .click(testcafe_1.Selector('#K1M'))
            .expect(testcafe_1.Selector('a').withText('Logga ut').exists).ok();
    }), { preserveUrl: true });
    yield t.useRole(userRole);
    yield t.navigateTo('https://privat.ib.seb.se/wow/1000/1100/wown1100.aspx?M1=Show');
    // Get the logged in name
    const name = yield testcafe_1.Selector('span').withText('Inloggad:').nextSibling().innerText;
    // Extract account select list
    const accountsOption = yield testcafe_1.Selector('option').withAttribute('optiongroup', name);
    const numOfAccounts = yield accountsOption.count;
    let accounts = { bank: 'SEB', accounts: new Array(numOfAccounts) };
    // Create account response to robot
    for (let n = 0; n < numOfAccounts; n++) {
        let innerText = yield accountsOption.nth(n).innerText;
        let accountMatcher = innerText.match('(.*)\\s+\\((\\d.*)\\)\\s+(.*)');
        accounts.accounts[n] = { name: accountMatcher[1], accountNumber: accountMatcher[2], balance: accountMatcher[3] };
    }
    const getPageUrl = testcafe_1.ClientFunction(() => window.location.href);
    const thisUrl = yield getPageUrl();
    support.storeSession(userRole);
    support.cacheResponse(JSON.stringify(accounts));
}));
//# sourceMappingURL=sweden_seb_login_bankid.test.js.map