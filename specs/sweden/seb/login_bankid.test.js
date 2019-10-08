import { Selector } from 'testcafe';
import Support from '../../../lib/support';
import { waitForAny } from '../../../lib/case_handler';

fixture`sweden.seb.login`

test('Login and get account', async t => {

  // Create the support class we use to communicate with testcafe
  const support = await Support.build(t);

  // Let the user login, bank id
  await support.doRequest('https://privat.ib.seb.se/wow/1000/1000/wow1020.aspx', async t => {

    await t.typeText(Selector('#AM1'), support.getParameters().personId)
      .click(Selector('#K1M'));

    const failedLogin = async function () {
      support.cacheResponse('{"error": "Login failed"}');
    }
    
    const loggedIn = async function () {
      // Get the logged in name
      const name = await Selector('span').withText('Inloggad:').nextSibling().innerText;
      // Extract account select list
      await t.click(Selector('span').withText('Konton & kort'))
        .click(Selector('#mi9').find('a').withText('Mina konton'))
      const accountsOption = await Selector('option').withAttribute('optiongroup', name);
      const numOfAccounts = await accountsOption.count;

      let accounts = { bank: 'SEB', accounts: new Array(numOfAccounts) };
      // Create account response to robot
      for (let n = 0; n < numOfAccounts; n++) {
        let innerText = await accountsOption.nth(n).innerText;
        let accountMatcher = innerText.match('(.*)\\s+\\((\\d.*)\\)\\s+(.*)');
        accounts.accounts[n] = { name: accountMatcher[1], accountNumber: accountMatcher[2], balance: accountMatcher[3] };
      }
      support.cacheResponse(JSON.stringify(accounts));
    };

    await waitForAny([
      { when: Selector('a').withText('Logga ut'), then: () => loggedIn() },
      { when: Selector('h1').withText(/Ofullständiga uppgifter|Verifiera ditt mobila BankID/), then: () => failedLogin() }
    ], 120);

  });
});