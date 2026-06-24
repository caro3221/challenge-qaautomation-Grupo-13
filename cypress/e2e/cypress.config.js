const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {

      config.env.USERNAME = process.env.CYPRESS_USERNAME;
      config.env.PASSWORD = process.env.CYPRESS_PASSWORD;

      return config;
    },
  },
});