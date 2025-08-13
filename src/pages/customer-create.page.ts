import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { ConfigManager } from '../utils/config-manager';

/**
 * Customer Create page object for the application
 * Handles customer creation form and validation
 */
export class CustomerCreatePage extends BasePage {
  // Page URL
  readonly url = `${ConfigManager.BASE_URL}/customer/customer-create`;

  // Form heading
  readonly pageHeading: Locator;
  readonly createCustomerForm: Locator;

  // Customer Details Section - Required Fields
  readonly customerCodeInput: Locator;
  readonly teamDropdown: Locator;
  readonly customerNameInput: Locator;
  readonly address1Input: Locator;
  readonly townInput: Locator;
  readonly postCodeInput: Locator;
  readonly countryDropdown: Locator;
  readonly contactInput: Locator;
  readonly telephoneInput: Locator;
  readonly vatNoInput: Locator;
  readonly emailInput: Locator;
  readonly eoriNumberInput: Locator;
  readonly paymentTermsInput: Locator;
  readonly rechargeHandledByCCTDropdown: Locator;
  readonly billingOfficeDropdown: Locator;
  readonly effectiveFromDateInput: Locator;
  readonly sageCodeInput: Locator;
  readonly bankAccountDropdown: Locator;
  readonly accountManagerDropdown: Locator;
  readonly customerGroupDropdown: Locator;

  // Customer Details Section - Optional Fields
  readonly address2Input: Locator;
  readonly stateInput: Locator;
  readonly vatRateInput: Locator;
  readonly invoiceDateDropdown: Locator;

  // Customer Approve Radio Buttons
  readonly customerApproveYesRadio: Locator;
  readonly customerApproveNoRadio: Locator;

  // Invoice Contacts Section
  readonly invoiceEmailInput: Locator;
  readonly addInvoiceContactButton: Locator;
  readonly removeInvoiceContactButton: Locator;

  // Credit Invoice Contacts Section
  readonly creditInvoiceEmailInput: Locator;
  readonly addCreditInvoiceContactButton: Locator;
  readonly removeCreditInvoiceContactButton: Locator;

  // Form buttons
  readonly createButton: Locator;
  readonly goBackButton: Locator;

  // Validation and error messages
  readonly validationErrorAlert: Locator;
  readonly validationErrorCloseButton: Locator;

  // Document upload section
  readonly uploadDocumentsSection: Locator;
  readonly fileUploadInput: Locator;
  readonly fileDescriptionInput: Locator;
  readonly uploadButton: Locator;
  readonly uploadedDocumentsTable: Locator;

