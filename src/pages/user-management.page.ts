import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * User Management Page Object
 * Handles all user-related operations in the ERP system
 */
export class UserManagementPage extends BasePage {
  // Navigation elements
  readonly coreDataMenu: Locator;
  readonly usersInfoLink: Locator;
  readonly addNewUserButton: Locator;

  // User listing page elements
  readonly usersTable: Locator;
  readonly filterNameInput: Locator;
  readonly filterEmailInput: Locator;
  readonly filterDepartmentDropdown: Locator;
  readonly filterStatusDropdown: Locator;
  readonly filterButton: Locator;
  readonly resetFiltersLink: Locator;

  // Create user form elements
  readonly createUserHeading: Locator;
  readonly statusActiveRadio: Locator;
  readonly statusInactiveRadio: Locator;
  
  // User details fields
  readonly fullNameInput: Locator;
  readonly companyInput: Locator;
  readonly telephoneInput: Locator;
  readonly departmentDropdown: Locator;
  readonly accessPermissionDropdown: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly sendingInstructionsEmailInput: Locator;
  readonly sendingInstructionsEmailCheckbox: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly teamButton: Locator;
  readonly allowSystemGeneratedHBLsYes: Locator;
  readonly allowSystemGeneratedHBLsNo: Locator;
  
  // Form actions
  readonly createButton: Locator;
  readonly goBackLink: Locator;

  constructor(page: Page) {
    super(page);
    
    // Navigation elements
    this.coreDataMenu = page.getByRole('link', { name: 'Core Data »' });
    this.usersInfoLink = page.getByRole('link', { name: 'Users Info' });
    this.addNewUserButton = page.getByRole('link', { name: ' Add New User' });

    // User listing page elements
    this.usersTable = page.locator('table');
    this.filterNameInput = page.locator('input[placeholder=""]').first();
    this.filterEmailInput = page.locator('input[placeholder=""]').nth(1);
    this.filterDepartmentDropdown = page.locator('text=All').first();
    this.filterStatusDropdown = page.locator('text=Select an Option');
    this.filterButton = page.getByRole('button', { name: ' Filter' });
    this.resetFiltersLink = page.getByRole('link', { name: ' Reset Search Filters' });

    // Create user form elements
    this.createUserHeading = page.getByRole('heading', { name: 'Create User' });
    this.statusActiveRadio = page.locator('input[type="radio"][name="user-status"][value="1"]');
    this.statusInactiveRadio = page.locator('input[type="radio"][name="user-status"][value="0"]');
    
    // User details fields
    this.fullNameInput = page.getByRole('textbox', { name: 'Full Name' });
    this.companyInput = page.getByRole('textbox', { name: 'Company' });
    this.telephoneInput = page.getByRole('textbox', { name: 'Telephone' });
    this.departmentDropdown = page.locator('a').filter({ hasText: 'Select Department' });
    this.accessPermissionDropdown = page.locator('a').filter({ hasText: 'Full Access' });
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.emailInput = page.getByRole('textbox', { name: 'Email *' });
    this.sendingInstructionsEmailInput = page.getByRole('textbox', { name: 'Sending Instructions Email' });
    this.sendingInstructionsEmailCheckbox = page.locator('input[type="checkbox"][name="defaultuser[0]"]'); // Mandatory checkbox for sending instructions email
    this.passwordInput = page.locator('#user-password');
    this.confirmPasswordInput = page.locator('#user-cpassword');
    this.teamButton = page.getByRole('button', { name: 'None selected' });
    this.allowSystemGeneratedHBLsYes = page.getByRole('radio', { name: 'Yes' });
    this.allowSystemGeneratedHBLsNo = page.getByRole('radio', { name: 'No' });
    
    // Form actions
    this.createButton = page.getByRole('button', { name: ' Create' });
    this.goBackLink = page.getByRole('link', { name: ' Go Back' });
  }

  /**
   * Navigate to Users Info page via Core Data menu
   */
  async navigateToUsersInfo(): Promise<void> {
    this.logger.step('Navigate to Users Info via Core Data menu');
    
    // Click Core Data menu to expand it
    await this.clickElement(this.coreDataMenu);
    await this.page.waitForTimeout(1000); // Wait for menu expansion
    
    // Click Users Info link
    await this.clickElement(this.usersInfoLink);
    await this.waitForPageLoad();
    
    this.logger.step('Successfully navigated to Users Info page');
  }

