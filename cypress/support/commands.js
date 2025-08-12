// Custom Cypress commands for the Parameter Risk Analysis application

// Command to login a test user
Cypress.Commands.add('login', (email = 'test@example.com', password = 'testpassword') => {
  cy.request({
    method: 'POST',
    url: '/api/v1/auth/login',
    body: {
      email,
      password
    }
  }).then((response) => {
    window.localStorage.setItem('authToken', response.body.token);
  });
});

// Command to upload a parameter file
Cypress.Commands.add('uploadParameterFile', (fileName) => {
  cy.fixture(fileName).then(fileContent => {
    cy.get('[data-testid="file-upload"]').selectFile({
      contents: Cypress.Buffer.from(fileContent),
      fileName: fileName,
      mimeType: 'application/xml'
    });
  });
});

// Command to wait for impact analysis to complete
Cypress.Commands.add('waitForImpactAnalysis', () => {
  cy.get('[data-testid="impact-analysis-loading"]', { timeout: 15000 }).should('not.exist');
  cy.get('[data-testid="impact-analysis-results"]').should('be.visible');
});

// Command to check alert name validation
Cypress.Commands.add('checkAlertNameValidation', (alertName, shouldBeValid = true) => {
  cy.get('[data-testid="alert-name-input"]').clear().type(alertName);
  
  if (shouldBeValid) {
    cy.get('[data-testid="alert-name-error"]').should('not.exist');
    cy.get('[data-testid="alert-name-input"]').should('not.have.class', 'error');
  } else {
    cy.get('[data-testid="alert-name-error"]').should('be.visible');
    cy.get('[data-testid="alert-name-input"]').should('have.class', 'error');
  }
});
