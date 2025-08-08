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
    this.sendingInstructionsEmailCheckbox = page.locator('input[type="checkbox"]').nth(0); // Checkbox next to sending instructions email field
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
    await this.fillText(this.usernameInput, userData.username);
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
      // Check the checkbox first to enable the field
      await this.clickElement(this.sendingInstructionsEmailCheckbox);
      await this.fillText(this.sendingInstructionsEmailInput, userData.sendingInstructionsEmail);
    }

    // Handle dropdown selections
    if (userData.department) {
      await this.selectDepartment(userData.department);
    }

    // Skip access permission selection since it defaults to "Full Access"
    // The selectAccessPermission method can be called separately if needed

    // Set system-generated HBLs preference (default to No)
    if (userData.allowSystemGeneratedHBLs === 'Yes') {
      await this.clickElement(this.allowSystemGeneratedHBLsYes);
    } else {
      await this.clickElement(this.allowSystemGeneratedHBLsNo);
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
   * Submit the create user form
   */
  async submitCreateUserForm(): Promise<void> {
    this.logger.step('Submit create user form');
    await this.clickElement(this.createButton);
    await this.waitForPageLoad();
    this.logger.step('Create user form submitted');
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
