describe ('TC017- Form reserva vacio- Shady Meadows B&B ',()=>{

    beforeEach(()=>{
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