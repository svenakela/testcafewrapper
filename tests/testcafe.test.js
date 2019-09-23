import Support from '../lib/support';

fixture `testcafe`
    .page `http://devexpress.github.io/testcafe/example`;

test('testcafe', async t => {

    let support = new Support(t);
    support.cacheValue('{"x": "y"}');

    let mockValues =  JSON.parse(t.testRun.opts.clientScripts.values().next().value.content);
    console.log(t.testRun.opts.clientScripts)
    await t.expect(mockValues.personId).eql('197001016666', 'Not Okey, mKay?')
})
