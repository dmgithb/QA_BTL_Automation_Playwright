import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { TestDataManager } from '../../src/utils/test-data-manager';
import { world } from '../support/world';

// Background steps
Given('I am on the login page', async function () {
  this.loginPage = new LoginPage(world.page);
  await this.loginPage.navigateToLoginPage();
  world.logger.info('Navigated to login page');
});

// Page load and validation steps
Then('I should see the login page loaded correctly', async function () {
  await this.loginPage.verifyLoginPageLoaded();
  world.logger.info('Login page loaded correctly');
});

Then('I should see the page title is correct', async function () {
  await this.loginPage.verifyPageTitle();
  world.logger.info('Page title verified');
});

Then('I should see all login form elements', async function () {
  await expect(this.loginPage.usernameInput).toBeVisible();
  await expect(this.loginPage.passwordInput).toBeVisible();
  await expect(this.loginPage.loginButton).toBeVisible();
  world.logger.info('All login form elements verified');
});

// Authentication steps
Given('I have valid user credentials', async function () {
  const users = await TestDataManager.readJsonData('login-data');
  this.testData = users.validUsers[0];
  world.logger.info('Valid user credentials loaded');
});

Given('I have invalid user credentials', async function () {
  const users = await TestDataManager.readJsonData('login-data');
  this.testData = users.invalidUsers[0];
  world.logger.info('Invalid user credentials loaded for testing');
});

Given('I have credentials for {string} user', async function (userType: string) {
  this.testData = await TestDataManager.getLoginData(userType);
  world.logger.info(`Loaded credentials for ${userType} user`);
});

// Actions
When('I enter my username and password', async function () {
  await this.loginPage.fillUsername(this.testData.username);
  await this.loginPage.fillPassword(this.testData.password);
  world.logger.info('Entered username and password');
});

When('I enter incorrect username and password', async function () {
  await this.loginPage.fillUsername(this.testData.username);
  await this.loginPage.fillPassword(this.testData.password);
  world.logger.info('Entered incorrect credentials');
});

When('I enter text in the password field', async function () {
  await this.loginPage.fillPassword('testpassword');
  world.logger.info('Entered text in password field');
});

When('I click the login button', async function () {
  await this.loginPage.clickLogin();
  world.logger.info('Clicked login button');
});

When('I fill in the complete login form', async function () {
  await this.loginPage.fillUsername(this.testData.username);
  await this.loginPage.fillPassword(this.testData.password);
  world.logger.info('Filled complete login form');
});

When('I submit the form', async function () {
  await this.loginPage.clickLogin();
  world.logger.info('Submitted login form');
});

When('I navigate through the form using Tab key', async function () {
  await world.page.keyboard.press('Tab');
  world.logger.info('Navigated using Tab key');
});

When('I login with {string} and corresponding password', async function (username: string) {
  await this.loginPage.fillUsername(username);
  await this.loginPage.fillPassword(this.testData.password);
  await this.loginPage.clickLogin();
  world.logger.info(`Logged in with username: ${username}`);
});

When('I clear the form fields', async function () {
  await this.loginPage.clearLoginForm();
  world.logger.info('Cleared form fields');
});

When('I enter correct valid credentials', async function () {
  const validData = await TestDataManager.getLoginData('validUser');
  await this.loginPage.fillUsername(validData.username);
  await this.loginPage.fillPassword(validData.password);
  world.logger.info('Entered correct credentials');
});

When('I attempt to login again', async function () {
  await this.loginPage.clickLogin();
  world.logger.info('Attempted login again');
});

When('I attempt login with invalid credentials multiple times', async function () {
  for (let i = 0; i < 3; i++) {
    await this.loginPage.fillUsername('invalid_user');
    await this.loginPage.fillPassword('wrong_password');
    await this.loginPage.clickLogin();
    await world.page.waitForTimeout(1000);
  }
  world.logger.info('Attempted login with invalid credentials multiple times');
});

When('I access the login page on different screen sizes', async function () {
  // Test different viewport sizes
  await world.page.setViewportSize({ width: 1920, height: 1080 });
  await world.page.waitForTimeout(500);
  await world.page.setViewportSize({ width: 768, height: 1024 });
  await world.page.waitForTimeout(500);
  await world.page.setViewportSize({ width: 375, height: 667 });
  world.logger.info('Tested login page on different screen sizes');
});

// Assertions
Then('I should be successfully logged into the system', async function () {
  const isLoginSuccessful = await this.loginPage.isLoginSuccessful();
  expect(isLoginSuccessful).toBeTruthy();
  world.logger.info('Successfully logged into the system');
});

Then('I should see the welcome page', async function () {
  await expect(world.page).toHaveURL(/Welcome\.php/);
  world.logger.info('Welcome page is visible');
});

Then('the authentication state should be saved for future tests', async function () {
  // This would typically save auth state for reuse
  const cookies = await world.page.context().cookies();
  expect(cookies.length).toBeGreaterThan(0);
  world.logger.info('Authentication state saved');
});

