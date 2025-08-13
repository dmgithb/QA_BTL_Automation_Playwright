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
   * Wait for an element to be visible with enhanced error handling
   * @param locator - The element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout: number = 30000): Promise<void> {
    try {
      // First wait for the page to be in a stable state
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      
      // Then wait for the element
      await locator.waitFor({ state: 'visible', timeout });
      
      this.logger.info('Element is now visible');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to wait for element: ${errorMessage}`);
      
      // Take screenshot for debugging
      await this.takeScreenshot(`wait-element-error-${Date.now()}`);
      
      // Try to get page info for debugging
      try {
        const url = await this.getCurrentUrl();
        const title = await this.getTitle();
        this.logger.info(`Current page: ${title} (${url})`);
      } catch (debugError) {
        this.logger.warn('Could not get page info for debugging');
      }
      
      throw error;
    }
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
   * Wait for page to load completely with enhanced stability checks
   */
  async waitForPageLoad(): Promise<void> {
    try {
      // Wait for DOM to be ready
      await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
      
      // Wait for network to be idle (no requests for 500ms)
      await this.page.waitForLoadState('networkidle', { timeout: 30000 });
      
      // Additional wait for any JavaScript-heavy pages
      await this.page.waitForTimeout(1000);
      
      this.logger.info('Page loading completed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Page load timeout: ${errorMessage}`);
      
      // Continue anyway, but log the issue
      const url = await this.getCurrentUrl();
      this.logger.info(`Current page URL: ${url}`);
    }
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