  /**
   * Click Add New User button to open create form
   */
  async clickAddNewUser(): Promise<void> {
    this.logger.step('Click Add New User button');
    await this.clickElement(this.addNewUserButton);
    await this.waitForPageLoad();
    
    // Verify we're on the create user page
    await this.verifyElementVisible(this.createUserHeading);
    this.logger.step('Successfully opened Create User form');
  }

  /**
   * Fill user details in the create form
   */
  async fillUserDetails(userData: {
    fullName: string;
    company?: string;
    telephone?: string;
    department?: string;
    accessPermission?: string;
    username: string;
    email: string;
    sendingInstructionsEmail?: string;
    password: string;
    confirmPassword: string;
    status?: 'Active' | 'Inactive';
    allowSystemGeneratedHBLs?: 'Yes' | 'No';
  }): Promise<void> {
    this.logger.step(`Fill user details for: ${userData.fullName}`);

    // Set status (default to Active)
    if (userData.status === 'Inactive') {
      await this.clickElement(this.statusInactiveRadio);
    } else {
      await this.clickElement(this.statusActiveRadio);
    }

    // Fill required fields
    await this.fillText(this.fullNameInput, userData.fullName);
    
    // Ensure username is not too long (max 15 characters to avoid truncation)
    const shortUsername = userData.username.length > 15 
      ? userData.username.substring(0, 15) 
      : userData.username;
    await this.fillText(this.usernameInput, shortUsername);
    
    await this.fillText(this.emailInput, userData.email);
    await this.fillText(this.passwordInput, userData.password);
    await this.fillText(this.confirmPasswordInput, userData.confirmPassword);

    // Fill optional fields
    if (userData.company) {
      await this.fillText(this.companyInput, userData.company);
    }

    if (userData.telephone) {
      await this.fillText(this.telephoneInput, userData.telephone);
    }

    if (userData.sendingInstructionsEmail) {
      // Always check the mandatory checkbox for sending instructions email
      try {
        // Ensure the checkbox is checked (it's mandatory)
        await this.sendingInstructionsEmailCheckbox.check({ force: true });
        await this.page.waitForTimeout(500); // Wait for field to become enabled
        await this.fillText(this.sendingInstructionsEmailInput, userData.sendingInstructionsEmail);
        this.logger.info('Successfully checked mandatory sending instructions checkbox and filled email');
      } catch (error) {
        this.logger.info(`Checkbox interaction failed: ${error}`);
        // Try alternative approach - ensure checkbox is checked
        try {
          await this.page.locator('input[type="checkbox"][name="defaultuser[0]"]').setChecked(true);
          await this.fillText(this.sendingInstructionsEmailInput, userData.sendingInstructionsEmail);
        } catch (secondError) {
          this.logger.info(`Alternative checkbox approach failed: ${secondError}`);
        }
      }
    } else {
      // Even if no email provided, ensure the mandatory checkbox is checked
      try {
        await this.sendingInstructionsEmailCheckbox.check({ force: true });
        this.logger.info('Checked mandatory sending instructions checkbox (no email provided)');
      } catch (error) {
        this.logger.info(`Failed to check mandatory checkbox: ${error}`);
      }
    }

    // Handle dropdown selections
    if (userData.department) {
      try {
        await this.selectDepartment(userData.department);
      } catch (error) {
        this.logger.info(`Department selection failed, continuing: ${error}`);
      }
    }

    // Set system-generated HBLs preference (default to No)
    try {
      if (userData.allowSystemGeneratedHBLs === 'Yes') {
        await this.clickElement(this.allowSystemGeneratedHBLsYes);
      } else {
        await this.clickElement(this.allowSystemGeneratedHBLsNo);
      }
    } catch (error) {
      this.logger.info(`HBL preference selection failed, continuing: ${error}`);
    }

    this.logger.step('User details filled successfully');
  }

  /**
   * Select department from dropdown
   */
  async selectDepartment(department: string): Promise<void> {
    this.logger.step(`Select department: ${department}`);
    
    // Click on the department dropdown button to open it
    await this.departmentDropdown.click();
    
    // Wait for the dropdown to open and select the department
    await this.page.locator('#department_chosen').getByText(department, { exact: true }).click();
    
    this.logger.step(`Department selected: ${department}`);
  }

  /**
   * Select access permission from dropdown
   */
  async selectAccessPermission(permission: string): Promise<void> {
    this.logger.step(`Select access permission: ${permission}`);
    
    // Click on the access permission dropdown button to open it
    await this.accessPermissionDropdown.click();
    
    // Wait for the dropdown to open and select the permission
    await this.page.locator('#user-access_chosen').getByText(permission, { exact: true }).click();
    
    this.logger.step(`Access permission selected: ${permission}`);
  }