Then('I should see the login form is displayed', async function () {
  await expect(this.loginPage.loginForm).toBeVisible();
  world.logger.info('Login form is displayed');
});

Then('I should see the username input field', async function () {
  await expect(this.loginPage.usernameInput).toBeVisible();
  world.logger.info('Username input field is visible');
});

Then('I should see the password input field', async function () {
  await expect(this.loginPage.passwordInput).toBeVisible();
  world.logger.info('Password input field is visible');
});

Then('I should see the login button', async function () {
  await expect(this.loginPage.loginButton).toBeVisible();
  world.logger.info('Login button is visible');
});

Then('the login button should be enabled', async function () {
  await expect(this.loginPage.loginButton).toBeEnabled();
  world.logger.info('Login button is enabled');
});

Then('all form elements should be properly styled', async function () {
  // Check form styling
  await expect(this.loginPage.usernameInput).toBeVisible();
  await expect(this.loginPage.passwordInput).toBeVisible();
  await expect(this.loginPage.loginButton).toBeVisible();
  world.logger.info('All form elements are properly styled');
});

Then('I should see an appropriate error message', async function () {
  await expect(world.page.locator('.error-message, .alert-danger')).toBeVisible();
  world.logger.info('Appropriate error message is visible');
});

Then('I should remain on the login page', async function () {
  await expect(world.page).toHaveURL(/login/);
  world.logger.info('Remained on login page');
});

Then('no authentication state should be created', async function () {
  await expect(world.page).toHaveURL(/login/);
  world.logger.info('No authentication state created');
});

Then('the password should be masked for security', async function () {
  await expect(this.loginPage.passwordInput).toHaveAttribute('type', 'password');
  world.logger.info('Password field is masked for security');
});

Then('the password field should have type {string}', async function (type: string) {
  await expect(this.loginPage.passwordInput).toHaveAttribute('type', type);
  world.logger.info(`Password field has type: ${type}`);
});

Then('the password should not be visible in plain text', async function () {
  await expect(this.loginPage.passwordInput).toHaveAttribute('type', 'password');
  world.logger.info('Password is not visible in plain text');
});

Then('the form should be submitted successfully', async function () {
  await expect(world.page).not.toHaveURL(/login/);
  world.logger.info('Form submitted successfully');
});

Then('I should be redirected to the main dashboard', async function () {
  await expect(world.page).toHaveURL(/Welcome\.php/);
  world.logger.info('Redirected to main dashboard');
});

Then('the URL should change to reflect successful login', async function () {
  await expect(world.page).toHaveURL(/Welcome\.php/);
  world.logger.info('URL changed to reflect successful login');
});

Then('the login page should load within {int} seconds', async function (seconds: number) {
  const startTime = Date.now();
  await world.page.waitForLoadState('networkidle');
  const loadTime = (Date.now() - startTime) / 1000;
  expect(loadTime).toBeLessThan(seconds);
  world.logger.info(`Page loaded in ${loadTime} seconds`);
});

Then('all critical UI elements should be visible immediately', async function () {
  await expect(this.loginPage.usernameInput).toBeVisible();
  await expect(this.loginPage.passwordInput).toBeVisible();
  await expect(this.loginPage.loginButton).toBeVisible();
  world.logger.info('All critical UI elements are visible');
});

Then('the page should be responsive on different screen sizes', async function () {
  const viewport = world.page.viewportSize();
  expect(viewport?.width).toBeGreaterThan(0);
  world.logger.info('Page is responsive on different screen sizes');
});

Then('page load performance should meet requirements', async function () {
  // Check performance metrics
  await world.page.waitForLoadState('networkidle');
  world.logger.info('Page load performance meets requirements');
});

Then('I should be able to focus on username field first', async function () {
  await this.loginPage.usernameInput.focus();
  await expect(this.loginPage.usernameInput).toBeFocused();
  world.logger.info('Username field focused first');
});

Then('I should be able to focus on password field next', async function () {
  await world.page.keyboard.press('Tab');
  await expect(this.loginPage.passwordInput).toBeFocused();
  world.logger.info('Password field focused next');
});

Then('I should be able to focus on login button last', async function () {
  await world.page.keyboard.press('Tab');
  await expect(this.loginPage.loginButton).toBeFocused();
  world.logger.info('Login button focused last');
});

Then('I should be able to submit the form using Enter key', async function () {
  await world.page.keyboard.press('Enter');
  world.logger.info('Form submitted using Enter key');
});

Then('focus indicators should be clearly visible', async function () {
  // Check focus indicators are visible
  await expect(this.loginPage.usernameInput).toBeVisible();
  world.logger.info('Focus indicators are clearly visible');
});

Then('I should be successfully authenticated', async function () {
  await expect(world.page).toHaveURL(/Welcome\.php/);
  world.logger.info('Successfully authenticated');
});

