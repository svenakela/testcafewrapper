import Support from '../../../lib/support';
import pino from 'pino';
import { Selector } from 'testcafe';


const logger = pino();

fixture `testcafe`
    .page `https://www.procyclingstats.com/race/tour-de-france/2021/gc/stages/winners`

test('testcafe', async t => {

    const support = await Support.build(t)
    const cooks = await support.getSessionData()
    logger.info('Got cookies:', cooks)

    
    let response = await t.eval( () => {
        let response = []
        for (let tr of document.querySelectorAll('.basic')[0].rows) {
            let stage = tr.cells[2]
                            .innerText
                            .split('|')[0]
                            .trim()
            let firstname = tr.cells[3]
                            .innerText
                            .trim()
                            .split(' ')
                            .slice()
                            .pop()
            let surname = tr.cells[3]
                            .innerText
                            .replace(firstname, '')
                            .trim()

            let result = {}
            result.key = stage
            result.value = stage + ': ' + surname + ', ' + firstname
            response.push(result)
        }
        return response
    })
    
    support.cacheResponse(JSON.stringify(response))

})
