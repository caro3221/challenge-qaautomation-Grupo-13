// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => { 
    cy.visit('https://automationintesting.online/admin') //Navegar al login
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.get('#doLogin').click()
 })

Cypress.Commands.add("openBookingForm", () => {
  cy.visit("https://automationintesting.online/");
  cy.get('a.btn-primary[href*="reservation/1"]').click();
  cy.contains("Reserve Now").click({ force: true });
});

Cypress.Commands.add('fillBookingForm', (guest) => {
  cy.get('input[name="firstname"]').clear().type(guest.firstname)
  cy.get('input[name="lastname"]').clear().type(guest.lastname)
  cy.get('input[name="email"]').clear().type(guest.email)
  cy.get('input[name="phone"]').clear().type(guest.phone)
})

Cypress.Commands.add('setReactDate', { prevSubject: 'element' }, function($el, date) {
  $el.val(date).get(0).dispatchEvent(new Event('input', {bubbles: true}))
})

// buscar disponibilidad con fechas fijas
Cypress.Commands.add('searchAvailability', (checkIn, checkOut) => {
  cy.get('input').eq(0).clear().type(checkIn)
  cy.get('input').eq(1).clear().type(checkOut)
  cy.contains('Check Availability').click()
})