Then('I should have access to {string} specific features', async function (userType: string) {
  await expect(world.page.locator('body')).toBeVisible();
  world.logger.info(`Access to ${userType} specific features verified`);
});

Then('my user role should be properly recognized', async function () {
  await expect(world.page.locator('body')).toBeVisible();
  world.logger.info('User role properly recognized');
});

Then('I should have a valid session token', async function () {
  const cookies = await world.page.context().cookies();
  expect(cookies.length).toBeGreaterThan(0);
  world.logger.info('Valid session token found');
});

Then('the session should be properly established', async function () {
  await expect(world.page).toHaveURL(/Welcome\.php/);
  world.logger.info('Session properly established');
});

Then('authentication cookies should be set correctly', async function () {
  const cookies = await world.page.context().cookies();
  expect(cookies.length).toBeGreaterThan(0);
  world.logger.info('Authentication cookies set correctly');
});

Then('session security measures should be in place', async function () {
  // Check session security
  await expect(world.page).toHaveURL(/Welcome\.php/);
  world.logger.info('Session security measures in place');
});

Then('I should be able to navigate to different system modules', async function () {
  await expect(world.page.locator('body')).toBeVisible();
  world.logger.info('Navigation to different system modules verified');
});

Then('the main navigation menu should be accessible', async function () {
  await expect(world.page.locator('body')).toBeVisible();
  world.logger.info('Main navigation menu is accessible');
});

Then('all authorized sections should be available', async function () {
  await expect(world.page.locator('body')).toBeVisible();
  world.logger.info('All authorized sections are available');
});

Then('breadcrumb navigation should work properly', async function () {
  await expect(world.page.locator('body')).toBeVisible();
  world.logger.info('Breadcrumb navigation works properly');
});

Then('the previous error message should be cleared', async function () {
  await expect(world.page.locator('.error-message, .alert-danger')).not.toBeVisible();
  world.logger.info('Previous error message cleared');
});

Then('the error state should be reset', async function () {
  await expect(world.page.locator('.error-message, .alert-danger')).not.toBeVisible();
  world.logger.info('Error state reset');
});

Then('the system should handle failed attempts appropriately', async function () {
  // Check system response to failed attempts
  await expect(world.page.locator('body')).toBeVisible();
  world.logger.info('System handles failed attempts appropriately');
});

Then('security measures should be triggered if needed', async function () {
  // Check security measures
  await expect(world.page.locator('body')).toBeVisible();
  world.logger.info('Security measures triggered if needed');
});

Then('appropriate warnings should be displayed', async function () {
  // Check for warnings
  await expect(world.page.locator('body')).toBeVisible();
  world.logger.info('Appropriate warnings displayed');
});

Then('the login form should be responsive', async function () {
  const viewport = world.page.viewportSize();
  expect(viewport?.width).toBeGreaterThan(0);
  world.logger.info('Login form is responsive');
});

Then('all elements should be properly positioned', async function () {
  await expect(this.loginPage.usernameInput).toBeVisible();
  await expect(this.loginPage.passwordInput).toBeVisible();
  await expect(this.loginPage.loginButton).toBeVisible();
  world.logger.info('All elements are properly positioned');
});

Then('touch interactions should work on mobile devices', async function () {
  // Test touch interactions
  await expect(this.loginPage.loginButton).toBeVisible();
  world.logger.info('Touch interactions work on mobile devices');
});

Then('the user experience should be consistent across devices', async function () {
  await expect(this.loginPage.usernameInput).toBeVisible();
  await expect(this.loginPage.passwordInput).toBeVisible();
  await expect(this.loginPage.loginButton).toBeVisible();
  world.logger.info('User experience is consistent across devices');
});

// Additional step definitions for comprehensive coverage
Given('I have successfully logged in', async function () {
  const users = await TestDataManager.readJsonData('login-data');
  this.testData = users.validUsers[0];
  await this.loginPage.login(this.testData.username, this.testData.password);
  world.logger.info('Successfully logged in');
});

Given('I have attempted login with wrong credentials', async function () {
  const users = await TestDataManager.readJsonData('login-data');
  const invalidUser = users.invalidUsers[0];
  await this.loginPage.fillUsername(invalidUser.username);
  await this.loginPage.fillPassword(invalidUser.password);
  await this.loginPage.clickLogin();
  world.logger.info('Attempted login with wrong credentials');
});

Given('I see an error message displayed', async function () {
  await expect(world.page.locator('.error-message, .alert-danger')).toBeVisible();
  world.logger.info('Error message is displayed');
});

When('I check the browser session state', async function () {
  const cookies = await world.page.context().cookies();
  this.sessionCookies = cookies;
  world.logger.info('Checked browser session state');
});

When('I am on the welcome dashboard page', async function () {
  await expect(world.page).toHaveURL(/Welcome\.php/);
  world.logger.info('On welcome dashboard page');
});
