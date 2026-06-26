import "./commands";
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})
Cypress.Commands.add('login', (username, password) => {

  cy.visit('https://automationintesting.online/admin')

  cy.get('#username')
    .type(username)

  cy.get('#password')
    .type(password)

  cy.get('#doLogin')
    .click()

  cy.url()
    .should('include', '/admin/rooms')
})