  constructor(page: Page) {
    super(page);

    // Page elements
    this.pageHeading = page.getByRole('heading', { name: 'Create Customer', level: 3 });
    this.createCustomerForm = page.locator('form').first();

    // Required Fields
    this.customerCodeInput = page.getByRole('textbox', { name: 'Customer Code' });
    this.teamDropdown = page.locator('text=Please select team').first();
    this.customerNameInput = page.getByRole('textbox', { name: 'Customer Name' });
    this.address1Input = page.getByRole('textbox', { name: 'Address 1' });
    this.townInput = page.getByRole('textbox', { name: 'Town' });
    this.postCodeInput = page.getByRole('textbox', { name: 'Post Code' });
    this.countryDropdown = page.locator('text=Please select country').first();
    this.contactInput = page.getByRole('textbox', { name: 'Contact' });
    this.telephoneInput = page.getByRole('textbox', { name: 'Telephone' });
    this.vatNoInput = page.getByRole('textbox', { name: 'VAT No' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.eoriNumberInput = page.getByRole('textbox', { name: 'EORI Number' });
    this.paymentTermsInput = page.getByRole('textbox', { name: 'Payment Terms' });
    this.rechargeHandledByCCTDropdown = page.locator('text="No"').first();
    this.billingOfficeDropdown = page.locator('text=Your Office').first();
    this.effectiveFromDateInput = page.getByRole('textbox', { name: 'dd/mm/yyyy' });
    this.sageCodeInput = page.getByRole('textbox', { name: 'Sage Code' });
    this.bankAccountDropdown = page.locator('text=Please select bank account').first();
    this.accountManagerDropdown = page.locator('text=Please select account manager').first();
    this.customerGroupDropdown = page.locator('text=Standard Customer').first();

    // Optional Fields
    this.address2Input = page.getByRole('textbox', { name: 'Address 2' });
    this.stateInput = page.getByRole('textbox', { name: 'State' });
    this.vatRateInput = page.getByRole('textbox', { name: 'VAT Rate' });
    this.invoiceDateDropdown = page.locator('text=First Activity Date').first();

    // Radio buttons
    this.customerApproveYesRadio = page.locator('input[type="radio"]').first();
    this.customerApproveNoRadio = page.locator('input[type="radio"]').nth(1);

    // Invoice contacts
    this.invoiceEmailInput = page.locator('group:has-text("Invoice Contacts") textbox').first();
    this.addInvoiceContactButton = page.locator('group:has-text("Invoice Contacts") button').first();
    this.removeInvoiceContactButton = page.locator('group:has-text("Invoice Contacts") button').nth(1);

    // Credit invoice contacts
    this.creditInvoiceEmailInput = page.locator('group:has-text("Credit Invoice Contacts") textbox').first();
    this.addCreditInvoiceContactButton = page.locator('group:has-text("Credit Invoice Contacts") button').first();
    this.removeCreditInvoiceContactButton = page.locator('group:has-text("Credit Invoice Contacts") button').nth(1);

    // Form buttons
    this.createButton = page.getByRole('button', { name: ' Create' });
    this.goBackButton = page.getByRole('link', { name: ' Go Back' });

    // Validation
    this.validationErrorAlert = page.locator('text=Please make sure you have entered all of the required/correct information below.');
    this.validationErrorCloseButton = page.locator('button:has-text("×")');

    // Document upload
    this.uploadDocumentsSection = page.locator('group:has-text("Uploaded Documents")');
    this.fileUploadInput = page.locator('input[type="file"]');
    this.fileDescriptionInput = page.getByRole('textbox', { name: '(Optional)' });
    this.uploadButton = page.getByRole('button', { name: 'Upload' });
    this.uploadedDocumentsTable = this.uploadDocumentsSection.locator('table');
  }

  /**
   * Navigate to customer create page
   */
  async navigateToCustomerCreate(): Promise<void> {
    await this.navigateTo(this.url);
    await this.waitForPageLoad();
    this.logger.info('Navigated to customer create page');
  }

  /**
   * Verify customer create page is loaded
   */
  async verifyCustomerCreatePageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.pageHeading, 'Create Customer heading should be visible');
    await this.verifyElementVisible(this.createCustomerForm, 'Customer form should be visible');
    await this.verifyElementVisible(this.customerCodeInput, 'Customer Code input should be visible');
    await this.verifyElementVisible(this.createButton, 'Create button should be visible');
    this.logger.info('Customer create page successfully loaded and verified');
  }

