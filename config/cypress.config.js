const { defineConfig } = require('cypress');
const helpers = require('./helpers');

module.exports = defineConfig({
  defaultCommandTimeout: 10000,
  downloadsFolder: helpers.root('testing/cypress/downloads'),
  fixturesFolder: helpers.root('testing/cypress/fixtures'),
  screenshotsFolder: helpers.root('testing/cypress/screenshots'),
  videosFolder: helpers.root('testing/cypress/videos'),
  e2e: {
    baseUrl: 'http://127.0.0.1:8080',
    supportFile: helpers.root('testing/cypress/support/e2e.{js,jsx,ts,tsx}'),
    specPattern: helpers.root('testing/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'),
  },
});