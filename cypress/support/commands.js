Cypress.Commands.add("loginAdmin", (username, password) => {
  cy.visit("https://automationintesting.online/admin/");
  cy.get("#username").type(username);
  cy.get("#password").type(password);
  cy.get("#doLogin").click();
});

Cypress.Commands.add("openBookingForm", () => {
  cy.visit("https://automationintesting.online/");
  cy.get('a.btn-primary[href*="reservation/1"]').click();
  cy.contains("Reserve Now").click({ force: true });
});