  /**
   * Fill customer form with required fields only
   * @param customerData - Customer data object with required fields
   */
  async fillRequiredCustomerFields(customerData: {
    customerCode: string;
    team: string;
    customerName: string;
    address1: string;
    town: string;
    postCode: string;
    country: string;
    contact: string;
    telephone: string;
    vatNo: string;
    email: string;
    eoriNumber: string;
    paymentTerms: string;
    sageCode: string;
    bankAccount: string;
    accountManager: string;
  }): Promise<void> {
    this.logger.info('Filling required customer fields');

    await this.fillText(this.customerCodeInput, customerData.customerCode);
    await this.selectDropdownOption(this.teamDropdown, customerData.team);
    await this.fillText(this.customerNameInput, customerData.customerName);
    await this.fillText(this.address1Input, customerData.address1);
    await this.fillText(this.townInput, customerData.town);
    await this.fillText(this.postCodeInput, customerData.postCode);
    await this.selectDropdownOption(this.countryDropdown, customerData.country);
    await this.fillText(this.contactInput, customerData.contact);
    await this.fillText(this.telephoneInput, customerData.telephone);
    await this.fillText(this.vatNoInput, customerData.vatNo);
    await this.fillText(this.emailInput, customerData.email);
    await this.fillText(this.eoriNumberInput, customerData.eoriNumber);
    await this.fillText(this.paymentTermsInput, customerData.paymentTerms);
    await this.fillText(this.sageCodeInput, customerData.sageCode);
    await this.selectDropdownOption(this.bankAccountDropdown, customerData.bankAccount);
    await this.selectDropdownOption(this.accountManagerDropdown, customerData.accountManager);

    this.logger.info('Successfully filled all required customer fields');
  }

  /**
   * Fill customer form with all fields (required + optional)
   * @param customerData - Complete customer data object
   */
  async fillAllCustomerFields(customerData: {
    customerCode: string;
    team: string;
    customerName: string;
    address1: string;
    address2?: string;
    town: string;
    state?: string;
    postCode: string;
    country: string;
    contact: string;
    telephone: string;
    vatNo: string;
    email: string;
    customerApprove: 'Yes' | 'No';
    eoriNumber: string;
    paymentTerms: string;
    rechargeHandledByCCT?: string;
    billingOffice?: string;
    vatRate?: string;
    sageCode: string;
    bankAccount: string;
    accountManager: string;
    invoiceDate?: string;
    customerGroup?: string;
    invoiceEmails?: string[];
    creditInvoiceEmails?: string[];
  }): Promise<void> {
    this.logger.info('Filling all customer fields');

    // Fill required fields first
    await this.fillRequiredCustomerFields(customerData);

    // Fill optional fields if provided
    if (customerData.address2) {
      await this.fillText(this.address2Input, customerData.address2);
    }

    if (customerData.state) {
      await this.fillText(this.stateInput, customerData.state);
    }

    if (customerData.vatRate) {
      await this.fillText(this.vatRateInput, customerData.vatRate);
    }

    // Set customer approval
    if (customerData.customerApprove === 'Yes') {
      await this.clickElement(this.customerApproveYesRadio);
    } else {
      await this.clickElement(this.customerApproveNoRadio);
    }

    // Handle dropdown selections for optional fields
    if (customerData.rechargeHandledByCCT) {
      await this.selectDropdownOption(this.rechargeHandledByCCTDropdown, customerData.rechargeHandledByCCT);
    }

    if (customerData.billingOffice) {
      await this.selectDropdownOption(this.billingOfficeDropdown, customerData.billingOffice);
    }

    if (customerData.customerGroup) {
      await this.selectDropdownOption(this.customerGroupDropdown, customerData.customerGroup);
    }

    if (customerData.invoiceDate) {
      await this.selectDropdownOption(this.invoiceDateDropdown, customerData.invoiceDate);
    }

    // Add invoice emails if provided
    if (customerData.invoiceEmails && customerData.invoiceEmails.length > 0) {
      for (const email of customerData.invoiceEmails) {
        await this.addInvoiceEmail(email);
      }
    }

    // Add credit invoice emails if provided
    if (customerData.creditInvoiceEmails && customerData.creditInvoiceEmails.length > 0) {
      for (const email of customerData.creditInvoiceEmails) {
        await this.addCreditInvoiceEmail(email);
      }
    }

    this.logger.info('Successfully filled all customer fields');
  }

