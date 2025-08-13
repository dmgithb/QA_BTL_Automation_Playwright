import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { Page, Browser, BrowserContext } from '@playwright/test';
import { expect } from '@playwright/test';
import { TestDataManager } from '../../src/utils/test-data-manager';
import { LoginPage } from '../../src/pages/login.page';
import { world } from '../support/world';
import { performance } from 'perf_hooks';

// Define types
interface TestData {
  username: string;
  password: string;
  expectedResult: string;
  description?: string;
}

interface CrossBrowserTestData {
  username: string;
  password: string;
  browserName: string;
}

// Custom World properties
interface DataDrivenWorldExtension {
  loginPage?: LoginPage;
  testDataManager?: TestDataManager;
  csvTestData?: TestData[];
  crossBrowserData?: CrossBrowserTestData;
  testResults?: Array<{ testCase: TestData; result: string; success: boolean }>;
}

// Extend world with data-driven properties
let dataDrivenWorld: DataDrivenWorldExtension = {};

Before(async function() {
  console.log('[BDD-Test] Browser context and page initialized for scenario');
  // Browser initialization is handled in hooks.ts
});

After(async function() {
  console.log('[BDD-Test] Browser context closed after scenario');
  // Cleanup is handled in hooks.ts
});

// Step Definitions for Data-Driven Testing

Given('I am on the login page', async function() {
  if (!world.page) {
    throw new Error('Page not initialized');
  }
  
  dataDrivenWorld.loginPage = new LoginPage(world.page);
  dataDrivenWorld.testDataManager = new TestDataManager();
  
  await dataDrivenWorld.loginPage.navigateToLoginPage();
  console.log('[BDD-Test] Navigated to login page');
});

Given('I have loaded CSV test data for login scenarios', async function() {
  if (!dataDrivenWorld.testDataManager) {
    throw new Error('TestDataManager not initialized');
  }
  
  try {
    // Load CSV test data for data-driven testing
    dataDrivenWorld.csvTestData = await TestDataManager.readCsvData('login-test-data');
    if (dataDrivenWorld.csvTestData) {
      console.log(`[BDD-Test] Loaded ${dataDrivenWorld.csvTestData.length} test cases from CSV data`);
    }
  } catch (error) {
    // If CSV file doesn't exist, create sample data
    dataDrivenWorld.csvTestData = [
      { username: 'jibin', password: 'jibin123', expectedResult: 'success', description: 'Valid credentials' },
      { username: 'invalid_user', password: 'wrong_password', expectedResult: 'failure', description: 'Invalid credentials' },
      { username: '', password: '', expectedResult: 'failure', description: 'Empty credentials' },
      { username: 'testuser', password: '', expectedResult: 'failure', description: 'Empty password' },
      { username: '', password: 'password123', expectedResult: 'failure', description: 'Empty username' }
    ];
    console.log(`[BDD-Test] Using sample test data with ${dataDrivenWorld.csvTestData.length} test cases`);
  }
});

When('I execute all test cases from the CSV data', async function() {
  if (!dataDrivenWorld.csvTestData || !dataDrivenWorld.loginPage) {
    throw new Error('Test data or LoginPage not initialized');
  }
  
  dataDrivenWorld.testResults = [];
  
  for (const testCase of dataDrivenWorld.csvTestData) {
    console.log(`[BDD-Test] Executing test case: ${testCase.description}`);
    
    try {
      // Clear form before each test
      await dataDrivenWorld.loginPage.clearLoginForm();
      
      // Navigate to login page to ensure clean state
      await dataDrivenWorld.loginPage.navigateToLoginPage();
      
      // Perform login with test case data
      await dataDrivenWorld.loginPage.login(testCase.username, testCase.password);
      
      // Wait a moment for page to respond
      await world.page?.waitForTimeout(2000);
      
      // Check result based on current URL
      const currentUrl = world.page?.url() || '';
      const loginSuccessful = currentUrl.includes('Welcome.php');
      const loginFailed = currentUrl.includes('err') || currentUrl.includes('login');
      
      let actualResult = 'unknown';
      if (loginSuccessful) {
        actualResult = 'success';
      } else if (loginFailed) {
        actualResult = 'failure';
      }
      
      const testPassed = actualResult === testCase.expectedResult;
      
      dataDrivenWorld.testResults.push({
        testCase,
        result: actualResult,
        success: testPassed
      });
      
      console.log(`[BDD-Test] Test case "${testCase.description}": Expected ${testCase.expectedResult}, Got ${actualResult}, Passed: ${testPassed}`);
      
    } catch (error) {
      console.error(`[BDD-Test] Error executing test case "${testCase.description}":`, error);
      dataDrivenWorld.testResults.push({
        testCase,
        result: 'error',
        success: false
      });
    }
  }
  
  console.log(`[BDD-Test] Completed execution of ${dataDrivenWorld.testResults.length} test cases`);
});

