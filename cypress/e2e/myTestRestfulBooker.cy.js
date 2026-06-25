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
      cy.searchAvailability('25/08/2026', '29/08/2026')
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

// TC017 / CASO 3.2 - Form reserva vacio
describe ('TC017- Form reserva vacio- Shady Meadows B&B ',()=>{

    beforeEach(()=>{
        cy.on('uncaught:exception', () => false)
        cy.visit('https://automationintesting.online')
        cy.contains('Check Availability & Book Your Stay').scrollIntoView()
    })
    // seleccionar fechas de reserva
    it('validar formulario de reserva',()=>{
        //Check In
        cy.get('input')
          .eq(0)
          .clear()
          .type('18/09/2026')
        //Check Out
        cy.get('input')
          .eq(1)
          .clear()
          .type('21/09/2026')
        cy.contains('Check Availability').click()
        cy.contains('Book now').first().click()
        //Validamos datos de Reserva
        cy.url().should('include','checkin=2026-09-18')
        cy.url().should('include','checkout=2026-09-21')
        cy.contains('3 nights').should('be.visible')
        cy.contains('Reserve Now').click()
        //Intentamos confirmar reserva sin completar datos personales
        cy.contains('Reserve Now').click()
        //validamos alerta
        cy.get('[role="alert"]')
          .should('be.visible')
          .and('contain.text','should not be blank')
        //validamos que no hay reserva
        cy.contains('Booking Confirmed')
           .should('not.exist') 
        //validamos que la reserva aun puede hacerse completando la informacion requerida  
        cy.get('input[name="firstname"]').should('be.visible')
        cy.get('input[name="lastname"]').should('be.visible')
    })
})

// TC004 / CASO 3.3 - Formulario de contacto
describe('Formulario de Contacto', () => {

    beforeEach(() => {
        cy.on('uncaught:exception', () => false)
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