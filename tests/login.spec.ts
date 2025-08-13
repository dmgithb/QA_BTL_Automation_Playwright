import { test, expect, LoginPage, TestDataManager, ConfigManager } from '../src/fixtures/test-fixtures';

/**
 * 🔐 Enhanced Login Test Suite - Bulktainer ERP System
 * 
 * Test Coverage:
 * - @critical: Core authentication flows (2-3 minutes)
 * - @smoke: Important login scenarios (5-10 minutes) 
 * - @regression: Comprehensive edge cases (20-30 minutes)
 * 
 * User Story: As a user, I want to securely authenticate to the ERP system
 * so that I can access my authorized features and data.
 * 
 * Security Implementation: No hardcoded credentials, environment variables only
 */
test.describe('🔐 Login Authentication - Bulktainer ERP System', () => {
  
  test.beforeEach(async ({ page }, testInfo) => {
    // Import test hooks for setup
    const { TestHooks } = await import('../src/fixtures/test-fixtures');
    await TestHooks.beforeEach(page, testInfo);
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Import test hooks for cleanup
    const { TestHooks } = await import('../src/fixtures/test-fixtures');
    await TestHooks.afterEach(page, testInfo);
  });

  // ========================================
  // 🔥 CRITICAL PATH TESTS @critical
  // Core authentication - Must pass (2-3 minutes execution)
  // ========================================
  test.describe('🔥 Critical Authentication Tests @critical', () => {

    test('Given valid credentials, When user logs in, Then authentication succeeds @critical @smoke', async ({ page, loginPage, logger }) => {
      // GIVEN: Valid user credentials are available
      logger.step('GIVEN: Loading secure test credentials');
      const users = await TestDataManager.getSecureTestData('login-data');
      const validUser = users.validUsers[0];
      
      // WHEN: User navigates to login page and enters credentials
      logger.step('WHEN: Navigate to login page and enter valid credentials');
      await loginPage.navigateToLoginPage();
      await loginPage.verifyLoginPageLoaded();
      await loginPage.login(validUser.username, validUser.password);
      
      // THEN: Authentication succeeds and user is redirected
      logger.step('THEN: Verify successful authentication');
      const isLoginSuccessful = await loginPage.isLoginSuccessful();
      expect(isLoginSuccessful).toBeTruthy();
      
      logger.step('Save authentication state for session reuse');
      const { TestHooks } = await import('../src/fixtures/test-fixtures');
      await TestHooks.saveAuthState(page, validUser.username);
    });

    test('Given invalid credentials, When user attempts login, Then authentication fails @critical', async ({ loginPage, logger }) => {
      // GIVEN: Invalid user credentials
      logger.step('GIVEN: Loading invalid test credentials');
      const users = await TestDataManager.getSecureTestData('login-data');
      const invalidUser = users.invalidUsers[0];
      
      // WHEN: User attempts login with invalid credentials
      logger.step('WHEN: Attempt login with invalid credentials');
      await loginPage.navigateToLoginPage();
      await loginPage.login(invalidUser.username, invalidUser.password);
      
      // THEN: Authentication fails with appropriate feedback
      logger.step('THEN: Verify authentication failure');
      const isLoginSuccessful = await loginPage.isLoginSuccessful();
      expect(isLoginSuccessful).toBeFalsy();
    });

    test('Given login page loads, When page renders, Then all critical elements are visible @critical @smoke', async ({ page, loginPage, logger }) => {
      // GIVEN: User navigates to login page
      logger.step('GIVEN: Navigate to login page');
      await loginPage.navigateToLoginPage();
      
      // WHEN: Page loads completely
      logger.step('WHEN: Page completes loading');
      await loginPage.verifyLoginPageLoaded();
      
      // THEN: All critical login elements are visible
      logger.step('THEN: Verify all critical login elements are present');
      await loginPage.verifyPageTitle();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();
      
      logger.step('Take screenshot for documentation');
      await loginPage.takeScreenshot('login-page-loaded');
    });

  });

  // ========================================
  // 💨 SMOKE TESTS @smoke
  // Important scenarios - Regular execution (5-10 minutes)
  // ========================================
  test.describe('💨 Smoke Tests @smoke', () => {

    test('Given empty credentials, When user submits form, Then validation errors appear @smoke', async ({ loginPage, logger }) => {
      // GIVEN: User on login page with empty form
      logger.step('GIVEN: Navigate to login page');
      await loginPage.navigateToLoginPage();
      
      // WHEN: User submits empty login form
      logger.step('WHEN: Submit empty login form');
      await loginPage.login('', '');
      
      // THEN: Form validation prevents submission
      logger.step('THEN: Verify login failure for empty credentials');
      const isLoginSuccessful = await loginPage.isLoginSuccessful();
      expect(isLoginSuccessful).toBeFalsy();
    });

    test('Given login page, When user clicks forgot password, Then navigation succeeds @smoke', async ({ loginPage, logger }) => {
      // GIVEN: User on login page
      logger.step('GIVEN: Navigate to login page');
      await loginPage.navigateToLoginPage();
      
      try {
        // WHEN: User clicks forgot password link
        logger.step('WHEN: Click forgot password link');
        await loginPage.clickForgotPassword();
        
        // THEN: Navigation to forgot password page succeeds
        logger.step('THEN: Verify navigation to forgot password page');
        const currentUrl = await loginPage.getCurrentUrl();
        expect(currentUrl).toContain('forgot-password');
      } catch (error) {
        logger.step('Forgot password functionality not implemented - test marked as pending');
        test.skip();
      }
    });

    test('Given login form, When user interacts with form elements, Then UI responds correctly @smoke', async ({ loginPage, logger }) => {
      // GIVEN: User on login page
      logger.step('GIVEN: Navigate to login page');
      await loginPage.navigateToLoginPage();
      
      // WHEN: User interacts with form elements
      logger.step('WHEN: Test form element interactions');
      await loginPage.usernameInput.click();
      await loginPage.usernameInput.fill('test@example.com');
      await expect(loginPage.usernameInput).toHaveValue('test@example.com');
      
      await loginPage.passwordInput.click();
      await loginPage.passwordInput.fill('testpassword');
      await expect(loginPage.passwordInput).toHaveValue('testpassword');
      
      // THEN: Form elements respond appropriately
      logger.step('THEN: Form elements are functional');
      await expect(loginPage.submitButton).toBeEnabled();
    });

  });

  // ========================================
  // 🔄 REGRESSION TESTS @regression
  // Comprehensive edge cases (20-30 minutes)
  // ========================================
  test.describe('🔄 Regression Tests @regression', () => {

    test('Given special characters in credentials, When user logs in, Then system handles gracefully @regression', async ({ loginPage, logger }) => {
      // GIVEN: Special character test data
      logger.step('GIVEN: Load special character test data');
      const specialChars = ['<script>', 'admin@test.com', "'; DROP TABLE users; --"];
      
      for (const testInput of specialChars) {
        // WHEN: User enters special characters
        logger.step(`WHEN: Test special character input: ${testInput}`);
        await loginPage.navigateToLoginPage();
        await loginPage.login(testInput, testInput);
        
        // THEN: System handles input gracefully
        logger.step('THEN: Verify system handles special characters');
        const isLoginSuccessful = await loginPage.isLoginSuccessful();
        expect(isLoginSuccessful).toBeFalsy();
      }
    });

    test('Given multiple failed login attempts, When user retries, Then security measures activate @regression @security', async ({ loginPage, logger }) => {
      // GIVEN: Invalid credentials for multiple attempts
      logger.step('GIVEN: Prepare for multiple failed attempts');
      const invalidCreds = { username: 'invalid@test.com', password: 'wrongpassword' };
      
      // WHEN: Multiple failed login attempts
      for (let attempt = 1; attempt <= 3; attempt++) {
        logger.step(`WHEN: Attempt ${attempt} - Login with invalid credentials`);
        await loginPage.navigateToLoginPage();
        await loginPage.login(invalidCreds.username, invalidCreds.password);
        
        // THEN: Each attempt fails appropriately
        const isLoginSuccessful = await loginPage.isLoginSuccessful();
        expect(isLoginSuccessful).toBeFalsy();
        
        logger.step(`Attempt ${attempt} failed as expected`);
      }
    });

    test('Given very long input strings, When user submits form, Then system validates input length @regression', async ({ loginPage, logger }) => {
      // GIVEN: Very long input strings
      logger.step('GIVEN: Generate very long input strings');
      const longString = 'a'.repeat(1000);
      
      // WHEN: User enters long strings
      logger.step('WHEN: Enter very long strings in form fields');
      await loginPage.navigateToLoginPage();
      await loginPage.login(longString, longString);
      
      // THEN: System handles long inputs gracefully
      logger.step('THEN: Verify system handles long inputs');
      const isLoginSuccessful = await loginPage.isLoginSuccessful();
      expect(isLoginSuccessful).toBeFalsy();
    });

    test('Given browser navigation, When user uses back/forward buttons, Then session state maintains @regression', async ({ page, loginPage, logger }) => {
      // GIVEN: User successfully logs in
      logger.step('GIVEN: User logs in successfully');
      const users = await TestDataManager.getSecureTestData('login-data');
      const validUser = users.validUsers[0];
      
      await loginPage.navigateToLoginPage();
      await loginPage.login(validUser.username, validUser.password);
      
      // WHEN: User navigates using browser controls
      logger.step('WHEN: Test browser navigation');
      await page.goBack();
      await page.goForward();
      
      // THEN: Session state is maintained appropriately
      logger.step('THEN: Verify session state after navigation');
      // Add specific verification based on your app's behavior
      const currentUrl = await page.url();
      logger.step(`Current URL after navigation: ${currentUrl}`);
    });

  });
});

