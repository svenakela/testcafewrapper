describe('My First Test', function() {
  
  it('Validate config value', function() {
    expect(Cypress.env().personId).to.equal('197001016666')
  })
})
