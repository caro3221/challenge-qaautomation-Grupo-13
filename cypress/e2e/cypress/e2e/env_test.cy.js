describe('Variables de entorno', () => {

  it('lee variables del .env', () => {

    cy.log(Cypress.env('USERNAME'))
    cy.log(Cypress.env('PASSWORD'))

  })

})