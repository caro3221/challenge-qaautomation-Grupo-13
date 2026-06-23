Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

describe("Prueba de API - Crear Reserva", () => {
  beforeEach(function () {
    cy.fixture("bookingData").then((data) => {
      this.datos = data;
    });
  });

  it("Crear reserva exitosamente (POST)", function () {
    cy.intercept("POST", "**/booking**").as("postBooking");
    cy.openBookingForm();
    cy.get('[name="firstname"]')
      .should("be.visible")
      .type(this.datos.reservaValida.firstname);
    cy.get('[name="lastname"]').type(this.datos.reservaValida.lastname);
    cy.get('[name="email"]').type(this.datos.reservaValida.email);
    cy.get('[name="phone"]').type(this.datos.reservaValida.phone);
    cy.get("button").contains("Reserve Now").click({ force: true });
    cy.wait("@postBooking", { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([200, 201]);
    });
  });

  it("Consultar listado de reservas (GET)", function () {
    cy.intercept("GET", "**/report**").as("getBookingReport");
    cy.loginAdmin(this.datos.admin.user, this.datos.admin.pass);
    cy.contains("Report").click();
    cy.wait("@getBookingReport", { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.not.be.undefined;
    });
  });

  it("Validar error al intentar crear reserva con campos vacíos (POST)", function () {
    cy.intercept("POST", "**/booking**").as("bookingError");
    cy.openBookingForm();
    cy.get("button").contains("Reserve Now").click({ force: true });
    cy.wait("@bookingError", { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([400, 405, 409]);
    });
  });
});
