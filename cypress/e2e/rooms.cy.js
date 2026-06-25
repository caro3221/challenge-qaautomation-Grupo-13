function fmtFecha(dias) {
  const f = new Date()
  f.setDate(f.getDate() + dias)
  const dd = String(f.getDate()).padStart(2, '0')
  const mm = String(f.getMonth() + 1).padStart(2, '0')
  const yyyy = f.getFullYear()
  return dd + '/' + mm + '/' + yyyy
}
// devuelve fecha relativa a hoy en formato DD/MM/YYYY

function setFechas(checkinOffset, checkoutOffset) {
  cy.contains('h3.card-title', 'Check Availability & Book Your Stay')
    .closest('.card').within(function() {
      cy.get('input').eq(0).clear().type(fmtFecha(checkinOffset))
      cy.get('input').eq(1).clear().type(fmtFecha(checkoutOffset))
    })
}
// busca la seccion de disponibilidad y completa checkin y checkout con fechas relativas


describe('Módulo Rooms', function() {

  let datosHuesped

  before(function() {
    cy.fixture('bookingsData').then(function(d) {
      datosHuesped = d.guest
    })
  })

  describe('TC014 — Chequear Disponibilidad con fecha cruzada (checkout menor que checkin)', function() {

    it('Muestra habitaciones aunque el checkout sea anterior al checkin', function() {
      cy.visit('/')
      setFechas(7, 4)
      cy.contains('Check Availability').click()
      cy.get('.room-card', { timeout: 10000 }).should('not.exist')
    })
  })


  describe('TC015 — Confirmar reserva con fecha cruzada (continuación TC014)', function() {

    it('La app crashea al confirmar reserva con fechas cruzadas', function() {
      cy.visit('/')
      setFechas(7, 4)
      cy.contains('Check Availability').click()
      cy.contains('Book now').first().click()
      cy.url().should('include', 'checkout=')
      cy.url().should('include', 'checkin=')
      cy.contains('Reserve Now').click()
      cy.fillBookingForm(datosHuesped)
      cy.contains('Reserve Now').click()
      cy.contains('Booking Confirmed', { timeout: 10000 }).should('be.visible')
    })
  })


  describe('TC016 — Reserva de habitación doble por más días permitidos', function() {

    it('Permite reservar 366 noches sin límite', function() {
      cy.visit('/')
      setFechas(1, 367)
      cy.contains('Check Availability').click()
      cy.contains('Book now').first().click()
      cy.url().should('include', 'checkout=')
      cy.url().should('include', 'checkin=')
      cy.contains('night', { timeout: 10000 }).should('be.visible')
      cy.contains('Reserve Now').click()
      cy.fillBookingForm(datosHuesped)
      cy.contains('Reserve Now').click()
      cy.contains('Booking Confirmed').should('not.exist')
    })
  })


  describe('TC018 — Validar que el formulario de reserva rechace datos inválidos en todos los campos / CASO DE BORDE', function() {

    const subcasos = [
      { campo: 'firstname', valor: 'AB',                     label: 'Firstname 2 caracteres',     esperaAlerta: true },
      { campo: 'firstname', valor: '123456789012345678901',   label: 'Firstname 21 caracteres',   esperaAlerta: true },
      { campo: 'firstname', valor: '12345',                   label: 'Firstname numérico',        esperaAlerta: true },
      { campo: 'lastname',  valor: 'AB',                     label: 'Lastname 2 caracteres',     esperaAlerta: true },
      { campo: 'lastname',  valor: '123456789012345678901234567890123', label: 'Lastname 33 caracteres', esperaAlerta: true },
      { campo: 'lastname',  valor: '12345',                  label: 'Lastname numérico',         esperaAlerta: true },
      { campo: 'email',     valor: 'juan@',                  label: 'Email sin dominio',         esperaAlerta: true },
      { campo: 'email',     valor: 'juanperez',              label: 'Email sin @',               esperaAlerta: true },
      { campo: 'email',     valor: '@com',                   label: 'Email solo @com',           esperaAlerta: true },
      { campo: 'phone',     valor: 'abcd',                   label: 'Phone alfabético',          esperaAlerta: true },
      { campo: 'phone',     valor: '123',                    label: 'Phone 3 dígitos',           esperaAlerta: true },
      { campo: 'phone',     valor: '123456789012345678901234', label: 'Phone 24 dígitos',        esperaAlerta: true },
    ]

    beforeEach(function() {
      cy.visit('/')
      setFechas(7, 10)
      cy.contains('Check Availability').click()
      cy.contains('Book now').first().click()
    })

    subcasos.forEach(function(sc) {
      it(sc.label + ': ' + (sc.esperaAlerta ? 'rechazado' : 'aceptado (BUG)'), function() {
        cy.contains('Reserve Now').click()
        cy.fillBookingForm(datosHuesped)
        cy.get('input[name="' + sc.campo + '"]').clear().type(sc.valor)
        cy.contains('Reserve Now').click()
        if (sc.esperaAlerta) {
          cy.get('[role="alert"]').should('be.visible')
        } else {
          cy.get('[role="alert"]').should('not.exist')
        }
        cy.contains('Booking Confirmed').should('not.exist')
      })
    })
  })
})


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

