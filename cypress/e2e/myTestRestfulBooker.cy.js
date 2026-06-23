// 3.1 Reserva exitosa como usuario invitado

describe('TC011 - Reserva exitosa como usuario invitado - Shady Meadows B&B', () => {

  beforeEach(() => {
    cy.on('uncaught:exception', () => false)
    cy.visit('https://automationintesting.online')
    cy.contains('Check Availability & Book Your Stay').scrollIntoView()
  })

  it('Reservar habitación disponible con datos válidos', () => {

    // Seleccionar fechas válidas y verificar disponibilidad
    cy.get('input')
      .eq(0)
      .clear()
      .type('22/09/2026') 
    cy.get('input')
      .eq(1)
      .clear()
      .type('23/09/2026')  
    cy.contains('Check Availability').click()

    // verificar que se muestran habitaciones disponibles
    cy.contains('Book now').should('be.visible')

    // Seleccionar una habitación disponible
    cy.contains('Book now').first().click()

    cy.url().should('include', 'checkin=2026-09-22')
    cy.url().should('include', 'checkout=2026-09-23')

    // Abrir el formulario de reserva
    cy.contains('Reserve Now').click()
    cy.get('input[name="firstname"]').type('Pepe')
    cy.get('input[name="lastname"]').type('Gomez')
    cy.get('input[name="email"]').type('pepe@email.com')
    cy.get('input[name="phone"]').type('12345678910')

    cy.contains('Reserve Now').click()

    // Mensaje de éxito 
    cy.contains('Booking Confirmed').should('be.visible')
    cy.contains('Your booking has been confirmed for the following dates:').should('be.visible')
    cy.contains('Return home').should('be.visible')

  })

})