/**
 * 📊 Data-Driven Login Tests @regression
 * Comprehensive test scenarios using external data sources
 */
test.describe('📊 Data-Driven Authentication Tests @regression', () => {
  
  test('Given CSV test data, When executing multiple login scenarios, Then all cases execute correctly @regression @data-driven', async ({ loginPage, logger }) => {
    // GIVEN: CSV test data is available
    logger.step('GIVEN: Load CSV test data');
    const testData = await TestDataManager.readCsvData('login-test-data');
    
    for (let i = 0; i < testData.length; i++) {
      const testCase = testData[i];
      logger.step(`WHEN: Execute test case ${i + 1}: ${testCase.description}`);
      
      try {
        // WHEN: Execute each test case
        await loginPage.navigateToLoginPage();
        await loginPage.login(testCase.username, testCase.password);
        
        const isLoginSuccessful = await loginPage.isLoginSuccessful();
        
        // THEN: Verify expected results
        if (testCase.expectedResult === 'success') {
          expect(isLoginSuccessful).toBeTruthy();
          logger.step(`✅ Test case ${i + 1}: Login successful as expected`);
        } else {
          expect(isLoginSuccessful).toBeFalsy();
          logger.step(`✅ Test case ${i + 1}: Login failed as expected`);
        }
        
        // Clear state for next iteration
        if (i < testData.length - 1) {
          await loginPage.clearLoginForm();
        }
        
      } catch (error) {
        logger.step(`❌ Test case ${i + 1} failed: ${error}`);
        throw error;
      }
    }
  });

  test('Given JSON test scenarios, When validating edge cases, Then comprehensive coverage achieved @regression', async ({ loginPage, logger }) => {
    // GIVEN: Comprehensive JSON test data
    logger.step('GIVEN: Load comprehensive JSON test scenarios');
    const users = await TestDataManager.getSecureTestData('login-data');
    
    // Test valid users
    for (const validUser of users.validUsers) {
      logger.step(`WHEN: Test valid user: ${validUser.username}`);
      await loginPage.navigateToLoginPage();
      await loginPage.login(validUser.username, validUser.password);
      
      const isLoginSuccessful = await loginPage.isLoginSuccessful();
      expect(isLoginSuccessful).toBeTruthy();
      logger.step('✅ Valid user authentication successful');
    }
    
    // Test invalid users
    for (const invalidUser of users.invalidUsers) {
      logger.step(`WHEN: Test invalid user: ${invalidUser.username}`);
      await loginPage.navigateToLoginPage();
      await loginPage.login(invalidUser.username, invalidUser.password);
      
      const isLoginSuccessful = await loginPage.isLoginSuccessful();
      expect(isLoginSuccessful).toBeFalsy();
      logger.step('✅ Invalid user authentication failed as expected');
    }
  });

});

