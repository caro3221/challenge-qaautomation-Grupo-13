const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: true,

  e2e: {
    baseUrl: 'https://automationintesting.online',
    setupNodeEvents(on, config) {
      on('task', {
        log(msg) {
          console.log(msg);
          return null;
        }
      });
    },
  },
});