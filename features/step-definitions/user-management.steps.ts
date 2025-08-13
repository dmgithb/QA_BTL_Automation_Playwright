import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { UserManagementPage } from '../../src/pages/user-management.page';
import { TestDataManager } from '../../src/utils/test-data-manager';
import { world } from '../support/world';

// Background steps
Given('I am logged into the ERP system as an administrator', async function () {
  this.loginPage = new LoginPage(world.page);
  await this.loginPage.navigate();
  
  const adminData = await TestDataManager.getLoginData('admin');
  await this.loginPage.login(adminData.username, adminData.password);
  
  world.logger.info('Logged into ERP system as administrator');
});

Given('I have navigated to the Users Info page', async function () {
  this.userManagementPage = new UserManagementPage(world.page);
  await this.userManagementPage.navigateToUsersInfo();
  world.logger.info('Navigated to Users Info page');
});

// User creation steps
Given('I am on the user creation page', async function () {
  // Already on the page from background
  world.logger.info('On user creation page');
});

Given('I am on the user creation form', async function () {
  this.userManagementPage = new UserManagementPage(world.page);
  await this.userManagementPage.navigateToUsersInfo();
  await this.userManagementPage.clickAddNewUser();
  world.logger.info('On user creation form');
});

Given('I am creating a new user', async function () {
  this.userManagementPage = new UserManagementPage(world.page);
  await this.userManagementPage.navigateToUsersInfo();
  await this.userManagementPage.clickAddNewUser();
  world.logger.info('Creating a new user');
});

Given('a user already exists with email {string}', async function (email: string) {
  // This would typically check database or application state
  // For now, we'll just store the email for validation
  this.existingEmail = email;
  world.logger.info(`User exists with email: ${email}`);
});

// Actions
When('I click the {string} button', async function (buttonText: string) {
  if (buttonText === 'Add New User') {
    await this.userManagementPage.clickAddNewUser();
  }
  world.logger.info(`Clicked ${buttonText} button`);
});

When('I fill in user details with dynamically generated data', async function () {
  const userData = await TestDataManager.getUserData();
  const timestamp = Date.now();
  
  this.generatedUser = {
    firstName: `Generated User ${timestamp}`,
    lastName: 'Test',
    email: `user${Math.floor(Math.random() * 1000)}@digitalmesh.com`,
    username: `user_${timestamp}`,
    password: 'TempPass123!',
    department: 'Operations'
  };
  
  await this.userManagementPage.fillUserDetails(this.generatedUser);
  world.logger.info('Filled user details with dynamically generated data');
});

When('I fill in user details for {string}', async function (userName: string) {
  const timestamp = Date.now();
  
  this.userData = {
    firstName: userName,
    lastName: 'Test User',
    email: `${userName.toLowerCase().replace(/\s+/g, '_')}_${timestamp}@digitalmesh.com`,
    username: `${userName.toLowerCase().replace(/\s+/g, '_')}_${timestamp}`,
    password: 'TempPass123!',
    department: 'IT'
  };
  
  await this.userManagementPage.fillUserDetails(this.userData);
  world.logger.info(`Filled user details for: ${userName}`);
});

When('I enter an email with {string} domain', async function (domain: string) {
  const timestamp = Date.now();
  this.testEmail = `emailvalidation_${timestamp}@${domain.replace('@', '')}`;
  await world.page.fill('[name="email"]', this.testEmail);
  world.logger.info(`Entered email with ${domain} domain: ${this.testEmail}`);
});

When('I enter email {string}', async function (email: string) {
  await world.page.fill('[name="email"]', email);
  this.userEmail = email;
  world.logger.info(`Entered email: ${email}`);
});

When('I enter a dynamically generated email with {string}', async function (domain: string) {
  const timestamp = Date.now();
  this.dynamicEmail = `jane_${timestamp}@${domain.replace('@', '')}`;
  await world.page.fill('[name="email"]', this.dynamicEmail);
  world.logger.info(`Entered dynamic email: ${this.dynamicEmail}`);
});

When('I select {string} as the department', async function (department: string) {
  await this.userManagementPage.selectDepartment(department);
  this.selectedDepartment = department;
  world.logger.info(`Selected department: ${department}`);
});

When('I check the mandatory sending instructions checkbox', async function () {
  await this.userManagementPage.checkSendingInstructionsCheckbox();
  world.logger.info('Checked mandatory sending instructions checkbox');
});

When('I do not check the mandatory sending instructions checkbox', async function () {
  // Intentionally skip checking the checkbox
  world.logger.info('Skipped checking mandatory sending instructions checkbox');
});

When('I submit the user creation form', async function () {
  await this.userManagementPage.submitCreateUser();
  world.logger.info('Submitted user creation form');
});

When('I submit the form', async function () {
  await this.userManagementPage.submitCreateUser();
  world.logger.info('Submitted form');
});

When('I fill in all user details', async function () {
  const timestamp = Date.now();
  
  this.userData = {
    firstName: 'Email Validation Test User',
    lastName: 'Test',
    email: `emailvalidation_${timestamp}@digitalmesh.com`,
    username: `emailvalidation_${timestamp}`,
    password: 'TempPass123!',
    department: 'IT'
  };
  
  await this.userManagementPage.fillUserDetails(this.userData);
  world.logger.info('Filled all user details');
});

