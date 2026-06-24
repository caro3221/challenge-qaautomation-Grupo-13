Cypress.on('uncaught:exception', () => false)

describe('Formulario de Contacto - vacío', () => {

  beforeEach(() => {
    cy.visit('https://automationintesting.online/')
  })

  it('No permite enviar formulario vacío', () => {

    // 🔥 1. intercept ANTES del click
    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.get('#contact').scrollIntoView()

    cy.contains('Submit').click()

    // 🔥 2. esperar request
    cy.wait('@sendMessage').then((interception) => {

      expect(interception.response.statusCode).to.be.oneOf([400, 422])

    })

    // 🔥 3. validar que NO hay éxito
    cy.contains('Thanks for getting in touch').should('not.exist')

  })

})