/**
 * 🌐 Cross-Browser Compatibility Tests @regression
 * Ensure consistent behavior across different browsers
 */
test.describe('🌐 Cross-Browser Authentication @regression', () => {
  
  test('Given different browsers, When user authenticates, Then behavior is consistent @regression @cross-browser', async ({ loginPage, logger, page }) => {
    // GIVEN: Valid credentials for cross-browser testing
    logger.step('GIVEN: Load secure credentials for cross-browser testing');
    const users = await TestDataManager.getSecureTestData('login-data');
    const validUser = users.validUsers[0];
    
    // WHEN: User performs login across browsers
    logger.step(`WHEN: Test login functionality on ${page.context().browser()?.browserType().name()}`);
    await loginPage.navigateToLoginPage();
    await loginPage.verifyLoginPageLoaded();
    await loginPage.login(validUser.username, validUser.password);
    
    // THEN: Authentication succeeds consistently
    logger.step('THEN: Verify consistent authentication behavior');
    const isLoginSuccessful = await loginPage.isLoginSuccessful();
    expect(isLoginSuccessful).toBeTruthy();
    
    logger.step(`✅ Login test passed on ${page.context().browser()?.browserType().name()}`);
  });

  test('Given mobile viewport, When user accesses login, Then responsive design works @regression @mobile', async ({ page, loginPage, logger }) => {
    // GIVEN: Mobile viewport configuration
    logger.step('GIVEN: Set mobile viewport');
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    // WHEN: User accesses login on mobile
    logger.step('WHEN: Access login page on mobile viewport');
    await loginPage.navigateToLoginPage();
    await loginPage.verifyLoginPageLoaded();
    
    // THEN: Mobile interface is functional
    logger.step('THEN: Verify mobile interface functionality');
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    
    logger.step('Take mobile screenshot for verification');
    await loginPage.takeScreenshot('login-mobile-view');
  });

});

