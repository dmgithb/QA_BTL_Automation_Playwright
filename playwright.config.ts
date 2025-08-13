import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: process.env.FULLY_PARALLEL !== 'false',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? parseInt(process.env.RETRY_COUNT || '1') : parseInt(process.env.RETRY_COUNT || '0'),
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : parseInt(process.env.MAX_WORKERS || '4'),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'reports/html-report' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
    ['allure-playwright', { 
      detail: true, 
      outputFolder: process.env.ALLURE_RESULTS_DIR || 'allure-results',
      suiteTitle: false 
    }],
    ['list']
  ],
  /* Global setup and teardown */
  globalSetup: require.resolve('./src/utils/global-setup.ts'),
  globalTeardown: require.resolve('./src/utils/global-teardown.ts'),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'https://your-app-url.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    
    /* Screenshot settings */
    screenshot: process.env.SCREENSHOT_MODE as 'off' | 'only-on-failure' | 'on' || 'only-on-failure',
    
    /* Video settings */
    video: process.env.VIDEO_MODE as 'off' | 'on' | 'retain-on-failure' | 'on-first-retry' || 'retain-on-failure',
    
    /* Action timeout */
    actionTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
    
    /* Navigation timeout */
    navigationTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
    
    /* Viewport settings */
    viewport: {
      width: parseInt(process.env.VIEWPORT_WIDTH || '1920'),
      height: parseInt(process.env.VIEWPORT_HEIGHT || '1080')
    },
    
    /* Headless mode */
    headless: process.env.HEADLESS === 'true',
    
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
  },

  /* Test timeout */
  timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000') * 2,
  
  /* Expect timeout */
  expect: {
    timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000') / 3,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // ========================================
    // CRITICAL TESTS PROJECT - Normal execution
    // ========================================
    {
      name: 'critical',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
      dependencies: ['setup'],
      grep: /@critical/,
      grepInvert: /@skip/,
    },
    // ========================================
    // CHROMIUM PROJECT - Full test suite
    // ========================================
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
      dependencies: ['setup'],
    },
    // ========================================
    // REGRESSION PROJECT - Specific test groups
    // ========================================
    {
      name: 'regression',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
      dependencies: ['setup'],
      grep: /@regression|@critical/,
    },
    // ========================================
    // SMOKE TESTS PROJECT - Quick validation
    // ========================================
    {
      name: 'smoke',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
      dependencies: ['setup'],
      grep: /@smoke/,
    },

    // ========================================
    // MULTI-BROWSER PROJECTS
    // ========================================
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    // ========================================
    // BROWSER-SPECIFIC CRITICAL TESTS
    // ========================================
    {
      name: 'critical-firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
      grep: /@critical/,
      grepInvert: /@skip/,
    },

    {
      name: 'critical-webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
      grep: /@critical/,
      grepInvert: /@skip/,
    }

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
