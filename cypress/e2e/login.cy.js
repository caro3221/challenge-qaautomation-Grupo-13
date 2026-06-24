// login Adm correcto / TC001

describe('TC001-Login Shady Meadows B&B ', () => {

    beforeEach(() => {
        cy.visit('https://automationintesting.online')
        cy.contains('Admin').click()
        cy.url().should('include', '/admin')
    })
    it('Login exitoso de Admin-codigo puro', () => {
        //cy.log('TC001')
        cy.get('#username').type('admin')
        cy.get('#password').type('password')
        cy.get('#doLogin').click()
        cy.url().should('include', '/rooms')
    })

    //CON CUSTOM COMMANDS
    it('Login exitoso de Admin-CCommand', () => {
        cy.login('admin', 'password')
        cy.url().should('include', '/rooms')
    })

    // CON CUSTOM COMMAND Y FIXTURE
    it('Login exitoso de Admin-CC Y Fixture', () => {
        cy.fixture('loginData').then((data) => {
            cy.login(data.Admin.username, data.Admin.password)
            cy.url().should('include', '/rooms')
        })
    })
})

// login Adm invalido -TC002
// CON  CUSTOM COMMAND Y FIXTURE
describe('TC002-Login Shady Meadows B&B ', () => {
    it('Login Inválido de Admin-CC y Fixture', () => {
        cy.fixture('loginData').then((data) => {
            cy.login(data.AdminInval.username, data.AdminInval.password)
            cy.get('[role="alert"]').should('be.visible').and('have.text', 'Invalid credentials')
        })
    })
})

// logout CON CUSTOM COMAND Y FIXTURE - TC003
describe('TC003-Login Shady Meadows B&B ', () => {
    it('Logout exitoso de Admin- CC y Fixture', () => {
        cy.fixture('loginData').then((data) => {
            cy.login(data.Admin.username, data.Admin.password)
            cy.url().should('include', '/rooms')
            //Deslogueamos
            cy.contains('Logout').click()
            cy.url().should('include', '/')
        })
    })
}) 