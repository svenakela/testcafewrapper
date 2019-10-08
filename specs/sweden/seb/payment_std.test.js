import { Selector } from 'testcafe';
import Support from '../../../lib/support';
import { waitForAny } from '../../../lib/case_handler';

fixture`sweden.seb.payment_std`

test('Make a standard payment', async t => {

  const support = await Support.build(t);
  const params = support.getParameters();

  await support.doRequest(null, async t => {
    await t
      .click(Selector('.toggle-btn').find('span').withText('Betala & överföra'))
      .click(Selector('#mi162').find('[title="Betala & överföra"]'))

      .typeText(Selector('#IKPMaster_MainPlaceHolder_A1'), params.toAccount)
      .typeText(Selector('#IKPMaster_MainPlaceHolder_A3'), params.amount)

      //.click(Selector('#IKPMaster_MainPlaceHolder_AO5'))

      .click(Selector('#IKPMaster_MainPlaceHolder_A2'))
      .click(Selector('#IKPMaster_MainPlaceHolder_A2').find('option').withText(params.fromAccount))

      .click(Selector('#IKPMaster_MainPlaceHolder_M'))
      .typeText(Selector('#IKPMaster_MainPlaceHolder_A5'), params.reference)
      .typeText(Selector('#IKPMaster_MainPlaceHolder_A6'), 'Trustly Payment Have a Nice Day')

      .click(Selector('#IKPMaster_MainPlaceHolder_BTN_ADB'))
      .click(Selector('#IKPMaster_MainPlaceHolder_BTN_SEND'))
      .click(Selector('#IKPMaster_MainPlaceHolder_ucVerify_BTN_OK'));

      await waitForAny([
        { when: Selector('h4').withText('Vi har tagit emot dina uppdrag och kommer att utföra dem'), then: () => done() },
        { when: Selector('h3').withText('Vi kunde inte göra din betalning'), then: () => fail() }
      ], 120);

  })
});

