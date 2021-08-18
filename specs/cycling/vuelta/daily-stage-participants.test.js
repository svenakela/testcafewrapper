import Support from '../../../lib/support';
import pino from 'pino';
import { Selector } from 'testcafe';


const logger = pino();

fixture `testcafe`
    .page `https://www.procyclingstats.com/race/vuelta-a-espana/2021/gc/startlist/alphabetical-with-filters`

test('testcafe', async t => {

    const support = await Support.build(t)
    const cooks = await support.getSessionData()
    logger.info('Got cookies:', cooks)

    
    let response = await t.eval( () => {
        let response = []
        Array.prototype.filter.call(
            document.querySelectorAll('.basic')[0].rows, 
            (tr) => tr.cells[0].innerText !== '#')
                .map(tr => {
                    let key = tr.cells[1].innerText;
                    let firstname = Array.prototype.filter.call(
                        tr.cells[1].querySelector('a').childNodes, 
                            function (element) {
                                return element.nodeType === Node.TEXT_NODE
                            })
                        .map(text => text.textContent)
                        .join()
                        .trim();
                    let surname = tr.cells[1].querySelector('.uppercase').innerHTML;
                    let result = {}
                    result.key = key
                    result.value = surname + ', ' + firstname
                    response.push(result)
                });

        return response;
    })

    support.cacheResponse(JSON.stringify(response))

})