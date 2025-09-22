// @ts-check
import { defineConfig, devices } from '@playwright/test';


const dotenv = require('dotenv');
const path = require('path');
const envFile = `.env.${process.env.TEST_ENV || 'test'}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Maximum time a test can run
  timeout: 60000, // 60 seconds
  //Global setup
  globalSetup: './utils/Global-setup.js',
  //Test file directory
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  //retries: process.env.CI ? 2 : 0,
  retries: 2,
  /* Opt out of parallel tests on CI. */
  //workers: process.env.CI ? 1 : undefined,
  workers: 1,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: 'html',
  reporter: [["line"], ["allure-playwright"]],

  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.BASE_URL,
    // Maximum time for an action to complete
    actionTimeout: 15000, // 10 seconds
    // Maximum time for a page to load
    navigationTimeout: 40000, // 40 seconds
    expect: {
      timeout: 15000, // 10 seconds
    },

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [

    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
      testDir: './utils',
    },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',  // Load the saved state
      },
      dependencies: ['setup'],  // Runs setup before tests
    },
    /*{
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json', // Load saved state
      },
      dependencies: ['setup'], // Runs setup before tests
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/user.json', // Load saved state
      },
      dependencies: ['setup'], // Runs setup before tests
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // }, 
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },


});

