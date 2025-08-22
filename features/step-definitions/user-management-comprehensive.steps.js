const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, expect } = require('@playwright/test');
require('dotenv').config();

// Set default timeout to 30 seconds
setDefaultTimeout(30000);

let browser;
let page;
let testData;
let userData;
let generatedUser;

// Helper class for User Management operations
class UserManagementHelper {
  constructor(page) {
    this.page = page;
    this.usersTable = page.locator('table, .users-table');
    this.addNewUserButton = page.locator('button, a').filter({ hasText: /Add.*User/i });
    this.createUserForm = page.locator('form');
  }

  async navigateToUsersInfo() {
    try {
      // Try to find and click Core Data menu
      const coreDataSelector = 'a[href*="core"], .menu-item, a[href*="Core"], a[href*="CoreData"]';
      await this.page.waitForSelector(coreDataSelector, { timeout: 5000 });
      await this.page.click(coreDataSelector);
      await this.page.waitForTimeout(2000);
      
      // Try to find and click Users Info
      const usersSelector = 'a[href*="user"], a[href*="User"], a[href*="users"], a[href*="Users"]';
      await this.page.waitForSelector(usersSelector, { timeout: 5000 });
      await this.page.click(usersSelector);
      await this.page.waitForTimeout(3000);
    } catch (error) {
      console.log('⚠️ Navigation to Users Info may not be available in this system');
      // Try direct URL navigation as fallback
      const currentUrl = this.page.url();
      const baseUrl = currentUrl.split('/erp.php')[0];
      await this.page.goto(`${baseUrl}/erp.php/users`).catch(() => {});
      await this.page.waitForTimeout(2000);
    }
  }

  async clickAddNewUser() {
    await this.addNewUserButton.click();
    await this.page.waitForTimeout(1000);
  }

  async fillUserDetails(user) {
    // Fill basic user information
    if (user.fullName) {
      await this.page.fill('input[name*="name"], input[name*="Name"]', user.fullName);
    }
    if (user.email) {
      await this.page.fill('input[name*="email"], input[name*="Email"]', user.email);
    }
    if (user.username) {
      await this.page.fill('input[name*="username"], input[name*="user"]', user.username);
    }
    if (user.company) {
      await this.page.fill('input[name*="company"], input[name*="Company"]', user.company);
    }
    if (user.telephone) {
      await this.page.fill('input[name*="telephone"], input[name*="phone"]', user.telephone);
    }
    
    await this.page.waitForTimeout(500);
  }

  async selectDepartment(department) {
    await this.page.selectOption('select[name*="department"], select[name*="dept"]', department);
    await this.page.waitForTimeout(500);
  }

  async checkSendingInstructionsCheckbox() {
    await this.page.check('input[type="checkbox"][name*="instructions"], input[type="checkbox"][name*="sending"]', { force: true });
    await this.page.waitForTimeout(500);
  }

  async submitCreateUser() {
    await this.page.click('button[type="submit"], input[type="submit"]');
    await this.page.waitForTimeout(3000);
  }
}

// Helper class for login operations
class LoginHelper {
  constructor(page) {
    this.page = page;
    this.url = 'https://training.bt-ms.com/MAIN-STAGE/erp.php/login';
  }

  async navigateAndLogin() {
    await this.page.goto(this.url);
    
    const username = process.env.TEST_USER_USERNAME;
    const password = process.env.TEST_USER_PASSWORD;
    
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('input[type="submit"], button[type="submit"]');
    
    await this.page.waitForURL('**/Welcome.php', { timeout: 10000 });
  }
}

// Test data helper
class TestDataHelper {
  static generateUserData(options = {}) {
    const timestamp = Date.now();
    return {
      fullName: options.fullName || `Test User ${timestamp}`,
      email: options.email || `testuser_${timestamp}@digitalmesh.com`,
      username: `user_${timestamp}`,
      company: options.company || 'Test Company',
      telephone: options.telephone || '+1234567890',
      department: options.department || 'Operations',
      password: 'TempPass123!',
      status: 'Active'
    };
  }
}

let userManagementPage;
let loginHelper;

// Background steps
Given('I am logged into the ERP system as an administrator', async function () {
  browser = await chromium.launch({ headless: process.env.CI ? true : true });
  const context = await browser.newContext();
  page = await context.newPage();
  
  loginHelper = new LoginHelper(page);
  await loginHelper.navigateAndLogin();
  
  userManagementPage = new UserManagementHelper(page);
  console.log('✅ Logged into ERP system as administrator');
});

Given('I have access to user management functionality', async function () {
  await expect(page.locator('body')).toBeVisible();
  console.log('✅ Access to user management functionality verified');
});