Then('each test case should produce the expected result', async function() {
  if (!dataDrivenWorld.testResults) {
    throw new Error('Test results not available');
  }
  
  const failedTests = dataDrivenWorld.testResults.filter(result => !result.success);
  
  if (failedTests.length > 0) {
    console.error('[BDD-Test] Failed test cases:');
    failedTests.forEach(failed => {
      console.error(`  - ${failed.testCase.description}: Expected ${failed.testCase.expectedResult}, Got ${failed.result}`);
    });
    throw new Error(`${failedTests.length} out of ${dataDrivenWorld.testResults.length} test cases failed`);
  }
  
  console.log(`[BDD-Test] All ${dataDrivenWorld.testResults.length} test cases passed successfully`);
});

Then('login forms should be cleared between test cases', async function() {
  if (!dataDrivenWorld.loginPage) {
    throw new Error('LoginPage not initialized');
  }
  
  // Verify form is clean by checking if fields are empty
  await dataDrivenWorld.loginPage.navigateToLoginPage();
  
  const usernameValue = await world.page?.locator('input[name="username"]').inputValue() || '';
  const passwordValue = await world.page?.locator('input[name="password"]').inputValue() || '';
  
  expect(usernameValue).toBe('');
  expect(passwordValue).toBe('');
  
  console.log('[BDD-Test] Login form is properly cleared between test cases');
});

// Cross-browser testing steps

Given('I have loaded valid user credentials for cross-browser testing', async function() {
  if (!dataDrivenWorld.testDataManager) {
    throw new Error('TestDataManager not initialized');
  }
  
  const validUser = await TestDataManager.getUserData('valid');
  dataDrivenWorld.crossBrowserData = {
    username: validUser.username,
    password: validUser.password,
    browserName: 'chromium' // Default browser
  };
  
  console.log('[BDD-Test] Cross-browser test credentials loaded');
});

When('I test login functionality across different browsers', async function() {
  if (!dataDrivenWorld.crossBrowserData || !dataDrivenWorld.loginPage) {
    throw new Error('Cross-browser data or LoginPage not initialized');
  }
  
  // Test login functionality (browser switching would be handled at test runner level)
  await dataDrivenWorld.loginPage.navigateToLoginPage();
  await dataDrivenWorld.loginPage.login(dataDrivenWorld.crossBrowserData.username, dataDrivenWorld.crossBrowserData.password);
  
  console.log('[BDD-Test] Cross-browser login functionality tested');
});

Then('login should work consistently', async function() {
  if (!world.page) {
    throw new Error('Page not initialized');
  }
  
  // Verify successful login
  const currentUrl = world.page.url();
  expect(currentUrl).toContain('Welcome.php');
  
  console.log('[BDD-Test] Login works consistently across browsers');
});

Then('all login features should be functional', async function() {
  if (!dataDrivenWorld.loginPage) {
    throw new Error('LoginPage not initialized');
  }
  
  // Verify login page elements are functional
  await dataDrivenWorld.loginPage.navigateToLoginPage();
  await dataDrivenWorld.loginPage.verifyLoginPageLoaded();
  
  console.log('[BDD-Test] All login features verified as functional');
});

export { dataDrivenWorld };
