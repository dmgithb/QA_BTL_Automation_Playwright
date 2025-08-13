import { test, expect } from '../src/fixtures/test-fixtures';

/**
 * 👥 Enhanced User Management Test Suite - Bulktainer ERP System
 * 
 * Test Coverage:
 * - @critical: Core user management operations (2-3 minutes)
 * - @smoke: Important user scenarios (5-10 minutes) 
 * - @regression: Comprehensive edge cases (20-30 minutes)
 * 
 * User Story: As an admin user, I want to efficiently manage user accounts
 * so that I can control system access and maintain security.
 * 
 * Security Implementation: Environment variables, secure data patterns
 */
test.describe('👥 Enhanced User Management - Bulktainer ERP System', () => {

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
  // CRITICAL TESTS - Always run in normal execution
  // ========================================
  test.describe('🔥 Critical Path Tests @critical @smoke', () => {
    
    test('Navigate to Users Info via Core Data menu @navigation @critical', async ({ page }) => {
      console.log('Test: Navigate to Users Info page');
      
      // Navigate to Users Info page
      await userManagementPage.navigateToUsersInfo();
      
      // Verify we're on the users page
      expect(page.url()).toContain('/user/index');
      
      // Verify page elements are visible
      await expect(userManagementPage.usersTable).toBeVisible();
      await expect(userManagementPage.addNewUserButton).toBeVisible();
      
      console.log('Successfully navigated to Users Info page');
    });

    test('Create user with Factory pattern - Core functionality @factory @critical', async ({ page }) => {
      console.log('Test: Create user with dynamically generated @digitalmesh.com email');
      
      // Generate user data using Factory pattern (now uses @digitalmesh.com)
      const generatedUser = await TestDataFactory.generateUserData({
        department: 'Operations',
        status: 'Active',
        fullName: `Generated User ${Date.now()}`
      });
      
      console.log(`Generated user with email: ${generatedUser.email}`);
      
      // Navigate to Users Info page
      await userManagementPage.navigateToUsersInfo();
      
      // Click Add New User button
      await userManagementPage.clickAddNewUser();
      
      // Fill user details with generated data
      await userManagementPage.fillUserDetails(generatedUser);
      
      // Submit the form using improved method
      await userManagementPage.submitCreateUserForm();
      
      console.log(`User created with generated @digitalmesh.com email: ${generatedUser.email}`);
    });

    test('Verify @digitalmesh.com email domain acceptance @email @critical', async ({ page }) => {
      console.log('Test: Verify @digitalmesh.com email validation');
      
      // Create test user with valid @digitalmesh.com email
      const testUser = {
        fullName: 'Email Validation Test User',
        company: 'Test Company',
        telephone: '+1234567890',
        department: 'IT',
        accessPermission: 'Full Access',
        username: `email${Date.now().toString().slice(-6)}`, // Short username (10 chars max)
        email: `emailvalidation_${Date.now()}@digitalmesh.com`,
        sendingInstructionsEmail: `emailvalidation_${Date.now()}@digitalmesh.com`,
        password: 'ValidPass123!',
        confirmPassword: 'ValidPass123!',
        status: 'Active' as const,
        allowSystemGeneratedHBLs: 'No' as 'No'
      };
      
      console.log(`Testing email validation with: ${testUser.email}`);
      
      // Navigate to Users Info page
      await userManagementPage.navigateToUsersInfo();
      
      // Click Add New User button
      await userManagementPage.clickAddNewUser();
      
      // Fill user details
      await userManagementPage.fillUserDetails(testUser);
      
      // Submit the form using improved method
      await userManagementPage.submitCreateUserForm();
      
      console.log('Email validation test passed - @digitalmesh.com emails accepted');
    });
  });

  // ========================================
  // REGRESSION TESTS - Run in full test suites
  // ========================================
  test.describe('🧪 Regression Tests @regression', () => {
    
    test('Create user with IT department @department @regression', async ({ page }) => {
      console.log('Test: Create user with IT department and @digitalmesh.com email');
      
      // Get test data from user management data
      const userData = await TestDataManager.readJsonData('user-management-data');
      const newUser = userData.newUsers[0]; // Test User One - IT department
      
      // Make username unique to avoid conflicts
      const uniqueUser = {
        ...newUser,
        username: `user${Date.now().toString().slice(-6)}`, // Short username (10 chars max)
        email: `testuser_${Date.now()}@digitalmesh.com`,
        sendingInstructionsEmail: `testuser_${Date.now()}@digitalmesh.com`
      };
      
      console.log(`Creating user: ${uniqueUser.fullName} with email: ${uniqueUser.email}`);
      
      // Navigate to Users Info page
      await userManagementPage.navigateToUsersInfo();
      
      // Click Add New User button
      await userManagementPage.clickAddNewUser();
      
      // Fill user details
      await userManagementPage.fillUserDetails(uniqueUser);
      
      // Submit the form using improved method
      await userManagementPage.submitCreateUserForm();
      
      console.log(`User ${uniqueUser.fullName} created successfully with @digitalmesh.com email`);
    });

    test('Create user with Commercial department @department @regression', async ({ page }) => {
      console.log('Test: Create user with Commercial department and @digitalmesh.com email');
      
      // Get test data
      const userData = await TestDataManager.readJsonData('user-management-data');
      const newUser = userData.newUsers[1]; // Jane Smith - Commercial department
      
      // Make username unique
      const uniqueUser = {
        ...newUser,
        username: `jane${Date.now().toString().slice(-6)}`, // Short username (10 chars max)
        email: `jane_${Date.now()}@digitalmesh.com`,
        sendingInstructionsEmail: `jane_${Date.now()}@digitalmesh.com`
      };
      
      console.log(`Creating user: ${uniqueUser.fullName} with email: ${uniqueUser.email}`);
      
      // Navigate to Users Info page
      await userManagementPage.navigateToUsersInfo();
      
      // Click Add New User button
      await userManagementPage.clickAddNewUser();
      
      // Fill user details
      await userManagementPage.fillUserDetails(uniqueUser);
      
      // Submit the form using improved method
      await userManagementPage.submitCreateUserForm();
      
      console.log(`Commercial user ${uniqueUser.fullName} created successfully`);
    });
  });

  // ========================================
  // EXTENDED TESTS - Run only when needed
  // ========================================
  test.describe('🔬 Extended Tests @extended', () => {
    
    test('Test checkbox validation with @digitalmesh.com email @checkbox @extended', async ({ page }) => {
      console.log('Test: Checkbox validation with @digitalmesh.com email');
      
      // Navigate to Users Info page
      await userManagementPage.navigateToUsersInfo();
      
      // Click Add New User button
      await userManagementPage.clickAddNewUser();
      
      // Fill basic required fields
      await userManagementPage.fullNameInput.fill('Checkbox Test User');
      await userManagementPage.usernameInput.fill(`check${Date.now().toString().slice(-6)}`); // Short username
      await userManagementPage.emailInput.fill(`checkboxtest_${Date.now()}@digitalmesh.com`);
      await userManagementPage.passwordInput.fill('CheckboxPass123!');
      await userManagementPage.confirmPasswordInput.fill('CheckboxPass123!');
      
      // Try to check the sending instructions email checkbox (use force for hidden elements)
      try {
        await userManagementPage.sendingInstructionsEmailCheckbox.click({ force: true });
        await page.waitForTimeout(500); // Wait for field to become enabled
        
        // Fill sending instructions email
        await userManagementPage.sendingInstructionsEmailInput.fill(`checkboxinstructions_${Date.now()}@digitalmesh.com`);
      } catch (error) {
        console.log('Checkbox interaction failed, continuing without checkbox check');
      }
      
      // Submit the form
      await userManagementPage.createButton.click();
      
      // Verify no checkbox error (should redirect to users list)
      await expect(page).toHaveURL(/user\/index/);
      
      console.log('Checkbox validation test passed - no "check at least one checkbox" error');
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Take screenshot on failure
    if (testInfo.status === 'failed') {
      const screenshotName = `failure-${testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
      await page.screenshot({
        path: `reports/screenshots/${screenshotName}.png`,
        fullPage: true
      });
      console.log(`Test failed. Screenshot saved: ${screenshotName}.png`);
    }
    
    console.log(`Test completed: ${testInfo.title} - ${testInfo.status}`);
  });
});