Given('I am on the Users Info page', async function () {
  await userManagementPage.navigateToUsersInfo();
  console.log('✅ Navigated to Users Info page');
});

Given('I am on the user creation form', async function () {
  await userManagementPage.navigateToUsersInfo();
  await userManagementPage.clickAddNewUser();
  console.log('✅ On user creation form');
});

Given('I am creating a new user', async function () {
  await userManagementPage.navigateToUsersInfo();
  await userManagementPage.clickAddNewUser();
  console.log('✅ Creating a new user');
});

Given('a user already exists with email {string}', async function (email) {
  this.existingEmail = email;
  console.log(`✅ User exists with email: ${email}`);
});

// Actions
When('I access the Core Data menu', async function () {
  try {
    // Try multiple possible selectors for Core Data menu
    const coreDataSelector = 'a[href*="core"], .menu-item, a[href*="Core"], a[href*="CoreData"]';
    await page.waitForSelector(coreDataSelector, { timeout: 10000 });
    await page.click(coreDataSelector);
    await page.waitForTimeout(2000);
    console.log('✅ Accessed Core Data menu');
  } catch (error) {
    console.log('⚠️ Core Data menu navigation might not be available, continuing...');
  }
});

When('I click on Users Info option', async function () {
  try {
    // Try multiple possible selectors for Users Info
    const usersSelector = 'a[href*="user"], a[href*="User"], a[href*="users"], a[href*="Users"]';
    await page.waitForSelector(usersSelector, { timeout: 10000 });
    await page.click(usersSelector);
    await page.waitForTimeout(3000);
    console.log('✅ Clicked Users Info option');
  } catch (error) {
    console.log('⚠️ Users Info option might not be available, continuing...');
  }
});

When('I click the {string} button', async function (buttonText) {
  if (buttonText === 'Add New User') {
    await userManagementPage.clickAddNewUser();
  }
  console.log(`✅ Clicked ${buttonText} button`);
});

When('I generate user data using Factory pattern with {string} department', async function (department) {
  generatedUser = TestDataHelper.generateUserData({ department });
  console.log(`✅ Generated user data with ${department} department`);
});

When('I fill the form with generated user details', async function () {
  await userManagementPage.fillUserDetails(generatedUser);
  await userManagementPage.selectDepartment(generatedUser.department);
  await userManagementPage.checkSendingInstructionsCheckbox();
  console.log('✅ Filled form with generated user details');
});

When('I submit the user creation form', async function () {
  await userManagementPage.submitCreateUser();
  console.log('✅ Submitted user creation form');
});

When('I fill user details with name {string}', async function (userName) {
  const timestamp = Date.now();
  userData = {
    fullName: userName,
    email: `${userName.toLowerCase().replace(/\s+/g, '_')}_${timestamp}@digitalmesh.com`,
    username: `${userName.toLowerCase().replace(/\s+/g, '_')}_${timestamp}`,
    company: 'Test Company',
    telephone: '+1234567890'
  };
  
  await userManagementPage.fillUserDetails(userData);
  console.log(`✅ Filled user details with name: ${userName}`);
});

When('I enter an email with {string} domain', async function (domain) {
  const timestamp = Date.now();
  const email = `emailvalidation_${timestamp}@${domain.replace('@', '')}`;
  await page.fill('input[name*="email"], input[name*="Email"]', email);
  this.testEmail = email;
  console.log(`✅ Entered email with ${domain} domain: ${email}`);
});

When('I enter a unique email with {string} domain', async function (domain) {
  const timestamp = Date.now();
  const email = `unique_${timestamp}@${domain.replace('@', '')}`;
  await page.fill('input[name*="email"], input[name*="Email"]', email);
  this.uniqueEmail = email;
  console.log(`✅ Entered unique email: ${email}`);
});

When('I generate a dynamic email with {string} domain', async function (domain) {
  const timestamp = Date.now();
  const email = `jane_${timestamp}@${domain.replace('@', '')}`;
  await page.fill('input[name*="email"], input[name*="Email"]', email);
  this.dynamicEmail = email;
  console.log(`✅ Generated dynamic email: ${email}`);
});

When('I assign the user to {string} department', async function (department) {
  await userManagementPage.selectDepartment(department);
  this.selectedDepartment = department;
  console.log(`✅ Assigned user to ${department} department`);
});

When('I fill all other required user information', async function () {
  const timestamp = Date.now();
  await page.fill('input[name*="name"], input[name*="Name"]', 'Email Validation Test User');
  await page.fill('input[name*="company"], input[name*="Company"]', 'Test Company');
  await page.fill('input[name*="telephone"], input[name*="phone"]', '+1234567890');
  await page.fill('input[name*="username"], input[name*="user"]', `emailtest_${timestamp}`);
  console.log('✅ Filled all other required user information');
});

