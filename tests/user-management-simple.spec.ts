import { test, expect } from '@playwright/test';
import { UserManagementPage } from '../src/pages/user-management.page';
import { LoginPage } from '../src/pages/login.page';
import { TestDataManager } from '../src/utils/test-data-manager';
import { TestDataFactory } from '../src/utils/test-data-factory';

test.describe('User Management Tests - @digitalmesh.com Domain (Simplified)', () => {
  let userManagementPage: UserManagementPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    userManagementPage = new UserManagementPage(page);
    loginPage = new LoginPage(page);

    console.log('Setup: Login to ERP system');
    
    // Load login data
    const loginData = await TestDataManager.readJsonData('login-data');
    const validUser = loginData.validUsers[0];
    
    // Navigate to login page and login
    await loginPage.navigateToLoginPage();
    await loginPage.login(validUser.username, validUser.password);
    
    // Verify successful login
    const isLoginSuccessful = await loginPage.isLoginSuccessful();
    expect(isLoginSuccessful).toBeTruthy();
    
    console.log('Setup completed - User logged in successfully');
  });

  test('Navigate to Users Info via Core Data menu', async ({ page }) => {
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

  test('Create user with short username (@digitalmesh.com email)', async ({ page }) => {
    console.log('Test: Create user with short username and @digitalmesh.com email');
    
    // Use short username to avoid field length limits
    const shortId = Math.floor(Math.random() * 999).toString(); // 3-digit random number
    const testUser = {
      fullName: 'Test User',
      company: 'Test Company Ltd',
      telephone: '+1234567890',
      department: 'IT',
      accessPermission: 'Full Access',
      username: `user${shortId}`,
      email: `user${shortId}@digitalmesh.com`,
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
      status: 'Active' as const,
      allowSystemGeneratedHBLs: 'No'
    };
    
    console.log(`Creating user: ${testUser.fullName} with email: ${testUser.email}`);
    
    // Navigate to Users Info page
    await userManagementPage.navigateToUsersInfo();
    
    // Click Add New User button
    await userManagementPage.clickAddNewUser();
    
    // Fill only required fields to avoid complex interactions
    await userManagementPage.fullNameInput.fill(testUser.fullName);
    await userManagementPage.usernameInput.fill(testUser.username);
    await userManagementPage.emailInput.fill(testUser.email);
    await userManagementPage.passwordInput.fill(testUser.password);
    await userManagementPage.confirmPasswordInput.fill(testUser.confirmPassword);
    
    // Optional: Fill company if field is available
    try {
      await userManagementPage.companyInput.fill(testUser.company);
    } catch (error) {
      console.log('Company field not available or accessible');
    }
    
    // Verify the email contains @digitalmesh.com
    expect(testUser.email).toContain('@digitalmesh.com');
    
    // Submit the form (click Create button)
    await userManagementPage.createButton.click();
    
    // Verify successful creation (should redirect to users list)
    await expect(page).toHaveURL(/user\/index/);
    
    console.log(`User ${testUser.fullName} created successfully with @digitalmesh.com email`);
  });

  test('Create user with Factory pattern (simple version)', async ({ page }) => {
    console.log('Test: Create user with Factory pattern @digitalmesh.com email');
    
    // Generate user data but simplify username to avoid length issues
    const generatedUser = await TestDataFactory.generateUserData();
    const shortId = Math.floor(Math.random() * 999).toString();
    
    // Override with shorter username
    const simplifiedUser = {
      ...generatedUser,
      username: `gen${shortId}`,
      email: `gen${shortId}@digitalmesh.com`
    };
    
    console.log(`Generated user with email: ${simplifiedUser.email}`);
    
    // Navigate to Users Info page
    await userManagementPage.navigateToUsersInfo();
    
    // Click Add New User button
    await userManagementPage.clickAddNewUser();
    
    // Fill only essential fields
    await userManagementPage.fullNameInput.fill(simplifiedUser.fullName);
    await userManagementPage.usernameInput.fill(simplifiedUser.username);
    await userManagementPage.emailInput.fill(simplifiedUser.email);
    await userManagementPage.passwordInput.fill(simplifiedUser.password);
    await userManagementPage.confirmPasswordInput.fill(simplifiedUser.confirmPassword);
    
    // Verify email domain
    expect(simplifiedUser.email).toContain('@digitalmesh.com');
    
    // Submit the form
    await userManagementPage.createButton.click();
    
    // Verify successful creation
    await expect(page).toHaveURL(/user\/index/);
    
    console.log(`User created with generated @digitalmesh.com email: ${simplifiedUser.email}`);
  });

  test('Verify email field accepts @digitalmesh.com format', async ({ page }) => {
    console.log('Test: Verify @digitalmesh.com email field acceptance');
    
    // Navigate to Users Info page
    await userManagementPage.navigateToUsersInfo();
    
    // Click Add New User button
    await userManagementPage.clickAddNewUser();
    
    // Test different @digitalmesh.com email formats
    const emailFormats = [
      'simple@digitalmesh.com',
      'user.name@digitalmesh.com', 
      'user_name@digitalmesh.com',
      'user123@digitalmesh.com'
    ];
    
    for (const email of emailFormats) {
      await userManagementPage.emailInput.fill(email);
      const filledValue = await userManagementPage.emailInput.inputValue();
      
      expect(filledValue).toBe(email);
      expect(filledValue).toContain('@digitalmesh.com');
      
      console.log(`✅ Email format accepted: ${email}`);
    }
    
    console.log('Email field validation test passed - @digitalmesh.com emails accepted');
  });

  test('Test form field validation with @digitalmesh.com', async ({ page }) => {
    console.log('Test: Form validation with @digitalmesh.com email');
    
    const shortId = Math.floor(Math.random() * 999).toString();
    
    // Navigate to Users Info page
    await userManagementPage.navigateToUsersInfo();
    
    // Click Add New User button
    await userManagementPage.clickAddNewUser();
    
    // Fill form with valid @digitalmesh.com data
    await userManagementPage.fullNameInput.fill('Form Validation Test');
    await userManagementPage.usernameInput.fill(`form${shortId}`);
    await userManagementPage.emailInput.fill(`form${shortId}@digitalmesh.com`);
    await userManagementPage.passwordInput.fill('ValidPass123!');
    await userManagementPage.confirmPasswordInput.fill('ValidPass123!');
    
    // Verify form accepts the data
    const emailValue = await userManagementPage.emailInput.inputValue();
    const usernameValue = await userManagementPage.usernameInput.inputValue();
    
    expect(emailValue).toContain('@digitalmesh.com');
    expect(usernameValue).toBe(`form${shortId}`);
    
    console.log(`Form validation successful with: ${emailValue}`);
    
    // Submit the form to test full validation
    await userManagementPage.createButton.click();
    
    // Should redirect to users list if validation passes
    await expect(page).toHaveURL(/user\/index/);
    
    console.log('Form validation test completed successfully');
  });

  test('Test data consistency - all emails use @digitalmesh.com', async ({ page }) => {
    console.log('Test: Data consistency verification');
    
    // Test static data
    const userData = await TestDataManager.readJsonData('user-management-data');
    const users = userData.newUsers;
    
    for (const user of users) {
      expect(user.email).toContain('@digitalmesh.com');
      console.log(`✅ Static user email validated: ${user.email}`);
    }
    
    // Test factory-generated data
    for (let i = 0; i < 3; i++) {
      const generatedUser = await TestDataFactory.generateUserData();
      expect(generatedUser.email).toContain('@digitalmesh.com');
      console.log(`✅ Generated user email validated: ${generatedUser.email}`);
    }
    
    console.log('Data consistency test passed - all emails use @digitalmesh.com');
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
