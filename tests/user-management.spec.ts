import { test, expect } from '@playwright/test';
import { UserManagementPage } from '../src/pages/user-management.page';
import { LoginPage } from '../src/pages/login.page';
import { TestDataManager } from '../src/utils/test-data-manager';
import { TestDataFactory } from '../src/utils/test-data-factory';

test.describe('User Management Tests - @digitalmesh.com Domain', () => {
  let userManagementPage: UserManagementPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    userManagementPage = new UserManagementPage(page);
    loginPage = new LoginPage(page);

    console.log('Setup: Login to ERP system');
    
    // Load login data with secure substitution
    const loginData = await TestDataManager.getSecureTestData('login-data');
    const validUser = loginData.validUsers[0];
    
    // Navigate to login page and login
    await loginPage.navigateToLoginPage();
    await loginPage.login(validUser.username, validUser.password);
    
    // Verify successful login
    const isLoginSuccessful = await loginPage.isLoginSuccessful();
    expect(isLoginSuccessful).toBeTruthy();
    
    console.log('Setup completed - User logged in successfully');
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
      
      // Submit the form
      await userManagementPage.createButton.click();
      
      // Verify successful creation
      await expect(page).toHaveURL(/user\/index/);
      
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
        username: `emailtest_${Date.now()}`,
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
      
      // Submit the form
      await userManagementPage.createButton.click();
      
      // Verify successful creation (valid email should work)
      await expect(page).toHaveURL(/user\/index/);
      
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
        username: `${newUser.username}_${Date.now()}`,
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
      
      // Submit the form (click Create button)
      await userManagementPage.createButton.click();
      
      // Verify we're redirected back to users list
      await expect(page).toHaveURL(/user\/index/);
      
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
        username: `${newUser.username}_${Date.now()}`,
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
      
      // Submit the form
      await userManagementPage.createButton.click();
      
      // Verify successful creation
      await expect(page).toHaveURL(/user\/index/);
      
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
      await userManagementPage.usernameInput.fill(`checkboxtest_${Date.now()}`);
      await userManagementPage.emailInput.fill(`checkboxtest_${Date.now()}@digitalmesh.com`);
      await userManagementPage.passwordInput.fill('CheckboxPass123!');
      await userManagementPage.confirmPasswordInput.fill('CheckboxPass123!');
      
      // Check the sending instructions email checkbox first
      await userManagementPage.sendingInstructionsEmailCheckbox.check();
      
      // Fill sending instructions email
      await userManagementPage.sendingInstructionsEmailInput.fill(`checkboxinstructions_${Date.now()}@digitalmesh.com`);
      
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
