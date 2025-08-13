import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { ConfigManager } from '../utils/config-manager';

/**
 * Customer Edit page object for the application
 * Handles customer editing and updating functionality
 */
export class CustomerEditPage extends BasePage {
  // Page URL pattern
  readonly urlPattern = `${ConfigManager.BASE_URL}/customer/*/customer-edit`;

  // Form heading
  readonly pageHeading: Locator;
  readonly editCustomerForm: Locator;

  // Customer Details Section - All Fields (similar to create page)
  readonly customerCodeInput: Locator;
  readonly teamDropdown: Locator;
  readonly customerNameInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly townInput: Locator;
  readonly stateInput: Locator;
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
  readonly vatRateInput: Locator;
  readonly sageCodeInput: Locator;
  readonly bankAccountDropdown: Locator;
  readonly accountManagerDropdown: Locator;
  readonly customerGroupDropdown: Locator;
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
  readonly updateButton: Locator;
  readonly goBackButton: Locator;
  readonly deleteButton: Locator;

  // Success/Error messages
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  // Document upload section
  readonly uploadDocumentsSection: Locator;
  readonly fileUploadInput: Locator;
  readonly fileDescriptionInput: Locator;
  readonly uploadButton: Locator;
  readonly uploadedDocumentsTable: Locator;

  constructor(page: Page) {
    super(page);

    // Page elements
    this.pageHeading = page.getByRole('heading', { name: /Edit Customer|Update Customer/, level: 3 });
    this.editCustomerForm = page.locator('form').first();

    // Form Fields (same as create page but may have pre-filled values)
    this.customerCodeInput = page.getByRole('textbox', { name: 'Customer Code' });
    this.teamDropdown = page.locator('[name="team"], [id="team"]').first();
    this.customerNameInput = page.getByRole('textbox', { name: 'Customer Name' });
    this.address1Input = page.getByRole('textbox', { name: 'Address 1' });
    this.address2Input = page.getByRole('textbox', { name: 'Address 2' });
    this.townInput = page.getByRole('textbox', { name: 'Town' });
    this.stateInput = page.getByRole('textbox', { name: 'State' });
    this.postCodeInput = page.getByRole('textbox', { name: 'Post Code' });
    this.countryDropdown = page.locator('[name="country"], [id="country"]').first();
    this.contactInput = page.getByRole('textbox', { name: 'Contact' });
    this.telephoneInput = page.getByRole('textbox', { name: 'Telephone' });
    this.vatNoInput = page.getByRole('textbox', { name: 'VAT No' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.eoriNumberInput = page.getByRole('textbox', { name: 'EORI Number' });
    this.paymentTermsInput = page.getByRole('textbox', { name: 'Payment Terms' });
    this.rechargeHandledByCCTDropdown = page.locator('[name="recharge_cct"], [id="recharge_cct"]').first();
    this.billingOfficeDropdown = page.locator('[name="billing_office"], [id="billing_office"]').first();
    this.effectiveFromDateInput = page.getByRole('textbox', { name: 'dd/mm/yyyy' });
    this.vatRateInput = page.getByRole('textbox', { name: 'VAT Rate' });
    this.sageCodeInput = page.getByRole('textbox', { name: 'Sage Code' });
    this.bankAccountDropdown = page.locator('[name="bank_account"], [id="bank_account"]').first();
    this.accountManagerDropdown = page.locator('[name="account_manager"], [id="account_manager"]').first();
    this.customerGroupDropdown = page.locator('[name="customer_group"], [id="customer_group"]').first();
    this.invoiceDateDropdown = page.locator('[name="invoice_date"], [id="invoice_date"]').first();

    // Radio buttons
    this.customerApproveYesRadio = page.locator('input[type="radio"][value="Yes"], input[type="radio"][value="1"]').first();
    this.customerApproveNoRadio = page.locator('input[type="radio"][value="No"], input[type="radio"][value="0"]').first();

    // Invoice contacts
    this.invoiceEmailInput = page.locator('group:has-text("Invoice Contacts") textbox, [name*="invoice_email"]').first();
    this.addInvoiceContactButton = page.locator('group:has-text("Invoice Contacts") button, button:has-text("Add")').first();
    this.removeInvoiceContactButton = page.locator('group:has-text("Invoice Contacts") button:has-text("Remove")').first();

    // Credit invoice contacts
    this.creditInvoiceEmailInput = page.locator('group:has-text("Credit Invoice Contacts") textbox, [name*="credit_email"]').first();
    this.addCreditInvoiceContactButton = page.locator('group:has-text("Credit Invoice Contacts") button:has-text("Add")').first();
    this.removeCreditInvoiceContactButton = page.locator('group:has-text("Credit Invoice Contacts") button:has-text("Remove")').first();

    // Form buttons
    this.updateButton = page.getByRole('button', { name: /Update|Save/ });
    this.goBackButton = page.getByRole('link', { name: ' Go Back' });
    this.deleteButton = page.getByRole('button', { name: /Delete/ });

    // Messages
    this.successMessage = page.locator('.alert-success, .success-message, [class*="success"]');
    this.errorMessage = page.locator('.alert-danger, .error-message, [class*="error"]');

    // Document upload
    this.uploadDocumentsSection = page.locator('group:has-text("Uploaded Documents")');
    this.fileUploadInput = page.locator('input[type="file"]');
    this.fileDescriptionInput = page.getByRole('textbox', { name: '(Optional)' });
    this.uploadButton = page.getByRole('button', { name: 'Upload' });
    this.uploadedDocumentsTable = this.uploadDocumentsSection.locator('table');
  }

  /**
   * Verify customer edit page is loaded
   */
  async verifyCustomerEditPageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.editCustomerForm, 'Customer edit form should be visible');
    await this.verifyElementVisible(this.customerCodeInput, 'Customer Code input should be visible');
    await this.verifyElementVisible(this.updateButton, 'Update button should be visible');
    this.logger.info('Customer edit page successfully loaded and verified');
  }