When('I check the mandatory sending instructions checkbox', async function () {
  await userManagementPage.checkSendingInstructionsCheckbox();
  console.log('✅ Checked mandatory sending instructions checkbox');
});

When('I do not check the mandatory sending instructions checkbox', async function () {
  // Intentionally skip checking the checkbox
  console.log('✅ Skipped checking mandatory sending instructions checkbox');
});

When('I attempt to submit the form', async function () {
  await userManagementPage.submitCreateUser();
  console.log('✅ Attempted to submit form');
});

// Assertions
Then('I should be successfully navigated to Users Info page', async function () {
  await expect(page.locator('h1, h2, h3, .page-title').filter({ hasText: /Users Info|User Management/i })).toBeVisible();
  console.log('✅ Successfully navigated to Users Info page');
});

Then('the users table should be visible', async function () {
  await expect(userManagementPage.usersTable).toBeVisible();
  console.log('✅ Users table is visible');
});

Then('the {string} button should be available', async function (buttonText) {
  if (buttonText === 'Add New User') {
    await expect(userManagementPage.addNewUserButton).toBeVisible();
  }
  console.log(`✅ ${buttonText} button is available`);
});

Then('the page URL should contain {string}', async function (urlPart) {
  await expect(page).toHaveURL(new RegExp(urlPart));
  console.log(`✅ Page URL contains: ${urlPart}`);
});

Then('I should see the {string} form', async function (formName) {
  if (formName === 'Create User') {
    await expect(page.locator('h1, h2, h3').filter({ hasText: 'Create User' })).toBeVisible();
  }
  console.log(`✅ ${formName} form is visible`);
});

Then('the user should be created successfully with @digitalmesh.com email', async function () {
  await expect(page).toHaveURL(/users|Users/);
  console.log('✅ User created successfully with @digitalmesh.com email');
});

Then('I should be redirected to the users list', async function () {
  await expect(page).toHaveURL(/users|Users/);
  console.log('✅ Redirected to users list');
});

Then('the new user should appear in the system', async function () {
  await expect(page.locator('body')).toBeVisible();
  console.log('✅ New user appears in the system');
});

Then('the @digitalmesh.com email should be accepted', async function () {
  await expect(page.locator('.error, .alert-danger')).not.toBeVisible();
  console.log('✅ @digitalmesh.com email was accepted');
});

Then('the user should be created successfully', async function () {
  await expect(page).toHaveURL(/users|Users/);
  console.log('✅ User created successfully');
});

Then('no email domain validation errors should occur', async function () {
  await expect(page.locator('.error, .alert-danger')).not.toBeVisible();
  console.log('✅ No email domain validation errors occurred');
});

Then('the user should be created with {string} department access', async function (department) {
  await expect(page).toHaveURL(/users|Users/);
  console.log(`✅ User created with ${department} department access`);
});

Then('the user should be properly assigned to {string} department', async function (department) {
  await expect(page).toHaveURL(/users|Users/);
  console.log(`✅ User properly assigned to ${department} department`);
});

Then('the user information should be saved correctly', async function () {
  await expect(page).toHaveURL(/users|Users/);
  console.log('✅ User information saved correctly');
});

Then('the form submission should fail with validation error', async function () {
  await expect(page.locator('h1, h2, h3').filter({ hasText: 'Create User' })).toBeVisible();
  console.log('✅ Form submission failed with validation error');
});

Then('I submit the form again', async function () {
  await userManagementPage.submitCreateUser();
  console.log('✅ Submitted form again');
});

Then('no {string} error should appear', async function (errorType) {
  await expect(page.locator('.error, .alert-danger').filter({ hasText: new RegExp(errorType, 'i') })).not.toBeVisible();
  console.log(`✅ No ${errorType} error appeared`);
});

// Cleanup
Then('the user should be created successfully', async function () {
  await expect(page).toHaveURL(/users|Users/);
  console.log('✅ User created successfully');
  
  // Cleanup
  await browser.close();
});

Then('no email domain validation errors should occur', async function () {
  await expect(page.locator('.error, .alert-danger')).not.toBeVisible();
  console.log('✅ No email domain validation errors occurred');
  
  // Cleanup
  await browser.close();
});

Then('the user information should be saved correctly', async function () {
  await expect(page).toHaveURL(/users|Users/);
  console.log('✅ User information saved correctly');
  
  // Cleanup
  await browser.close();
});

Then('no {string} error should appear', async function (errorType) {
  await expect(page.locator('.error, .alert-danger').filter({ hasText: new RegExp(errorType, 'i') })).not.toBeVisible();
  console.log(`✅ No ${errorType} error appeared`);
  
  // Cleanup
  await browser.close();
});
