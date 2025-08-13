import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { ConfigManager } from '../utils/config-manager';

/**
 * Customer List page object for the application
 * Handles customer listing, searching, and navigation to create/edit customers
 */
export class CustomerListPage extends BasePage {
  // Page URL
  readonly url = `${ConfigManager.BASE_URL}/customer/index`;

  // Main page locators
  readonly pageHeading: Locator;
  readonly addNewCustomerButton: Locator;
  readonly customerTable: Locator;

  // Filter section locators
  readonly filterSection: Locator;
  readonly codeFilterInput: Locator;
  readonly nameFilterInput: Locator;
  readonly townFilterInput: Locator;
  readonly countryFilterDropdown: Locator;
  readonly billingOfficeDropdown: Locator;
  readonly teamDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly filterButton: Locator;
  readonly resetFiltersLink: Locator;

  // Table header locators
  readonly codeColumnHeader: Locator;
  readonly nameColumnHeader: Locator;
  readonly townColumnHeader: Locator;
  readonly teamColumnHeader: Locator;
  readonly countryColumnHeader: Locator;
  readonly actionColumnHeader: Locator;

  // Pagination locators
  readonly paginationInfo: Locator;
  readonly recordsPerPageDropdown: Locator;
  readonly firstPageButton: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly lastPageButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Main page elements
    this.pageHeading = page.getByRole('heading', { name: 'Customer', level: 2 });
    this.addNewCustomerButton = page.getByRole('link', { name: ' Add New Customer' });
    this.customerTable = page.locator('table');

    // Filter section
    this.filterSection = page.locator('group', { hasText: 'Filter Results' });
    this.codeFilterInput = page.locator('textbox').nth(0); // First textbox in filter section
    this.nameFilterInput = page.locator('textbox').nth(1); // Second textbox in filter section
    this.townFilterInput = page.locator('textbox').nth(2); // Third textbox in filter section
    this.countryFilterDropdown = page.locator('text=Please select Country').first();
    this.billingOfficeDropdown = page.locator('text=Please select office').first();
    this.teamDropdown = page.locator('text=All').first();
    this.statusDropdown = page.locator('text=Live').first();
    this.filterButton = page.getByRole('button', { name: ' Filter' });
    this.resetFiltersLink = page.getByRole('link', { name: ' Reset Search Filters' });

    // Table headers
    this.codeColumnHeader = page.locator('cell', { hasText: 'Code' });
    this.nameColumnHeader = page.locator('cell', { hasText: 'Name' });
    this.townColumnHeader = page.locator('cell', { hasText: 'Town' });
    this.teamColumnHeader = page.locator('cell', { hasText: 'Team' });
    this.countryColumnHeader = page.locator('cell', { hasText: 'Country' });
    this.actionColumnHeader = page.locator('cell', { hasText: 'Action' });

