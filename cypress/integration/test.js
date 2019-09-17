describe('My First Test', function() {
  
  it('Validate config value', function() {
    cy.task('cache', '{"testReturnValue":"Will be added to the response", "aNumber":123}')
    expect(Cypress.env().personId).to.equal('197001016666')
  })
})