  /**
   * Get current customer code from the form
   * @returns Promise<string> - Current customer code
   */
  async getCurrentCustomerCode(): Promise<string> {
    const value = await this.customerCodeInput.inputValue();
    this.logger.info(`Current customer code: ${value}`);
    return value;
  }

  /**
   * Get current customer name from the form
   * @returns Promise<string> - Current customer name
   */
  async getCurrentCustomerName(): Promise<string> {
    const value = await this.customerNameInput.inputValue();
    this.logger.info(`Current customer name: ${value}`);
    return value;
  }

  /**
   * Update customer name
   * @param newName - New customer name
   */
  async updateCustomerName(newName: string): Promise<void> {
    await this.fillText(this.customerNameInput, newName);
    this.logger.info(`Updated customer name to: ${newName}`);
  }

  /**
   * Update customer contact information
   * @param contactData - Contact data to update
   */
  async updateContactInformation(contactData: {
    contact?: string;
    telephone?: string;
    email?: string;
  }): Promise<void> {
    if (contactData.contact) {
      await this.fillText(this.contactInput, contactData.contact);
      this.logger.info(`Updated contact to: ${contactData.contact}`);
    }

    if (contactData.telephone) {
      await this.fillText(this.telephoneInput, contactData.telephone);
      this.logger.info(`Updated telephone to: ${contactData.telephone}`);
    }

    if (contactData.email) {
      await this.fillText(this.emailInput, contactData.email);
      this.logger.info(`Updated email to: ${contactData.email}`);
    }
  }

  /**
   * Update customer address
   * @param addressData - Address data to update
   */
  async updateAddress(addressData: {
    address1?: string;
    address2?: string;
    town?: string;
    state?: string;
    postCode?: string;
    country?: string;
  }): Promise<void> {
    if (addressData.address1) {
      await this.fillText(this.address1Input, addressData.address1);
      this.logger.info(`Updated address1 to: ${addressData.address1}`);
    }

    if (addressData.address2) {
      await this.fillText(this.address2Input, addressData.address2);
      this.logger.info(`Updated address2 to: ${addressData.address2}`);
    }

    if (addressData.town) {
      await this.fillText(this.townInput, addressData.town);
      this.logger.info(`Updated town to: ${addressData.town}`);
    }

    if (addressData.state) {
      await this.fillText(this.stateInput, addressData.state);
      this.logger.info(`Updated state to: ${addressData.state}`);
    }

    if (addressData.postCode) {
      await this.fillText(this.postCodeInput, addressData.postCode);
      this.logger.info(`Updated post code to: ${addressData.postCode}`);
    }

    if (addressData.country) {
      await this.selectDropdownOption(this.countryDropdown, addressData.country);
      this.logger.info(`Updated country to: ${addressData.country}`);
    }
  }

  /**
   * Select dropdown option
   * @param dropdown - Dropdown locator
   * @param option - Option to select
   */
  async selectDropdownOption(dropdown: Locator, option: string): Promise<void> {
    try {
      // Try selecting by value first
      await dropdown.selectOption({ label: option });
    } catch {
      // If that fails, try clicking and selecting
      await this.clickElement(dropdown);
      await this.page.waitForTimeout(500);
      
      const optionLocator = this.page.locator(`text="${option}"`).first();
      await this.clickElement(optionLocator);
    }
    
    this.logger.info(`Selected dropdown option: ${option}`);
  }

  /**
   * Toggle customer approval status
   * @param approve - True for Yes, False for No
   */
  async toggleCustomerApproval(approve: boolean): Promise<void> {
    if (approve) {
      await this.clickElement(this.customerApproveYesRadio);
      this.logger.info('Set customer approval to Yes');
    } else {
      await this.clickElement(this.customerApproveNoRadio);
      this.logger.info('Set customer approval to No');
    }
  }

