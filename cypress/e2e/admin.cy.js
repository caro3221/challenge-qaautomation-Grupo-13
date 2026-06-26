function fmtFechaApi(dias) {
  const f = new Date()
  f.setDate(f.getDate() + dias)
  return f.toLocaleDateString('en-CA')
}
// devuelve fecha relativa a hoy en formato YYYY-MM-DD para la API

function fmtFechaUI(dias) {
  const f = new Date()
  f.setDate(f.getDate() + dias)
  const dd = String(f.getDate()).padStart(2, '0')
  const mm = String(f.getMonth() + 1).padStart(2, '0')
  const yyyy = f.getFullYear()
  return dd + '/' + mm + '/' + yyyy
}
// devuelve fecha relativa a hoy en formato DD/MM/YYYY para los inputs de la UI

function obtenerPrimeraReserva() {
  return cy.request('/api/room').then(function(r) {
    const rooms = r.body.rooms
    function buscar(idx) {
      if (idx >= rooms.length) {
        return null
      }
      return cy.request('/api/booking?roomid=' + rooms[idx].roomid).then(function(resp) {
        const bookings = resp.body.bookings
        if (bookings && bookings.length > 0) {
          return { booking: bookings[0], roomId: rooms[idx].roomid }
        }
        return buscar(idx + 1)
      })
    }
    return buscar(0)
  })
}
// consulta la API de habitaciones y busca recursivamente la primera con reservas

function conReserva(accion, roomsMax = 5) {
  function intentar(idx) {
    if (idx >= roomsMax) {
      return
    }
    cy.get('.row.detail').eq(idx).click()
    cy.wait(2000)
    cy.then(function() {
      if (Cypress.$('.bookingEdit').length > 0) {
        accion()
        return
      }
      cy.go('back')
      cy.url().should('include', '/admin', { timeout: 10000 })
      cy.wait(1000).then(function() { intentar(idx + 1) })
    })
  }
  intentar(0)
}
// itera habitaciones en la UI buscando una con reservas y ejecuta el callback



//Crear habitacion -TC019
describe('TC019-Admin Shady Meadows B&B ', () => {
  beforeEach(() => {
    cy.fixture('loginData').then((data) => {
      cy.login(data.Admin.username, data.Admin.password)
    })
    cy.contains('Rooms').should('be.visible')
  })

  it('Crear habitacion -codigo puro', () => {
    const roomNumber = Date.now().toString().slice(-5)
    cy.get('#roomName').type(roomNumber)
    cy.get('#type').select('Twin')
    cy.get('#accessible').select('true')
    cy.get('#roomPrice').type('200')
    cy.get('#wifiCheckbox').check()
      .should('be.checked')
    cy.get('#tvCheckbox').check()
      .should('be.checked')
    cy.get('#createRoom').click()
    cy.contains(roomNumber).should('exist')
  })

  //Crear habitacion -TC019 - usando fixture

  it('Crear habitacion -usando fixture', () => {
    const roomNumber = Date.now().toString().slice(-5)
    cy.get('#roomName').type(roomNumber)
    cy.fixture('roomData').then((data) => {
      cy.get('#type').select(data.validRoom.type)
      cy.get('#accessible').select(data.validRoom.accessible)
      cy.get('#roomPrice').type(data.validRoom.roomPrice)
    })
    cy.get('#wifiCheckbox').check()
      .should('be.checked')
    cy.get('#tvCheckbox').check()
      .should('be.checked')
    cy.get('#createRoom').click()
    cy.contains(roomNumber).should('exist')
  })
}) 



