import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { ConfigManager } from '../utils/config-manager';

/**
 * Login page object for the application
 */
export class LoginPage extends BasePage {
  // Page URL
  readonly url = `${ConfigManager.BASE_URL}/login`;

  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorMessage: Locator;
  readonly aboutUsLink: Locator;
  readonly contactUsLink: Locator;
  readonly copyrightText: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password' });
    this.errorMessage = page.locator('.error-message, .alert-danger, [class*="error"]');
    this.aboutUsLink = page.getByRole('link', { name: 'About Us' });
    this.contactUsLink = page.getByRole('link', { name: 'Contact Us' });
    this.copyrightText = page.locator('text=Copyright © 2011 Bulk Tainer Logistics');
  }

  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo(this.url);
    await this.waitForPageLoad();
    this.logger.info('Navigated to login page');
  }

  /**
   * Perform login with username and password
   * @param username - Username to login with
   * @param password - Password to login with
   */
  async login(username: string, password: string): Promise<void> {
    this.logger.info(`Attempting to login with username: ${username}`);
    await this.fillText(this.usernameInput, username);
    await this.fillText(this.passwordInput, password);
    await this.clickElement(this.submitButton);
    this.logger.info('Login form submitted');
  }

  /**
   * Clear login form fields
   */
  async clearLoginForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
    this.logger.info('Login form cleared');
  }

  /**
   * Verify login page is loaded
   */
  async verifyLoginPageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.usernameInput, 'Username input should be visible');
    await this.verifyElementVisible(this.passwordInput, 'Password input should be visible');
    await this.verifyElementVisible(this.submitButton, 'Submit button should be visible');
    await this.verifyElementVisible(this.copyrightText, 'Copyright text should be visible');
    this.logger.info('Login page successfully loaded and verified');
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
    this.logger.info('Clicked forgot password link');
  }

  /**
   * Get error message text if present
   * @returns Promise<string> - Error message text or empty string
   */
  async getErrorMessage(): Promise<string> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      return await this.getText(this.errorMessage);
    } catch {
      return '';
    }
  }

  /**
   * Verify error message is displayed
   * @param expectedErrorMessage - Expected error message text
   */
  async verifyErrorMessage(expectedErrorMessage: string): Promise<void> {
    const actualErrorMessage = await this.getErrorMessage();
    if (actualErrorMessage.includes(expectedErrorMessage)) {
      this.logger.info(`Error message verified: ${actualErrorMessage}`);
    } else {
      throw new Error(`Expected error message '${expectedErrorMessage}' but got '${actualErrorMessage}'`);
    }
  }

  /**
   * Check if user is redirected after login (login successful)
   * @returns Promise<boolean> - True if redirected from login page
   */
  async isLoginSuccessful(): Promise<boolean> {
    await this.page.waitForTimeout(2000); // Wait for potential redirect
    const currentUrl = await this.getCurrentUrl();
    const isRedirected = !currentUrl.includes('/login');
    this.logger.info(`Login ${isRedirected ? 'successful' : 'failed'} - Current URL: ${currentUrl}`);
    return isRedirected;
  }

  /**
   * Click About Us link
   */
  async clickAboutUs(): Promise<void> {
    await this.clickElement(this.aboutUsLink);
    this.logger.info('Clicked About Us link');
  }

  /**
   * Click Contact Us link
   */
  async clickContactUs(): Promise<void> {
    await this.clickElement(this.contactUsLink);
    this.logger.info('Clicked Contact Us link');
  }

  /**
   * Verify page title
   */
  async verifyPageTitle(): Promise<void> {
    const title = await this.getTitle();
    if (title.includes('Bulktainer Logistics ERP System')) {
      this.logger.info(`Page title verified: ${title}`);
    } else {
      throw new Error(`Expected page title to contain 'Bulktainer Logistics ERP System' but got '${title}'`);
    }
  }
}
