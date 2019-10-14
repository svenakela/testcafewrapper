import { Selector, Role } from 'testcafe';
import Support from '../../../lib/support';

fixture`sweden_nordea_login_bankid`;

test('sweden_nordea_login_bankid', async t => {
	const support = await Support.build(t);
	await support.doRequest(null, async t => {
		await t.click(Selector('#mi2')).wait(5000);
	});
});