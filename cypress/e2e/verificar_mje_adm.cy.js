Cypress.on('uncaught:exception', () => {
  return false
})

describe('TC006 - Ver detalle de contacto en Admin', () => {

  it('Ver detalle de mensaje recibido', () => {

    const timestamp = Date.now()

    const contact = {
      name: `Prueba Prueba ${timestamp}`,
      email: `carolina${timestamp}@test.com`,
      phone: '11223344556',
      subject: `Consulta sobre reserva ${timestamp}`,
      message: 'Este es un mensaje de prueba generado por Cypress para validar la funcionalidad de contacto y la visualizacion del detalle del mensaje en el panel de administracion.'
    }

    // Enviar mensaje desde Contacto
    cy.visit('https://automationintesting.online/')

    cy.get('[data-testid="ContactName"]').type(contact.name)
    cy.get('[data-testid="ContactEmail"]').type(contact.email)
    cy.get('[data-testid="ContactPhone"]').type(contact.phone)
    cy.get('[data-testid="ContactSubject"]').type(contact.subject)
    cy.get('[data-testid="ContactDescription"]').type(contact.message)

    cy.contains('button', 'Submit').click()

    // Validar mensaje de éxito
    cy.contains('Thanks for getting in touch', { timeout: 10000 })
      .should('be.visible')

    // Login Admin
    cy.visit('https://automationintesting.online/admin')

    cy.fixture('loginData').then((data) => {

      cy.get('#username')
        .clear()
        .type(data.Admin.username)

      cy.get('#password')
        .clear()
        .type(data.Admin.password)

      cy.get('#doLogin').click()
    })

    // Ir a Messages
    cy.contains('Messages')
      .should('be.visible')
      .click()

    cy.url().should('include', '/message')

    // Esperar carga de mensajes
    cy.wait(2000)

    // Verificar que existe al menos un mensaje
    cy.contains(contact.subject, { timeout: 20000 })
  .should('be.visible')
  .click()
  cy.contains(contact.email, { timeout: 20000 })
  .should('be.visible')
  .click()

    // Validar que se abrió el detalle
    cy.get('[data-testid*="message"]')
      .should('exist')

  })

})