describe('Módulo Admin', function() {

  beforeEach(function() {
    // loguea como admin y espera hasta 15s a que cargue el listado de habitaciones
    cy.login('admin', 'password')
    cy.get('.row.detail', { timeout: 15000 }).should('have.length.at.least', 1)
  })


  describe('TC024 — Editar fecha pasada', function() {

    it('TC024-API — Editar fecha pasada mediante API', function() {
      obtenerPrimeraReserva().then(function(data) {
        if (!data) { cy.log('No hay reservas'); return }
        const b = data.booking
        cy.request({
          method: 'PUT',
          url: '/api/booking/' + b.bookingid,
          body: {
            bookingdates: { checkin: fmtFechaApi(-30), checkout: fmtFechaApi(-28) },
            bookingid: b.bookingid,
            depositpaid: b.depositpaid,
            firstname: b.firstname,
            lastname: b.lastname,
            roomid: b.roomid
          }
        }).then(function(resp) {
          expect(resp.status).to.be.within(400, 599)
        })
      })
    })

    it('TC024-UI — Editar fecha pasada mediante UI', function() {
      conReserva(function() {
        cy.get('.bookingEdit', { timeout: 5000 }).should('have.length.at.least', 1)
        cy.get('.bookingEdit').first().click({ force: true })
        cy.wait(2000)
        cy.get('.confirmBookingEdit', { timeout: 5000 }).should('be.visible')
        const ci = fmtFechaUI(-30)
        const co = fmtFechaUI(-28)
        cy.get('.detail').first().find('input').eq(2).setReactDate(ci)
        cy.get('.detail').first().find('input').eq(3).setReactDate(co)
        cy.get('.confirmBookingEdit').first().click()
        cy.wait(2000)
        cy.get('.confirmBookingEdit', { timeout: 5000 }).should('exist')
      })
    })
  })



  describe('TC025 — Editar fecha cruzada', function() {

    it('TC025-API — Editar fecha cruzada mediante API', function() {
      obtenerPrimeraReserva().then(function(data) {
        if (!data) { cy.log('No hay reservas'); return }
        const b = data.booking
        cy.request({
          method: 'PUT',
          url: '/api/booking/' + b.bookingid,
          body: {
            bookingdates: { checkin: fmtFechaApi(15), checkout: fmtFechaApi(10) },
            bookingid: b.bookingid,
            depositpaid: b.depositpaid,
            firstname: b.firstname,
            lastname: b.lastname,
            roomid: b.roomid
          },
          failOnStatusCode: false
        }).then(function(resp) {
          expect(resp.status).to.be.within(400, 599)
        })
      })
    })

    it('TC025-UI — Editar fecha cruzada mediante UI', function() {
      conReserva(function() {
        cy.get('.bookingEdit', { timeout: 5000 }).should('have.length.at.least', 1)
        cy.get('.bookingEdit').first().click({ force: true })
        cy.wait(2000)
        cy.get('.confirmBookingEdit', { timeout: 5000 }).should('be.visible')
        const ciNuevo = fmtFechaUI(15)
        const coNuevo = fmtFechaUI(10)
        cy.get('.detail').first().find('input').eq(2).setReactDate(ciNuevo)
        cy.get('.detail').first().find('input').eq(3).setReactDate(coNuevo)
        cy.get('.confirmBookingEdit').first().click()
        cy.wait(2000)
        cy.get('.confirmBookingEdit', { timeout: 5000 }).should('exist')
        cy.get('[role="alert"]', { timeout: 5000 }).should('be.visible')
      })
    })
  })

  describe('TC022 - Editar reserva', () => {

  beforeEach(() => {
    cy.fixture('loginData').then((data) => {
      cy.login(data.Admin.username, data.Admin.password)
    })

    cy.intercept('GET', '**/api/report').as('report')

    cy.contains('Rooms').should('be.visible')
  })

  it('Editar nombre de reserva', () => {

    cy.fixture('reservationData').then((data) => {

      cy.visit('https://automationintesting.online/admin/room/1')

      cy.get('.bookingEdit')
        .first()
        .click()

      // Cambiar nombre
      cy.get('input[name="firstname"]')
        .clear()
        .type(data.editReservation.firstname)
      
      cy.setReactCalendarDate(0, '27/06/2026')
      cy.setReactCalendarDate(1, '30/06/2026')

        
      cy.get('.confirmBookingEdit')
        .click({ force: true })

      cy.wait(1000)

      // Validar nombre en la reserva
      cy.contains(data.editReservation.firstname)
        .should('exist')

      // Validar en Report
      cy.get('#reportLink').click()

      cy.contains(data.editReservation.firstname)
        .should('exist')

    })
  })
})

describe('TC023 - Editar cantidad de días', () => {

  beforeEach(() => {
    cy.fixture('loginData').then((data) => {
      cy.login(data.Admin.username, data.Admin.password)
    })

    cy.contains('Rooms').should('be.visible')
  })

  it('Aumentar checkout en 3 dias a 02/07/2026', () => {

    cy.visit('https://automationintesting.online/admin/room/1')

    cy.get('.bookingEdit')
      .first()
      .click()
    
    cy.setReactCalendarDate(1, '02/07/2026')

    cy.get('.confirmBookingEdit')
      .click({ force: true })

    cy.wait(500)

    // Volver a abrir para validar
    cy.get('.bookingEdit')
      .first()
      .click()

    cy.get('.react-datepicker__input-container input')
      .eq(1)
      .should('have.value', '01/07/2026')

    cy.get('#reportLink').click()

    cy.contains('02/07/2026')
        .should('exist')
  })
})


  describe('TC021 — Cancelar reserva y verificar actualización en reportes', function() {

    it('TC021-API — Cancelar reserva mediante API y confirmar en reportes', function() {
      obtenerPrimeraReserva().then(function(data) {
        if (!data) { cy.log('No hay reservas disponibles para cancelar'); return }
        const booking = data.booking
        cy.request('DELETE', '/api/booking/' + booking.bookingid).then(function(resp) {
          expect(resp.status).to.eq(202)
          cy.contains('Report').click()
          cy.url().should('include', '/report')
          const nombre = booking.firstname + ' ' + booking.lastname
          cy.contains(nombre, { timeout: 5000 }).should('not.exist')
        })
      })
    })

    it('TC021-UI — Cancelar reserva mediante UI y verificar en reportes', function() {
      conReserva(function() {
        cy.get('.detail').first().within(function() {
          cy.get('.col-sm-2 p').first().invoke('text').as('nombre')
          cy.get('.col-sm-2 p').eq(1).invoke('text').as('apellido')
        })
        cy.get('.bookingDelete', { timeout: 5000 }).should('exist')
        cy.get('.bookingDelete').first().click()
        cy.wait(500)
        cy.get('@nombre').then(function(n) {
          cy.get('@apellido').then(function(a) {
            const nombreCompleto = n.trim() + ' ' + a.trim()
            cy.contains('Report').click()
            cy.url().should('include', '/report')
            cy.contains(nombreCompleto, { timeout: 5000 }).should('not.exist')
          })
        })
      })
    })
  })
})


// Estos tests validan el modulo admin (editar fechas (TC024, TC025) y cancelar reservas (TC021))
// la app no tiene IDs faciles de usar en algunos botones y el server es compartido, asi que toco hacerlo de otra forma
// 1- el boton de check a veces no se dejaba clickear, cypress decia que estaba cubierto por otro elemento a veces
// tuve que usar { force: true } en el click.
// 2- los inputs de fecha estan controlados por React, usar .type() no funcionaba porque react no detectaba el cambio.
// tuve que crear el comando setReactDate en commands.js (setea con jQuery y dispara evento input)
// 3- no hay forma de saber que habitacion tiene reservas porque otros usuarios las crean y borran todo el tiempo
// tuve que crear conReserva() que itera habitaciones buscando el boton de editar y obtenerPrimeraReserva() consulta la API para encontrar un bookingId real.
// 4- las aserciones estan al reves a proposito che, esperamos que el sistema rechace las fechas invalidas (esperamos que .confirmBookingEdit siga existiendo despues de guardar). 
// Si el test falla, es porque el sistema acepto lo que no deberia y eso es un bug documentado. Cuando arreglen el backend estos tests van a pasar solos sin tocar codigo (en teoria)