  /**
   * Submit the create user form and wait for completion
   */
  async submitCreateUserForm(): Promise<void> {
    this.logger.step('Submit create user form');
    
    // Click the Create button
    await this.clickElement(this.createButton);
    
    // Wait for form submission to complete - either success redirect or error message
    try {
      // Wait for redirect to users index page (success case)
      await this.page.waitForURL(/user\/index/, { timeout: 15000 });
      this.logger.step('User created successfully - redirected to users list');
    } catch (redirectError) {
      // If no redirect, check for error messages on the form
      this.logger.info('No redirect detected, checking for form errors...');
      
      // Wait a bit for any error messages to appear
      await this.page.waitForTimeout(2000);
      
      // Check if we're still on the create page (form has validation errors)
      const currentUrl = this.page.url();
      if (currentUrl.includes('/user/create')) {
        // Look for error messages or validation issues
        const errorElements = await this.page.locator('.alert-danger, .error, .field-error, .has-error').count();
        if (errorElements > 0) {
          const errorTexts = await this.page.locator('.alert-danger, .error, .field-error, .has-error').allTextContents();
          throw new Error(`Form submission failed with validation errors: ${errorTexts.join(', ')}`);
        } else {
          throw new Error('Form submission failed - still on create page but no visible errors detected');
        }
      } else {
        // If we're on a different page, log where we ended up
        this.logger.info(`Form submitted but ended up on unexpected page: ${currentUrl}`);
      }
    }
  }

  /**
   * Cancel user creation and go back
   */
  async cancelUserCreation(): Promise<void> {
    this.logger.step('Cancel user creation');
    await this.clickElement(this.goBackLink);
    await this.waitForPageLoad();
    this.logger.step('Returned to users listing page');
  }

  /**
   * Verify user was created successfully
   */
  async verifyUserCreated(username: string): Promise<boolean> {
    this.logger.step(`Verify user created: ${username}`);
    
    // Check if we're redirected to users listing page
    const currentUrl = this.page.url();
    const isOnUsersPage = currentUrl.includes('/user/index');
    
    if (isOnUsersPage) {
      // Search for the created user in the table
      const userRow = this.page.locator(`tr:has-text("${username}")`);
      const isUserVisible = await userRow.isVisible();
      
      if (isUserVisible) {
        this.logger.step(`User ${username} successfully created and visible in listing`);
        return true;
      }
    }
    
    this.logger.step(`User ${username} creation verification failed`);
    return false;
  }

  /**
   * Filter users by name
   */
  async filterUsersByName(name: string): Promise<void> {
    this.logger.step(`Filter users by name: ${name}`);
    await this.fillText(this.filterNameInput, name);
    await this.clickElement(this.filterButton);
    await this.waitForPageLoad();
    this.logger.step('Users filtered by name');
  }

  /**
   * Filter users by email
   */
  async filterUsersByEmail(email: string): Promise<void> {
    this.logger.step(`Filter users by email: ${email}`);
    await this.fillText(this.filterEmailInput, email);
    await this.clickElement(this.filterButton);
    await this.waitForPageLoad();
    this.logger.step('Users filtered by email');
  }

  /**
   * Reset all search filters
   */
  async resetFilters(): Promise<void> {
    this.logger.step('Reset search filters');
    await this.clickElement(this.resetFiltersLink);
    await this.waitForPageLoad();
    this.logger.step('Search filters reset');
  }

  /**
   * Get all available departments
   */
  async getAvailableDepartments(): Promise<string[]> {
    this.logger.step('Get available departments');
    
    await this.clickElement(this.departmentDropdown);
    await this.page.waitForTimeout(500);
    
    const departments = await this.page.locator('li[role="option"]').allTextContents();
    
    // Close dropdown
    await this.page.keyboard.press('Escape');
    
    return departments.filter(dept => dept !== 'Select Department');
  }

  /**
   * Verify required field validation
   */
  async verifyRequiredFieldValidation(): Promise<boolean> {
    this.logger.step('Verify required field validation');
    
    // Try to submit form without filling required fields
    await this.clickElement(this.createButton);
    
    // Check for validation messages or if form submission was prevented
    const isStillOnCreatePage = await this.createUserHeading.isVisible();
    
    this.logger.step(`Required field validation working: ${isStillOnCreatePage}`);
    return isStillOnCreatePage;
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }
}
