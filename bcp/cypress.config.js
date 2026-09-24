const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4201/bcp/',
    // The CI job uploads cypress/videos on failure, which Cypress writes only
    // when recording is on. It defaults to off.
    video: true,
  },
});