    // Pagination
    this.paginationInfo = page.locator('text=/Records \\d+ to \\d+ \\(Total \\d+ Results\\)/');
    this.recordsPerPageDropdown = page.locator('combobox').last();
    this.firstPageButton = page.locator('link').filter({ hasText: '' }).first();
    this.previousPageButton = page.locator('link').filter({ hasText: '' }).nth(1);
    this.nextPageButton = page.locator('link').filter({ hasText: '' }).nth(2);
    this.lastPageButton = page.locator('link').filter({ hasText: '' }).last();
  }

  /**
   * Navigate to customer list page
   */
  async navigateToCustomerList(): Promise<void> {
    await this.navigateTo(this.url);
    await this.waitForPageLoad();
    this.logger.info('Navigated to customer list page');
  }

  /**
   * Navigate to Core Data > Customer Data > Customers through menu
   */
  async navigateThroughMenu(): Promise<void> {
    // Click Core Data menu
    await this.clickElement(this.page.getByRole('link', { name: 'Core Data »' }));
    this.logger.step('Clicked Core Data menu');

    // Click Customer Data submenu
    await this.clickElement(this.page.getByRole('link', { name: 'Customer Data »' }));
    this.logger.step('Clicked Customer Data submenu');

    // Click Customers option
    await this.clickElement(this.page.getByRole('link', { name: 'Customers' }));
    this.logger.step('Clicked Customers option');

    await this.waitForPageLoad();
    this.logger.info('Navigated to customer list through menu');
  }

  /**
   * Verify customer list page is loaded
   */
  async verifyCustomerListPageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.pageHeading, 'Customer page heading should be visible');
    await this.verifyElementVisible(this.addNewCustomerButton, 'Add New Customer button should be visible');
    await this.verifyElementVisible(this.customerTable, 'Customer table should be visible');
    await this.verifyElementVisible(this.filterSection, 'Filter section should be visible');
    this.logger.info('Customer list page successfully loaded and verified');
  }

  /**
   * Click Add New Customer button
   */
  async clickAddNewCustomer(): Promise<void> {
    await this.clickElement(this.addNewCustomerButton);
    this.logger.info('Clicked Add New Customer button');
  }

  /**
   * Search customers by name
   * @param customerName - Name to search for
   */
  async searchCustomerByName(customerName: string): Promise<void> {
    await this.fillText(this.nameFilterInput, customerName);
    await this.clickElement(this.filterButton);
    await this.waitForPageLoad();
    this.logger.info(`Searched for customer with name: ${customerName}`);
  }

  /**
   * Search customers by code
   * @param customerCode - Code to search for
   */
  async searchCustomerByCode(customerCode: string): Promise<void> {
    await this.fillText(this.codeFilterInput, customerCode);
    await this.clickElement(this.filterButton);
    await this.waitForPageLoad();
    this.logger.info(`Searched for customer with code: ${customerCode}`);
  }

  /**
   * Reset search filters
   */
  async resetSearchFilters(): Promise<void> {
    await this.clickElement(this.resetFiltersLink);
    await this.waitForPageLoad();
    this.logger.info('Reset search filters');
  }

  /**
   * Get customer count from pagination info
   * @returns Promise<number> - Total number of customers
   */
  async getTotalCustomerCount(): Promise<number> {
    const paginationText = await this.getText(this.paginationInfo);
    const match = paginationText.match(/Total (\d+) Results/);
    return match ? parseInt(match[1]) : 0;
  }

  /**
   * Edit customer by code
   * @param customerCode - Customer code to edit
   */
  async editCustomerByCode(customerCode: string): Promise<void> {
    // First search for the customer
    await this.searchCustomerByCode(customerCode);
    
    // Find the edit button for the specific customer
    const editButton = this.page.locator(`tr:has-text("${customerCode}") a[href*="customer-edit"]`);
    await this.clickElement(editButton);
    this.logger.info(`Clicked edit button for customer: ${customerCode}`);
  }

  /**
   * Delete customer by code
   * @param customerCode - Customer code to delete
   */
  async deleteCustomerByCode(customerCode: string): Promise<void> {
    // First search for the customer
    await this.searchCustomerByCode(customerCode);
    
    // Find the delete button for the specific customer
    const deleteButton = this.page.locator(`tr:has-text("${customerCode}") a[href*="delete"]`);
    await this.clickElement(deleteButton);
    this.logger.info(`Clicked delete button for customer: ${customerCode}`);
  }

  /**
   * Verify customer exists in table
   * @param customerCode - Customer code to verify
   * @returns Promise<boolean> - True if customer exists
   */
  async verifyCustomerExists(customerCode: string): Promise<boolean> {
    await this.searchCustomerByCode(customerCode);
    const customerRow = this.page.locator(`tr:has-text("${customerCode}")`);
    
    try {
      await customerRow.waitFor({ state: 'visible', timeout: 5000 });
      this.logger.info(`Customer ${customerCode} found in table`);
      return true;
    } catch {
      this.logger.info(`Customer ${customerCode} not found in table`);
      return false;
    }
  }

  /**
   * Get customer details from table
   * @param customerCode - Customer code to get details for
   * @returns Promise<object> - Customer details object
   */
  async getCustomerDetails(customerCode: string): Promise<{
    code: string;
    name: string;
    town: string;
    team: string;
    country: string;
    contact: string;
    telephone: string;
  }> {
    await this.searchCustomerByCode(customerCode);
    const customerRow = this.page.locator(`tr:has-text("${customerCode}")`);
    
    const cells = customerRow.locator('td');
    const details = {
      code: await cells.nth(0).textContent() || '',
      name: await cells.nth(1).textContent() || '',
      town: await cells.nth(2).textContent() || '',
      team: await cells.nth(3).textContent() || '',
      country: await cells.nth(4).textContent() || '',
      contact: await cells.nth(5).textContent() || '',
      telephone: await cells.nth(6).textContent() || ''
    };

    this.logger.info(`Retrieved customer details for ${customerCode}`);
    return details;
  }

  /**
   * Change records per page
   * @param recordsPerPage - Number of records to display per page (10, 25, 50, 100, 250)
   */
  async changeRecordsPerPage(recordsPerPage: string): Promise<void> {
    await this.recordsPerPageDropdown.selectOption(recordsPerPage);
    await this.waitForPageLoad();
    this.logger.info(`Changed records per page to: ${recordsPerPage}`);
  }

  /**
   * Navigate to next page
   */
  async goToNextPage(): Promise<void> {
    await this.clickElement(this.nextPageButton);
    await this.waitForPageLoad();
    this.logger.info('Navigated to next page');
  }

  /**
   * Navigate to previous page
   */
  async goToPreviousPage(): Promise<void> {
    await this.clickElement(this.previousPageButton);
    await this.waitForPageLoad();
    this.logger.info('Navigated to previous page');
  }
}
