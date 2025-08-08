import { test, expect, LoginPage, TestDataManager, ConfigManager } from '../src/fixtures/test-fixtures';

/**
 * Test suite for Login functionality
 */
test.describe('Login Tests - Bulktainer ERP System', () => {
  
  test.beforeEach(async ({ page }, testInfo) => {
    // Import test hooks
    const { TestHooks } = await import('../src/fixtures/test-fixtures');
    await TestHooks.beforeEach(page, testInfo);
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Import test hooks
    const { TestHooks } = await import('../src/fixtures/test-fixtures');
    await TestHooks.afterEach(page, testInfo);
  });

  test('Verify login page loads correctly', async ({ loginPage, logger }) => {
    logger.step('Navigate to login page');
    await loginPage.navigateToLoginPage();
    
    logger.step('Verify login page elements');
    await loginPage.verifyLoginPageLoaded();
    await loginPage.verifyPageTitle();
    
    logger.step('Take screenshot of login page');
    await loginPage.takeScreenshot('login-page-loaded');
  });

  test('Successful login with valid credentials', async ({ page, loginPage, logger }) => {
    logger.step('Load test data');
    const users = await TestDataManager.readJsonData('login-data');
    const validUser = users.validUsers[0]; // Get first valid user
    
    logger.step('Navigate to login page');
    await loginPage.navigateToLoginPage();
    
    logger.step('Perform login');
    await loginPage.login(validUser.username, validUser.password);
    
    logger.step('Verify login success');
    const isLoginSuccessful = await loginPage.isLoginSuccessful();
    expect(isLoginSuccessful).toBeTruthy();
    
    logger.step('Save authentication state for future tests');
    const { TestHooks } = await import('../src/fixtures/test-fixtures');
    await TestHooks.saveAuthState(page, validUser.username);
  });

  test('Failed login with invalid credentials', async ({ loginPage, logger }) => {
    logger.step('Load test data');
    const users = await TestDataManager.readJsonData('test-data');
    const invalidUser = users.invalidUsers[0]; // Get first invalid user
    
    logger.step('Navigate to login page');
    await loginPage.navigateToLoginPage();
    
    logger.step('Attempt login with invalid credentials');
    await loginPage.login(invalidUser.username, invalidUser.password);
    
    logger.step('Verify login failure');
    const isLoginSuccessful = await loginPage.isLoginSuccessful();
    expect(isLoginSuccessful).toBeFalsy();
    
    // Note: Error message verification depends on actual application behavior
    // Uncomment and modify based on actual error message shown
    // logger.step('Verify error message');
    // await loginPage.verifyErrorMessage(invalidUser.expectedError);
  });

  test('Login with empty credentials', async ({ loginPage, logger }) => {
    logger.step('Load test data');
    const users = await TestDataManager.readJsonData('test-data');
    const emptyCredentials = users.invalidUsers.find(user => user.username === '' && user.password === '');
    
    logger.step('Navigate to login page');
    await loginPage.navigateToLoginPage();
    
    logger.step('Attempt login with empty credentials');
    await loginPage.login(emptyCredentials.username, emptyCredentials.password);
    
    logger.step('Verify login failure');
    const isLoginSuccessful = await loginPage.isLoginSuccessful();
    expect(isLoginSuccessful).toBeFalsy();
  });

  test('Test forgot password functionality', async ({ loginPage, logger }) => {
    logger.step('Navigate to login page');
    await loginPage.navigateToLoginPage();
    
    logger.step('Click forgot password link');
    await loginPage.clickForgotPassword();
    
    logger.step('Verify navigation to forgot password page');
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).toContain('forgot-password');
  });

  test('Test footer links navigation', async ({ loginPage, logger }) => {
    logger.step('Navigate to login page');
    await loginPage.navigateToLoginPage();
    
    logger.step('Test About Us link');
    await loginPage.clickAboutUs();
    // Add verification for About Us page if needed
    
    logger.step('Navigate back to login page');
    await loginPage.navigateToLoginPage();
    
    logger.step('Test Contact Us link');
    await loginPage.clickContactUs();
    // Add verification for Contact Us page if needed
  });
});

/**
 * Data-driven login tests using CSV data
 */
test.describe('Data-Driven Login Tests', () => {
  let loginTestData: any[] = [];

  test.beforeAll(async () => {
    // Load CSV test data
    loginTestData = await TestDataManager.readCsvData('login-test-data');
  });

  test('Execute data-driven login tests', async ({ loginPage, logger }) => {
    const testData = await TestDataManager.readCsvData('login-test-data');
    
    for (let i = 0; i < testData.length; i++) {
      const testCase = testData[i];
      logger.step(`Execute test case ${i + 1}: ${testCase.description}`);
      
      await loginPage.navigateToLoginPage();
      await loginPage.login(testCase.username, testCase.password);
      
      const isLoginSuccessful = await loginPage.isLoginSuccessful();
      
      if (testCase.expectedResult === 'success') {
        expect(isLoginSuccessful).toBeTruthy();
        logger.step('Login successful as expected');
      } else {
        expect(isLoginSuccessful).toBeFalsy();
        logger.step('Login failed as expected');
      }
      
      // Clear form for next test case
      if (i < testData.length - 1) {
        await loginPage.clearLoginForm();
      }
    }
  });
});

/**
 * Cross-browser login tests
 */
test.describe('Cross-Browser Login Tests', () => {
  test('Login functionality validation', async ({ loginPage, logger }) => {
    logger.step('Testing login functionality');
    
    const users = await TestDataManager.readJsonData('test-data');
    const validUser = users.validUsers[0];
    
    await loginPage.navigateToLoginPage();
    await loginPage.verifyLoginPageLoaded();
    await loginPage.login(validUser.username, validUser.password);
    
    const isLoginSuccessful = await loginPage.isLoginSuccessful();
    expect(isLoginSuccessful).toBeTruthy();
    
    logger.step('Login test passed');
  });
});

/**
 * Performance and accessibility tests
 */
test.describe('Login Page Performance & Accessibility', () => {
  test('Login page load performance', async ({ page, loginPage, logger }) => {
    logger.step('Navigate to login page and measure performance');
    
    const startTime = Date.now();
    await loginPage.navigateToLoginPage();
    const loadTime = Date.now() - startTime;
    
    logger.step(`Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // Page should load within 5 seconds
  });

  test('Login page accessibility', async ({ page, loginPage, logger }) => {
    logger.step('Navigate to login page');
    await loginPage.navigateToLoginPage();
    
    logger.step('Check for basic accessibility requirements');
    
    // Check for proper form labels
    await expect(loginPage.usernameInput).toHaveAttribute('name', 'Username');
    await expect(loginPage.passwordInput).toHaveAttribute('name', 'Password');
    
    // Check for submit button
    await expect(loginPage.submitButton).toBeVisible();
    
    logger.step('Basic accessibility checks passed');
  });
});