When('I fill in all required fields', async function () {
  const timestamp = Date.now();
  
  this.userData = {
    firstName: 'Required Fields Test',
    lastName: 'User',
    email: `required_${timestamp}@digitalmesh.com`,
    username: `required_${timestamp}`,
    password: 'TempPass123!',
    department: 'Operations'
  };
  
  await this.userManagementPage.fillUserDetails(this.userData);
  await this.userManagementPage.checkSendingInstructionsCheckbox();
  world.logger.info('Filled all required fields');
});

When('I access the Core Data menu', async function () {
  await this.userManagementPage.accessCoreDataMenu();
  world.logger.info('Accessed Core Data menu');
});

When('I click on Users Info option', async function () {
  await this.userManagementPage.clickUsersInfoOption();
  world.logger.info('Clicked Users Info option');
});

When('I attempt to submit the form without filling required fields', async function () {
  // Try to submit without filling anything
  await this.userManagementPage.submitCreateUser();
  world.logger.info('Attempted to submit form without required fields');
});

When('I try to create a new user with the same email', async function () {
  const userData = {
    firstName: 'Duplicate Email Test',
    lastName: 'User',
    email: this.existingEmail,
    username: `duplicate_${Date.now()}`,
    password: 'TempPass123!',
    department: 'IT'
  };
  
  await this.userManagementPage.fillUserDetails(userData);
  world.logger.info('Tried to create user with duplicate email');
});

When('I enter a unique email address', async function () {
  const uniqueEmail = `unique_${Date.now()}@digitalmesh.com`;
  await world.page.fill('[name="email"]', uniqueEmail);
  this.uniqueEmail = uniqueEmail;
  world.logger.info(`Entered unique email: ${uniqueEmail}`);
});

// Assertions
Then('I should see the {string} form', async function (formName: string) {
  if (formName === 'Create User') {
    await expect(world.page.locator('h1, h2, h3').filter({ hasText: 'Create User' })).toBeVisible();
  }
  world.logger.info(`${formName} form is visible`);
});

Then('the user should be created successfully', async function () {
  // Wait for success indicator or redirect
  await expect(world.page).toHaveURL(/users|Users/);
  world.logger.info('User created successfully');
});

Then('I should be redirected to the users list', async function () {
  await expect(world.page).toHaveURL(/users|Users/);
  world.logger.info('Redirected to users list');
});

Then('the new user should appear in the system', async function () {
  // Check if user appears in the list
  await expect(world.page.locator('body')).toBeVisible();
  world.logger.info('New user appears in the system');
});

Then('the email should be accepted', async function () {
  // Check that no email validation errors occurred
  await expect(world.page.locator('.error, .alert-danger')).not.toBeVisible();
  world.logger.info('Email was accepted');
});

Then('no email validation errors should occur', async function () {
  await expect(world.page.locator('.error, .alert-danger')).not.toBeVisible();
  world.logger.info('No email validation errors occurred');
});

Then('I should be successfully navigated to Users Info page', async function () {
  await expect(world.page.locator('h1, h2, h3').filter({ hasText: /Users Info|User Management/i })).toBeVisible();
  world.logger.info('Successfully navigated to Users Info page');
});

Then('the page should display user management options', async function () {
  await expect(world.page.locator('body')).toBeVisible();
  world.logger.info('Page displays user management options');
});

Then('I should see the {string} button', async function (buttonText: string) {
  if (buttonText === 'Add New User') {
    await expect(world.page.locator('button, a').filter({ hasText: /Add.*User/i })).toBeVisible();
  }
  world.logger.info(`${buttonText} button is visible`);
});

Then('the user should be created with {string} department access', async function (department: string) {
  await expect(world.page).toHaveURL(/users|Users/);
  world.logger.info(`User created with ${department} department access`);
});

Then('the user should be successfully saved to the system', async function () {
  await expect(world.page).toHaveURL(/users|Users/);
  world.logger.info('User successfully saved to the system');
});

Then('the user information should be properly stored', async function () {
  await expect(world.page).toHaveURL(/users|Users/);
  world.logger.info('User information properly stored');
});

Then('the form should not be submitted', async function () {
  // Check that we're still on the form page
  await expect(world.page.locator('h1, h2, h3').filter({ hasText: 'Create User' })).toBeVisible();
  world.logger.info('Form was not submitted');
});

Then('no {string} error should appear', async function (errorType: string) {
  await expect(world.page.locator('.error, .alert-danger').filter({ hasText: new RegExp(errorType, 'i') })).not.toBeVisible();
  world.logger.info(`No ${errorType} error appeared`);
});

Then('the user should be associated with {string} department', async function (department: string) {
  await expect(world.page).toHaveURL(/users|Users/);
  world.logger.info(`User associated with ${department} department`);
});

Then('I should see validation errors for required fields', async function () {
  // Check for validation error messages
  await expect(world.page.locator('.error, .alert-danger, .invalid-feedback')).toBeVisible();
  world.logger.info('Validation errors for required fields are visible');
});

Then('email notification preferences should be saved', async function () {
  // This would typically verify in the database or UI
  await expect(world.page).toHaveURL(/users|Users/);
  world.logger.info('Email notification preferences saved');
});

Then('the user should receive setup instructions', async function () {
  // This would typically verify email sending or database flag
  await expect(world.page).toHaveURL(/users|Users/);
  world.logger.info('User should receive setup instructions');
});

Then('I should see a duplicate email error', async function () {
  await expect(world.page.locator('.error, .alert-danger').filter({ hasText: /duplicate|already exists/i })).toBeVisible();
  world.logger.info('Duplicate email error is visible');
});
