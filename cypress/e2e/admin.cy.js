
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