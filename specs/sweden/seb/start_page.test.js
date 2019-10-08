import { Selector } from 'testcafe';
import Support from '../../../lib/support';

fixture`lokal.cafe.test`;

test('Välj konton', async t => {
  const support = await Support.build(t);
  await support.restoreSession();
  await t.click(Selector('#mi2'));
  test('Debug', async t => {
    await t.wait(200000);
  });
});