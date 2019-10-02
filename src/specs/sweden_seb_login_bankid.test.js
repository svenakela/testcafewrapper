import { Selector, ClientFunction, Role } from 'testcafe';
import { Support } from '../lib/support';

fixture`lokal.seb.test`

test('Välj konton', async t => {

  // Create the support class we use to communicate with testcafe
  const support = await Support.build(t);

  // Let the user login, bank id
  const userRole = Role('https://seb.se', async (t) => {
    await t
      .click(Selector('button').withText('Logga in'))
      .click(Selector('[title="Privat"][data-link-name="Privat"].pw-dropdown__link'))
      .typeText(Selector('#AM1'), support.getParameters().personId)
      .click(Selector('#K1M'))
      .expect(Selector('a').withText('Logga ut').exists).ok();
  }, { preserveUrl: true });

  await t.useRole(userRole);
  await t.navigateTo('https://privat.ib.seb.se/wow/1000/1100/wown1100.aspx?M1=Show');

  // Get the logged in name
  const name = await Selector('span').withText('Inloggad:').nextSibling().innerText;

  // Extract account select list
  const accountsOption = await Selector('option').withAttribute('optiongroup', name);
  const numOfAccounts = await accountsOption.count;
  let accounts = { bank: 'SEB', accounts: new Array(numOfAccounts) };

  // Create account response to robot
  for (let n = 0; n < numOfAccounts; n++) {
    let innerText = await accountsOption.nth(n).innerText;
    let accountMatcher = innerText.match('(.*)\\s+\\((\\d.*)\\)\\s+(.*)');
    accounts.accounts[n] = { name: accountMatcher[1], accountNumber: accountMatcher[2], balance: accountMatcher[3] };
  }
  const getPageUrl = ClientFunction(() => window.location.href);
  const thisUrl = await getPageUrl();
  support.storeSession(userRole);
  support.cacheResponse(JSON.stringify(accounts));

});