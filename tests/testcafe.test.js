import Support from '../lib/support';
import pino from 'pino';

const logger = pino();

fixture `testcafe`
    .page `http://devexpress.github.io/testcafe/example`

test('testcafe', async t => {

    const support = await Support.build(t)
    support.cacheResponse('{"x": "y"}')

    const params = await support.getParameters()
    await t.expect(params.personId).eql('197001016666', 'Not Okey, mKay?')

    const cooks = await support.getCookies()
    logger.info('Got cookies:', cooks)
    support.storeSession(cooks)
})
