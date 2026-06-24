Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Formulario de Contacto', () => {

    beforeEach(() => {
        cy.visit('https://automationintesting.online/')
    })

    it('Enviar formulario de contacto con datos válidos', () => {

        cy.get('#contact').scrollIntoView()

        cy.get('[data-testid="ContactName"]')
            .type('Juan Perez')

        cy.get('[data-testid="ContactEmail"]')
            .type('JuanPerez@email.com')

        cy.get('[data-testid="ContactPhone"]')
            .type('112233445566')

        cy.get('[data-testid="ContactSubject"]')
            .type('Consulta sobre disponibilidad')

        cy.get('[data-testid="ContactDescription"]')
            .type('Buenos días, quería consultar si tienen disponibilidad. Muchas gracias.')

        cy.contains('Submit').click()
        cy.wait(3000)

        cy.contains('Thanks for getting in touch')
          .should('be.visible')

    })

})

