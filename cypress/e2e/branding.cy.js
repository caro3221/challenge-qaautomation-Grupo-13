describe('Módulo Branding', function() {
  describe('TC027 — Cambiar logo Branding', { retries: { runMode: 1, openMode: 0 } }, function() {

    let datos

    before(function() {
      cy.fixture('bookingsData').then(function(d) {
        datos = d.branding
      })
    })

    beforeEach(function() {
      cy.login('admin', 'password')
      cy.contains('Branding').click()
      cy.url().should('include', '/branding', { timeout: 10000 })
      cy.wait(2000)
    })

    it('Completar todos los campos de branding y guardar', function() {
      cy.get('#name').clear().type(datos.name)
      cy.get('#logoUrl').clear().type(datos.logoUrl)
      cy.get('#description').clear().type(datos.description)
      cy.get('#latitude').clear().type(datos.latitude)
      cy.get('#longitude').clear().type(datos.longitude)
      cy.get('#directions').clear().type(datos.directions)
      cy.get('#contactName').clear().type(datos.contactName)
      cy.get('#contactPhone').clear().type(datos.contactPhone)
      cy.get('#contactEmail').clear().type(datos.contactEmail)
      cy.get('#line1').clear().type(datos.line1)
      cy.get('#line2').clear().type(datos.line2)
      cy.get('#postTown').clear().type(datos.postTown)
      cy.get('#county').clear().type(datos.county)
      cy.get('#postCode').clear().type(datos.postCode)

      cy.intercept('PUT', '/api/branding*').as('guardarBranding')
      cy.get('#updateBranding').should('be.enabled').click({ force: true })
      cy.wait('@guardarBranding', { timeout: 10000 }).its('response.statusCode').should('eq', 200)
      cy.contains('Branding updated!', { timeout: 10000 }).should('be.visible')
      cy.contains('Close').click()
    })
  })
})
