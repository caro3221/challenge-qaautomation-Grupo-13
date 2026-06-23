// buscar disponibilidad con fechas fijas
Cypress.Commands.add('searchAvailability', (checkIn, checkOut) => {
  cy.get('input').eq(0).clear().type(checkIn)
  cy.get('input').eq(1).clear().type(checkOut)
  cy.contains('Check Availability').click()
})

// completar el formulario de reserva 
Cypress.Commands.add('fillBookingForm', (guestUser) => {
  cy.get('input[name="firstname"]').type(guestUser.firstname)
  cy.get('input[name="lastname"]').type(guestUser.lastname)
  cy.get('input[name="email"]').type(guestUser.email)
  cy.get('input[name="phone"]').type(guestUser.phone)
})