  /**
   * Select dropdown option
   * @param dropdown - Dropdown locator
   * @param option - Option to select
   */
  async selectDropdownOption(dropdown: Locator, option: string): Promise<void> {
    await this.clickElement(dropdown);
    await this.page.waitForTimeout(500); // Wait for dropdown to open
    
    // Look for the option in the dropdown list
    const optionLocator = this.page.locator(`text="${option}"`).first();
    await this.clickElement(optionLocator);
    
    this.logger.info(`Selected dropdown option: ${option}`);
  }

  /**
   * Add invoice email
   * @param email - Email address to add
   */
  async addInvoiceEmail(email: string): Promise<void> {
    await this.fillText(this.invoiceEmailInput, email);
    await this.clickElement(this.addInvoiceContactButton);
    this.logger.info(`Added invoice email: ${email}`);
  }

  /**
   * Add credit invoice email
   * @param email - Email address to add
   */
  async addCreditInvoiceEmail(email: string): Promise<void> {
    await this.fillText(this.creditInvoiceEmailInput, email);
    await this.clickElement(this.addCreditInvoiceContactButton);
    this.logger.info(`Added credit invoice email: ${email}`);
  }

  /**
   * Submit customer creation form
   */
  async submitCustomerForm(): Promise<void> {
    await this.clickElement(this.createButton);
    this.logger.info('Submitted customer creation form');
  }

  /**
   * Submit form without filling required fields to trigger validation
   */
  async submitEmptyForm(): Promise<void> {
    await this.clickElement(this.createButton);
    this.logger.info('Submitted empty form to test validation');
  }

  /**
   * Verify validation error message is displayed
   */
  async verifyValidationErrorDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.validationErrorAlert, 'Validation error should be visible');
    this.logger.info('Validation error message verified');
  }

  /**
   * Close validation error alert
   */
  async closeValidationError(): Promise<void> {
    await this.clickElement(this.validationErrorCloseButton);
    this.logger.info('Closed validation error alert');
  }

  /**
   * Go back to customer list
   */
  async goBackToCustomerList(): Promise<void> {
    await this.clickElement(this.goBackButton);
    this.logger.info('Clicked Go Back button');
  }

  /**
   * Verify customer creation success (check if redirected to customer list)
   */
  async verifyCustomerCreationSuccess(): Promise<boolean> {
    try {
      // Wait for redirect to customer list page
      await this.page.waitForURL('**/customer/index', { timeout: 10000 });
      this.logger.info('Customer creation successful - redirected to customer list');
      return true;
    } catch {
      this.logger.info('Customer creation failed - not redirected');
      return false;
    }
  }

  /**
   * Upload document
   * @param filePath - Path to file to upload
   * @param description - Optional file description
   */
  async uploadDocument(filePath: string, description?: string): Promise<void> {
    if (description) {
      await this.fillText(this.fileDescriptionInput, description);
    }
    
    await this.fileUploadInput.setInputFiles(filePath);
    await this.clickElement(this.uploadButton);
    
    this.logger.info(`Uploaded document: ${filePath} with description: ${description || 'No description'}`);
  }

  /**
   * Verify uploaded documents table
   */
  async verifyUploadedDocumentsTable(): Promise<void> {
    await this.verifyElementVisible(this.uploadedDocumentsTable, 'Uploaded documents table should be visible');
    this.logger.info('Uploaded documents table verified');
  }

  /**
   * Clear all form fields
   */
  async clearAllFields(): Promise<void> {
    const textInputs = [
      this.customerCodeInput,
      this.customerNameInput,
      this.address1Input,
      this.address2Input,
      this.townInput,
      this.stateInput,
      this.postCodeInput,
      this.contactInput,
      this.telephoneInput,
      this.vatNoInput,
      this.emailInput,
      this.eoriNumberInput,
      this.paymentTermsInput,
      this.vatRateInput,
      this.sageCodeInput
    ];

    for (const input of textInputs) {
      try {
        await input.clear();
      } catch {
        // Ignore errors for optional fields that might not be present
      }
    }

    this.logger.info('Cleared all form fields');
  }
}
