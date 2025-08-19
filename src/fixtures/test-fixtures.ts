import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { UserManagementPage } from '../pages/user-management.page';
import { CustomerListPage } from '../pages/customer-list.page';
import { CustomerCreatePage } from '../pages/customer-create.page';
import { CustomerEditPage } from '../pages/customer-edit.page';
import { Logger } from '../utils/logger';
import { TestDataManager } from '../utils/test-data-manager';
import { TestDataFactory } from '../utils/test-data-factory';
import { ConfigManager } from '../utils/config-manager';

// Define custom fixtures
export interface TestFixtures {
  loginPage: LoginPage;
  userManagementPage: UserManagementPage;
  customerListPage: CustomerListPage;
  customerCreatePage: CustomerCreatePage;
  customerEditPage: CustomerEditPage;
  logger: Logger;
  testData: TestDataManager;
  dataFactory: typeof TestDataFactory;
  config: ConfigManager;
}

/**
 * Extended test with custom fixtures for better test organization
 */
export const test = base.extend<TestFixtures>({
  // Login page fixture
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // User management page fixture
  userManagementPage: async ({ page }, use) => {
    const userManagementPage = new UserManagementPage(page);
    await use(userManagementPage);
  },

  // Customer list page fixture
  customerListPage: async ({ page }, use) => {
    const customerListPage = new CustomerListPage(page);
    await use(customerListPage);
  },

  // Customer create page fixture
  customerCreatePage: async ({ page }, use) => {
    const customerCreatePage = new CustomerCreatePage(page);
    await use(customerCreatePage);
  },

  // Customer edit page fixture
  customerEditPage: async ({ page }, use) => {
    const customerEditPage = new CustomerEditPage(page);
    await use(customerEditPage);
  },

  // Logger fixture
  logger: async ({}, use) => {
    const logger = new Logger('TestExecution');
    await use(logger);
  },

  // Test data manager fixture
  testData: async ({}, use) => {
    await use(TestDataManager);
  },

  // Data factory fixture
  dataFactory: async ({}, use) => {
    await use(TestDataFactory);
  },

  // Configuration manager fixture
  config: async ({}, use) => {
    await use(ConfigManager);
  }
});

/**
 * Custom test hooks and utilities
 */
export class TestHooks {
  /**
   * Setup method to run before each test
   */
  static async beforeEach(page: any, testInfo: any) {
    const logger = new Logger('TestHooks');
    
    // Log test start
    logger.testStart(testInfo.title);
    
    // Set up page event listeners
    page.on('pageerror', (error: Error) => {
      logger.error(`Page error: ${error.message}`);
    });

    page.on('console', (msg: any) => {
      if (msg.type() === 'error') {
        logger.error(`Console error: ${msg.text()}`);
      }
    });

    // Set viewport
    await page.setViewportSize({
      width: ConfigManager.VIEWPORT_WIDTH,
      height: ConfigManager.VIEWPORT_HEIGHT
    });
  }

  /**
   * Teardown method to run after each test
   */
  static async afterEach(page: any, testInfo: any) {
    const logger = new Logger('TestHooks');
    
    // Take screenshot on failure
    if (testInfo.status === 'failed') {
      const screenshotName = `failure-${testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
      await page.screenshot({
        path: `reports/screenshots/${screenshotName}.png`,
        fullPage: true
      });
      logger.error(`Test failed. Screenshot saved: ${screenshotName}.png`);
    }

    // Log test end
    const status = testInfo.status === 'passed' ? 'PASSED' : 'FAILED';
    logger.testEnd(testInfo.title, status);
  }

  /**
   * Handle authentication state
   */
  static async saveAuthState(page: any, username: string) {
    const authFile = `reports/auth-states/${username}-auth.json`;
    await page.context().storageState({ path: authFile });
    const logger = new Logger('TestHooks');
    logger.info(`Authentication state saved for user: ${username}`);
  }

  /**
   * Load authentication state
   */
  static getAuthStateFile(username: string): string {
    return `reports/auth-states/${username}-auth.json`;
  }
}

// Export expect for use in tests
export { expect };

// Export page object models
export { LoginPage } from '../pages/login.page';

// Export utilities
export { Logger } from '../utils/logger';
export { TestDataManager } from '../utils/test-data-manager';
export { ConfigManager } from '../utils/config-manager';

