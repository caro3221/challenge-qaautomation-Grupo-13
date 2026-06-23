// TC011 / CASO 3.1 - Reserva exitosa como usuario invitado con datos válidos

describe('TC011 - Reserva exitosa como usuario invitado - Shady Meadows B&B', () => {

  beforeEach(() => {
    cy.on('uncaught:exception', () => false)
    cy.visit('https://automationintesting.online')
    cy.contains('Check Availability & Book Your Stay').scrollIntoView()
  })

  it('Reservar habitación disponible con datos válidos', () => {

    cy.fixture('guestUser').then((guestUser) => {

      // buscar disponibilidad
      cy.searchAvailability('25/07/2026', '29/07/2026')
      cy.contains('Book now').should('be.visible')

      // seleccionar habitación disponible
      cy.contains('Book now').first().click()

      cy.contains('Reserve Now').click()
      cy.fillBookingForm(guestUser)
      cy.contains('Reserve Now').click()

      //  mensaje de éxito
      cy.contains('Booking Confirmed').should('be.visible')
      cy.contains('Your booking has been confirmed for the following dates:').should('be.visible')
      cy.contains('Return home').should('be.visible')

    })
  })

})