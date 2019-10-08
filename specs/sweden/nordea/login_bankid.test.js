import { Selector, ClientFunction } from 'testcafe';
import Support from '../../../lib/support';
import { waitForAny } from '../../../lib/case_handler';

fixture`sweden_nordea_login_bankid`

test
    ('sweden_nordea_login_bankid', async t => {
        const support = await Support.build(t);

        await support.doRequest('https://internetbanken.privat.nordea.se/nsp/login', async t => {
            await t
                .typeText(Selector('#personnummer'), support.getParameters().personId)
                .click(Selector('#commonlogin').find('[name^="mobilebankidauthorization$requestlogonauthorizatio"]'));

            waitForAny([
                { when: Selector('#log_out_button'), then: () => { onSuccessfullLogin() } },
                { when: Selector('strong').withText('Du har angivit ett felaktigt personnummer eller använt fel format. Försök igen.'), then: () => { onFailedLogin() } },
            ], 10);
            console.log('WADDUPZZZZ');

            async function onSuccessfullLogin() {
                collectAccount();
            }

            async function collectAccount() {
                const accounts = [];

                const accountTableContent = await Selector('#currentaccountsoverviewtable').innerText;
                const accountMatcher = accountTableContent.match(/(?:[A-z]+)\s(?:[0-9, -]+)\s(?:[0-9]+,[0-9]{2})/g);

                accountMatcher.forEach((match) => {
                    const account = match.split('\t');
                    accounts.push({ name: account[0], accountNumber: account[1], balance: account[2] })
                });

                support.cacheResponse(JSON.stringify(accounts));

            }

            function onFailedLogin() {
                support.cacheResponse(JSON.stringify({ error: 'Failed to login.' }));
                throw "Failed to login";
            }
        });

    });