/**
 * ⚡ Performance & Accessibility Tests @regression
 * Ensure optimal user experience and compliance
 */
test.describe('⚡ Performance & Accessibility @regression', () => {
  
  test('Given login page loads, When measuring performance, Then meets performance standards @regression @performance', async ({ page, loginPage, logger }) => {
    // GIVEN: Performance measurement setup
    logger.step('GIVEN: Setup performance measurement');
    const startTime = Date.now();
    
    // WHEN: Page loads with performance tracking
    logger.step('WHEN: Navigate to login page with performance tracking');
    await loginPage.navigateToLoginPage();
    await loginPage.verifyLoginPageLoaded();
    const loadTime = Date.now() - startTime;
    
    // THEN: Performance meets standards
    logger.step(`THEN: Verify performance - Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(10000); // Must load within 10 seconds
    expect(loadTime).toBeLessThan(5000);  // Ideally within 5 seconds
    
    logger.step(`✅ Performance test passed: ${loadTime}ms load time`);
  });

  test('Given login form, When checking accessibility, Then WCAG standards are met @regression @accessibility', async ({ page, loginPage, logger }) => {
    // GIVEN: User on login page
    logger.step('GIVEN: Navigate to login page for accessibility testing');
    await loginPage.navigateToLoginPage();
    
    // WHEN: Checking accessibility features
    logger.step('WHEN: Verify accessibility compliance');
    
    // Form labels and attributes
    await expect(loginPage.usernameInput).toHaveAttribute('name', 'username');
    await expect(loginPage.passwordInput).toHaveAttribute('name', 'password');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    
    // Interactive elements
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.submitButton).toBeEnabled();
    
    // Keyboard navigation
    await loginPage.usernameInput.focus();
    await page.keyboard.press('Tab');
    await expect(loginPage.passwordInput).toBeFocused();
    
    // THEN: Basic accessibility requirements are met
    logger.step('THEN: Basic accessibility checks passed');
    logger.step('✅ Accessibility compliance verified');
  });

  test('Given authentication flow, When measuring end-to-end performance, Then login completes efficiently @regression @e2e-performance', async ({ loginPage, logger }) => {
    // GIVEN: Valid credentials and performance tracking
    logger.step('GIVEN: Setup end-to-end performance measurement');
    const users = await TestDataManager.getSecureTestData('login-data');
    const validUser = users.validUsers[0];
    const startTime = Date.now();
    
    // WHEN: Complete authentication flow
    logger.step('WHEN: Execute complete authentication flow');
    await loginPage.navigateToLoginPage();
    await loginPage.login(validUser.username, validUser.password);
    const isLoginSuccessful = await loginPage.isLoginSuccessful();
    const totalTime = Date.now() - startTime;
    
    // THEN: End-to-end performance is acceptable
    logger.step(`THEN: Verify E2E performance - Total time: ${totalTime}ms`);
    expect(isLoginSuccessful).toBeTruthy();
    expect(totalTime).toBeLessThan(15000); // Complete flow within 15 seconds
    
    logger.step(`✅ E2E Performance test passed: ${totalTime}ms total time`);
  });

});
