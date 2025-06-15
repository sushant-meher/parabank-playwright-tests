// config/playwright.config.js
// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: '../tests', // Path to test directory
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL, // UI base URL (used by page.goto)
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // Define global setup for custom API base URL (optional, advanced)
  // Can inject a separate API context if needed
});
