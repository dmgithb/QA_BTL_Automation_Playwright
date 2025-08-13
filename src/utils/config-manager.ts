import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

/**
 * Configuration manager for test environment settings
 */
export class ConfigManager {
  // Application URLs
  static readonly BASE_URL = process.env.BASE_URL || 'https://your-app-url.com';
  static readonly API_BASE_URL = process.env.API_BASE_URL || 'https://your-api-url.com/api/v1';

  // Test Configuration
  static readonly DEFAULT_TIMEOUT = parseInt(process.env.DEFAULT_TIMEOUT || '30000');
  static readonly RETRY_COUNT = parseInt(process.env.RETRY_COUNT || '2');
  static readonly HEADLESS = process.env.HEADLESS === 'true';

  // Browser Configuration
  static readonly BROWSER = process.env.BROWSER || 'chromium';
  static readonly VIEWPORT_WIDTH = parseInt(process.env.VIEWPORT_WIDTH || '1920');
  static readonly VIEWPORT_HEIGHT = parseInt(process.env.VIEWPORT_HEIGHT || '1080');

  // Reporting Configuration
  static readonly SCREENSHOT_MODE = process.env.SCREENSHOT_MODE || 'only-on-failure';
  static readonly VIDEO_MODE = process.env.VIDEO_MODE || 'retain-on-failure';
  static readonly ALLURE_RESULTS_DIR = process.env.ALLURE_RESULTS_DIR || 'allure-results';
  static readonly ALLURE_REPORT_DIR = process.env.ALLURE_REPORT_DIR || 'allure-report';

  // Logging Configuration
  static readonly LOG_LEVEL = process.env.LOG_LEVEL || 'info';
  static readonly LOG_TO_FILE = process.env.LOG_TO_FILE === 'true';

  // Test Data Configuration
  static readonly TEST_DATA_DIR = process.env.TEST_DATA_DIR || 'data';
  static readonly ENABLE_DATA_DRIVEN_TESTS = process.env.ENABLE_DATA_DRIVEN_TESTS === 'true';

  // Parallel Execution
  static readonly MAX_WORKERS = parseInt(process.env.MAX_WORKERS || '4');
  static readonly FULLY_PARALLEL = process.env.FULLY_PARALLEL === 'true';

  // CI/CD Configuration
  static readonly CI_ENVIRONMENT = process.env.CI_ENVIRONMENT === 'true';
  static readonly PUBLISH_RESULTS = process.env.PUBLISH_RESULTS === 'true';

  /**
   * Get full URL by appending path to base URL
   * @param path - URL path to append
   * @returns Complete URL
   */
  static getFullUrl(path: string): string {
    return `${this.BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
  }

  /**
   * Get API URL by appending endpoint to API base URL
   * @param endpoint - API endpoint to append
   * @returns Complete API URL
   */
  static getApiUrl(endpoint: string): string {
    return `${this.API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  }

  /**
   * Get browser configuration object
   * @returns Browser configuration
   */
  static getBrowserConfig() {
    return {
      name: this.BROWSER,
      headless: this.HEADLESS,
      viewport: {
        width: this.VIEWPORT_WIDTH,
        height: this.VIEWPORT_HEIGHT
      },
      timeout: this.DEFAULT_TIMEOUT
    };
  }

  /**
   * Get reporting configuration object
   * @returns Reporting configuration
   */
  static getReportingConfig() {
    return {
      screenshotMode: this.SCREENSHOT_MODE,
      videoMode: this.VIDEO_MODE,
      allureResultsDir: this.ALLURE_RESULTS_DIR,
      allureReportDir: this.ALLURE_REPORT_DIR
    };
  }

  /**
   * Get test execution configuration
   * @returns Test execution configuration
   */
  static getTestConfig() {
    return {
      timeout: this.DEFAULT_TIMEOUT,
      retries: this.RETRY_COUNT,
      workers: this.MAX_WORKERS,
      fullyParallel: this.FULLY_PARALLEL,
      dataDir: this.TEST_DATA_DIR,
      enableDataDriven: this.ENABLE_DATA_DRIVEN_TESTS
    };
  }

  /**
   * Check if running in CI environment
   * @returns boolean
   */
  static isCI(): boolean {
    return this.CI_ENVIRONMENT || process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
  }

  /**
   * Get environment name
   * @returns Environment name
   */
  static getEnvironment(): string {
    return process.env.NODE_ENV || 'test';
  }

  /**
   * Print current configuration
   */
  static printConfig(): void {
    console.log('=== Test Configuration ===');
    console.log(`Environment: ${this.getEnvironment()}`);
    console.log(`Base URL: ${this.BASE_URL}`);
    console.log(`Browser: ${this.BROWSER}`);
    console.log(`Headless: ${this.HEADLESS}`);
    console.log(`Viewport: ${this.VIEWPORT_WIDTH}x${this.VIEWPORT_HEIGHT}`);
    console.log(`Workers: ${this.MAX_WORKERS}`);
    console.log(`Timeout: ${this.DEFAULT_TIMEOUT}ms`);
    console.log(`CI Mode: ${this.isCI()}`);
    console.log('========================');
  }
}
