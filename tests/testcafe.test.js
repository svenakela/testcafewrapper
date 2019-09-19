import { Selector } from 'testcafe';

fixture `testcafe`
    .page `http://devexpress.github.io/testcafe/example`;

test('testcafe', async t => {
    let mockValues =  JSON.parse(t.testRun.opts.clientScripts.values().next().value.content);
    console.log(t.testRun.opts.clientScripts)
    await t.expect(mockValues.personId).eql('197001016666', 'Not Okey, mKay?')
})
