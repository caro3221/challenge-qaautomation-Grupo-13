Cypress.on('uncaught:exception', () => false)

describe('E2E Contacto + Admin', () => {

  const email = `test${Date.now()}@mail.com`

  it('Envía mensaje y lo valida en admin', () => {

    // -------------------------
    // CONTACTO
    // -------------------------
    cy.intercept('POST', '**/api/message').as('sendMessage')

    cy.visit('https://automationintesting.online/')

    cy.get('#contact').scrollIntoView()

    cy.get('[data-testid="ContactName"]').type('Juan Perez')
    cy.get('[data-testid="ContactEmail"]').type(email)
    cy.get('[data-testid="ContactPhone"]').type('1122334455')
    cy.get('[data-testid="ContactSubject"]').type('Consulta automatizada')
    cy.get('[data-testid="ContactDescription"]').type('Mensaje Cypress')

    cy.contains('Submit').click()

    cy.wait('@sendMessage').then((interception) => {
      expect([200, 201, 400]).to.include(interception.response.statusCode)
    })

    // -------------------------
    // ADMIN (SIN LOGIN)
    // -------------------------
    cy.visit('https://automationintesting.online/admin')

    cy.contains('Messages').should('exist')

    cy.contains(email).should('exist')

  })

})