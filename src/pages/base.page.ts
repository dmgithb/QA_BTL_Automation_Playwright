import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * Base page class containing common functionality for all page objects
 */
export abstract class BasePage {
  protected page: Page;
  protected logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    this.logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
  }

  /**
   * Get the current page title
   * @returns Promise<string> - The page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get the current page URL
   * @returns Promise<string> - The current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for an element to be visible
   * @param locator - The element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Click on an element with proper waiting and error handling
   * @param locator - The element locator
   * @param options - Click options
   */
  async clickElement(locator: Locator, options?: { force?: boolean; timeout?: number }): Promise<void> {
    try {
      await this.waitForElement(locator, options?.timeout);
      await locator.click(options);
      this.logger.info(`Successfully clicked on element`);
    } catch (error) {
      this.logger.error(`Failed to click element: ${error}`);
      await this.takeScreenshot(`click-error-${Date.now()}`);
      throw error;
    }
  }

  /**
   * Fill text in an input field with validation
   * @param locator - The input element locator
   * @param text - The text to fill
   */
  async fillText(locator: Locator, text: string): Promise<void> {
    try {
      await this.waitForElement(locator);
      await locator.clear();
      await locator.fill(text);
      
      // Verify the text was filled correctly
      const filledValue = await locator.inputValue();
      if (filledValue !== text) {
        throw new Error(`Text verification failed. Expected: "${text}", Actual: "${filledValue}"`);
      }
      
      this.logger.info(`Successfully filled text in input field`);
    } catch (error) {
      this.logger.error(`Failed to fill text "${text}": ${error}`);
      await this.takeScreenshot(`fill-error-${Date.now()}`);
      throw error;
    }
  }

  /**
   * Get text content from an element
   * @param locator - The element locator
   * @returns Promise<string> - The text content
   */
  async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    const text = await locator.textContent();
    return text || '';
  }

  /**
   * Take a screenshot
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `reports/screenshots/${name}.png`, fullPage: true });
    this.logger.info(`Screenshot taken: ${name}.png`);
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify element is visible
   * @param locator - The element locator
   * @param message - Optional assertion message
   */
  async verifyElementVisible(locator: Locator, message?: string): Promise<void> {
    try {
      await expect(locator).toBeVisible();
      this.logger.info(`Verified element is visible: ${locator}`);
    } catch (error) {
      this.logger.error(message || `Element is not visible: ${locator}`);
      throw new Error(message || `Element is not visible: ${locator}`);
    }
  }

  /**
   * Verify text content
   * @param locator - The element locator
   * @param expectedText - Expected text content
   */
  async verifyText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toHaveText(expectedText);
    this.logger.info(`Verified text '${expectedText}' in element: ${locator}`);
  }

  /**
   * Select dropdown option by text
   * @param locator - The dropdown locator
   * @param optionText - The option text to select
   */
  async selectDropdownOption(locator: Locator, optionText: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.selectOption({ label: optionText });
    this.logger.info(`Selected dropdown option '${optionText}' in element: ${locator}`);
  }

  /**
   * Handle JavaScript alerts/confirms
   * @param accept - Whether to accept or dismiss the dialog
   */
  async handleAlert(accept: boolean = true): Promise<void> {
    this.page.on('dialog', async (dialog) => {
      if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
      this.logger.info(`Dialog ${accept ? 'accepted' : 'dismissed'}: ${dialog.message()}`);
    });
  }

  /**
   * Scroll to element
   * @param locator - The element locator
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    this.logger.info(`Scrolled to element: ${locator}`);
  }

  /**
   * Wait for element to be hidden/not visible
   * @param locator - The element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElementToBeHidden(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
    this.logger.info(`Element is now hidden`);
  }

  /**
   * Check if element exists (without throwing error)
   * @param locator - The element locator
   * @returns boolean - True if element exists
   */
  async isElementPresent(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'attached', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get element count
   * @param locator - The element locator
   * @returns number - Count of elements
   */
  async getElementCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  /**
   * Wait for specific text to appear in element
   * @param locator - The element locator
   * @param expectedText - Text to wait for
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForText(locator: Locator, expectedText: string, timeout: number = 30000): Promise<void> {
    await expect(locator).toHaveText(expectedText, { timeout });
    this.logger.info(`Text "${expectedText}" appeared in element`);
  }
}
