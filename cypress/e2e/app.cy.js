import "@testing-library/cypress/add-commands";
<reference types="cypress" />;

describe("Youtube App", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders", () => {
    cy.findByText("Youtube").should("exist");
  });
});