  /**
   * Submit customer update form
   */
  async submitCustomerUpdate(): Promise<void> {
    await this.clickElement(this.updateButton);
    this.logger.info('Submitted customer update form');
  }

  /**
   * Go back to customer list
   */
  async goBackToCustomerList(): Promise<void> {
    await this.clickElement(this.goBackButton);
    this.logger.info('Clicked Go Back button');
  }

  /**
   * Delete customer
   */
  async deleteCustomer(): Promise<void> {
    await this.clickElement(this.deleteButton);
    this.logger.info('Clicked Delete button');
  }

  /**
   * Verify success message is displayed
   * @param expectedMessage - Expected success message (optional)
   */
  async verifySuccessMessage(expectedMessage?: string): Promise<void> {
    await this.verifyElementVisible(this.successMessage, 'Success message should be visible');
    
    if (expectedMessage) {
      const actualMessage = await this.getText(this.successMessage);
      if (!actualMessage.includes(expectedMessage)) {
        throw new Error(`Expected success message to contain "${expectedMessage}", but got "${actualMessage}"`);
      }
    }
    
    this.logger.info('Success message verified');
  }

  /**
   * Verify error message is displayed
   * @param expectedMessage - Expected error message (optional)
   */
  async verifyErrorMessage(expectedMessage?: string): Promise<void> {
    await this.verifyElementVisible(this.errorMessage, 'Error message should be visible');
    
    if (expectedMessage) {
      const actualMessage = await this.getText(this.errorMessage);
      if (!actualMessage.includes(expectedMessage)) {
        throw new Error(`Expected error message to contain "${expectedMessage}", but got "${actualMessage}"`);
      }
    }
    
    this.logger.info('Error message verified');
  }

  /**
   * Verify customer update success (check for success indicators)
   */
  async verifyCustomerUpdateSuccess(): Promise<boolean> {
    try {
      // Look for success message or redirect
      await Promise.race([
        this.successMessage.waitFor({ state: 'visible', timeout: 5000 }),
        this.page.waitForURL('**/customer/index', { timeout: 5000 })
      ]);
      
      this.logger.info('Customer update successful');
      return true;
    } catch {
      this.logger.info('Customer update may have failed - no success indicators found');
      return false;
    }
  }

  /**
   * Get all current customer data from the form
   * @returns Promise<object> - Current customer data
   */
  async getCurrentCustomerData(): Promise<{
    customerCode: string;
    customerName: string;
    address1: string;
    address2: string;
    town: string;
    state: string;
    postCode: string;
    contact: string;
    telephone: string;
    email: string;
    vatNo: string;
    eoriNumber: string;
    paymentTerms: string;
    sageCode: string;
  }> {
    const customerData = {
      customerCode: await this.customerCodeInput.inputValue(),
      customerName: await this.customerNameInput.inputValue(),
      address1: await this.address1Input.inputValue(),
      address2: await this.address2Input.inputValue(),
      town: await this.townInput.inputValue(),
      state: await this.stateInput.inputValue(),
      postCode: await this.postCodeInput.inputValue(),
      contact: await this.contactInput.inputValue(),
      telephone: await this.telephoneInput.inputValue(),
      email: await this.emailInput.inputValue(),
      vatNo: await this.vatNoInput.inputValue(),
      eoriNumber: await this.eoriNumberInput.inputValue(),
      paymentTerms: await this.paymentTermsInput.inputValue(),
      sageCode: await this.sageCodeInput.inputValue()
    };

    this.logger.info('Retrieved current customer data from form');
    return customerData;
  }

  /**
   * Verify field is editable
   * @param fieldLocator - Field locator to test
   * @param fieldName - Name of the field for logging
   */
  async verifyFieldIsEditable(fieldLocator: Locator, fieldName: string): Promise<void> {
    const isDisabled = await fieldLocator.isDisabled();
    const isReadonly = await fieldLocator.getAttribute('readonly');
    
    if (isDisabled || isReadonly) {
      throw new Error(`Field ${fieldName} is not editable (disabled: ${isDisabled}, readonly: ${isReadonly !== null})`);
    }
    
    this.logger.info(`Verified ${fieldName} field is editable`);
  }

  /**
   * Verify all required fields are editable
   */
  async verifyRequiredFieldsAreEditable(): Promise<void> {
    const requiredFields = [
      { locator: this.customerNameInput, name: 'Customer Name' },
      { locator: this.address1Input, name: 'Address 1' },
      { locator: this.townInput, name: 'Town' },
      { locator: this.postCodeInput, name: 'Post Code' },
      { locator: this.contactInput, name: 'Contact' },
      { locator: this.telephoneInput, name: 'Telephone' },
      { locator: this.emailInput, name: 'Email' }
    ];

    for (const field of requiredFields) {
      await this.verifyFieldIsEditable(field.locator, field.name);
    }

    this.logger.info('All required fields verified as editable');
  }
}
