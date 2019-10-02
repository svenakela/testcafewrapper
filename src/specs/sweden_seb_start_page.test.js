import { Selector } from 'testcafe';
import { Support } from '../lib/support';

fixture`lokal.seb.test`

test('Välj konton', async t => {

  const support = await Support.build(t);
  await support.restoreSession();

  await t
    .click(Selector('#mi2'))
    .wait(5000);

});