describe('App', () => {
  it('should visit', () => {
    cy.visit('/');
  });

  it('should have a title', () => {
    cy.title().should('eq', 'Agora');
  });

  it('should have a header', () => {
    cy.get('#header', { timeout: 2000 }).should('be.visible');
  });

  it('should have a heading', () => {
    cy.get('h1', { timeout: 2000 }).should('be.visible');
  });

  it('should have a footer', () => {
    cy.get('#footer', { timeout: 2000 }).should('be.visible');
  });
});
