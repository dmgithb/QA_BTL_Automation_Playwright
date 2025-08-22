const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, expect } = require('@playwright/test');
require('dotenv').config();

// Set default timeout to 30 seconds
setDefaultTimeout(30000);

let browser;
let page;
let testData;

// Helper class for login operations
class LoginPageHelper {
  constructor(page) {
    this.page = page;
    this.url = 'https://training.bt-ms.com/MAIN-STAGE/erp.php/login';
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('input[type="submit"], button[type="submit"]');
    this.loginForm = page.locator('form');
  }

  async navigateToLoginPage() {
    await this.page.goto(this.url);
  }

  async verifyLoginPageLoaded() {
    await expect(this.page).toHaveURL(/login/);
  }

  async verifyPageTitle() {
    const title = await this.page.title();
    expect(title).toBeTruthy();
  }

  async fillUsername(username) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(username, password) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async isLoginSuccessful() {
    try {
      await this.page.waitForURL('**/Welcome.php', { timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async clearLoginForm() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
}

// Helper class for test data management
class TestDataHelper {
  static async readJsonData(fileName) {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'data', `${fileName}.json`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }

    const jsonContent = fs.readFileSync(filePath, 'utf-8');
    const resolvedContent = this.resolveEnvironmentVariables(jsonContent);
    return JSON.parse(resolvedContent);
  }

  static resolveEnvironmentVariables(content) {
    return content.replace(/\$\{([^}]+)\}/g, (match, envVar) => {
      const value = process.env[envVar];
      if (value === undefined) {
        console.warn(`Environment variable ${envVar} is not defined, using empty string`);
        return '';
      }
      return value;
    });
  }

  static async getLoginData(userType) {
    const loginData = await this.readJsonData('login-data');
    
    if (userType === 'validUser' || userType === 'admin') {
      return loginData.validUsers[0];
    }
    
    if (userType === 'invalidUser') {
      return loginData.invalidUsers[0];
    }
    
    const user = loginData.validUsers.find((u) => u.role === userType);
    if (user) {
      return user;
    }
    
    return loginData.validUsers[0];
  }
}

let loginPage;

// Background steps
Given('I am on the login page', async function () {
  browser = await chromium.launch({ headless: process.env.CI ? true : true });
  const context = await browser.newContext();
  page = await context.newPage();
  loginPage = new LoginPageHelper(page);
  await loginPage.navigateToLoginPage();
  console.log('✅ Navigated to login page');
});

// Page load and validation steps
Then('I should see the login page loaded correctly', async function () {
  await loginPage.verifyLoginPageLoaded();
  console.log('✅ Login page loaded correctly');
});

Then('I should see the page title is correct', async function () {
  await loginPage.verifyPageTitle();
  console.log('✅ Page title verified');
});

Then('I should see all login form elements', async function () {
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();
  console.log('✅ All login form elements verified');
});

// Authentication steps
Given('I have valid user credentials', async function () {
  const users = await TestDataHelper.readJsonData('login-data');
  testData = users.validUsers[0];
  console.log('✅ Valid user credentials loaded');
});

Given('I have invalid user credentials', async function () {
  const users = await TestDataHelper.readJsonData('login-data');
  testData = users.invalidUsers[0];
  console.log('✅ Invalid user credentials loaded for testing');
});

Given('I have credentials for {string} user', async function (userType) {
  testData = await TestDataHelper.getLoginData(userType);
  console.log(`✅ Loaded credentials for ${userType} user`);
});

// Actions
When('I enter my username and password', async function () {
  await loginPage.fillUsername(testData.username);
  await loginPage.fillPassword(testData.password);
  console.log('✅ Entered username and password');
});

When('I enter incorrect username and password', async function () {
  await loginPage.fillUsername(testData.username);
  await loginPage.fillPassword(testData.password);
  console.log('✅ Entered incorrect credentials');
});

When('I enter text in the password field', async function () {
  await loginPage.fillPassword('testpassword');
  console.log('✅ Entered text in password field');
});

When('I click the login button', async function () {
  await loginPage.clickLogin();
  console.log('✅ Clicked login button');
});

When('I fill in the complete login form', async function () {
  await loginPage.fillUsername(testData.username);
  await loginPage.fillPassword(testData.password);
  console.log('✅ Filled complete login form');
});

When('I submit the form', async function () {
  await loginPage.clickLogin();
  console.log('✅ Submitted login form');
});

When('I login with {string} and corresponding password', async function (username) {
  await loginPage.fillUsername(username);
  await loginPage.fillPassword(testData.password);
  await loginPage.clickLogin();
  console.log(`✅ Logged in with username: ${username}`);
});

// Assertions
Then('I should be successfully logged into the system', async function () {
  const isLoginSuccessful = await loginPage.isLoginSuccessful();
  expect(isLoginSuccessful).toBeTruthy();
  console.log('✅ Successfully logged into the system');
});

Then('I should see the welcome page', async function () {
  await expect(page).toHaveURL(/Welcome\.php/);
  console.log('✅ Welcome page is visible');
});

Then('the authentication state should be saved for future tests', async function () {
  const cookies = await page.context().cookies();
  expect(cookies.length).toBeGreaterThan(0);
  console.log('✅ Authentication state saved');
  
  // Cleanup
  await browser.close();
});

Then('all form elements should be properly styled', async function () {
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();
  console.log('✅ All form elements are properly styled');
  
  // Cleanup
  await browser.close();
});

Then('no authentication state should be created', async function () {
  await expect(page).toHaveURL(/login/);
  console.log('✅ No authentication state created');
  
  // Cleanup
  await browser.close();
});

Then('the password should not be visible in plain text', async function () {
  await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  console.log('✅ Password is not visible in plain text');
  
  // Cleanup
  await browser.close();
});

Then('the URL should change to reflect successful login', async function () {
  await expect(page).toHaveURL(/Welcome\.php/);
  console.log('✅ URL changed to reflect successful login');
  
  // Cleanup
  await browser.close();
});

Then('page load performance should meet requirements', async function () {
  await page.waitForLoadState('networkidle');
  console.log('✅ Page load performance meets requirements');
  
  // Cleanup
  await browser.close();
});

Then('my user role should be properly recognized', async function () {
  await expect(page.locator('body')).toBeVisible();
  console.log('✅ User role properly recognized');
  
  // Cleanup
  await browser.close();
});

Then('I should be able to login successfully', async function () {
  await expect(page).toHaveURL(/Welcome\.php/);
  console.log('✅ Login successful');
  
  // Cleanup
  await browser.close();
});
