/**
 * Environment-based configuration manager
 * Implements best practices for configuration management with secure credential handling
 */
import dotenv from 'dotenv';
import { TestDataManager } from './test-data-manager';

// Load environment variables
dotenv.config();

export class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private config: any;

  private constructor() {
    this.loadConfiguration();
  }

  public static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  private loadConfiguration(): void {
    const environment = process.env.NODE_ENV || 'staging';
    
    // Validate environment configuration
    const { isValid, missingVars } = TestDataManager.validateEnvironmentConfig();
    if (!isValid) {
      console.warn('Missing environment variables:', missingVars);
    }

    // Load base configuration from environment variables
    const baseConfig = {
      browser: {
        headless: process.env.HEADLESS === 'true' || false,
        viewport: {
          width: parseInt(process.env.VIEWPORT_WIDTH || '1920'),
          height: parseInt(process.env.VIEWPORT_HEIGHT || '1080')
        },
        timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000')
      },
      reporting: {
        screenshots: process.env.SCREENSHOT_MODE || 'only-on-failure',
        videos: process.env.VIDEO_MODE || 'retain-on-failure',
        allureReports: process.env.ALLURE_RESULTS_DIR || 'allure-results'
      },
      security: {
        // Note: Credentials are NOT stored in config for security
        emailDomain: process.env.DEFAULT_EMAIL_DOMAIN || 'digitalmesh.com'
      }
    };

    // Environment-specific overrides using environment variables where possible
    const envConfigs = {
      staging: {
        baseUrl: process.env.BASE_URL || 'https://training.bt-ms.com/MAIN-STAGE/erp.php',
        apiUrl: process.env.API_BASE_URL || 'https://training.bt-ms.com/api/v1',
        timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000')
      },
      production: {
        baseUrl: process.env.BASE_URL || 'https://production.bt-ms.com/erp.php',
        apiUrl: process.env.API_BASE_URL || 'https://production.bt-ms.com/api/v1',
        timeout: parseInt(process.env.DEFAULT_TIMEOUT || '60000')
      },
      development: {
        baseUrl: process.env.BASE_URL || 'http://localhost:3000',
        apiUrl: process.env.API_BASE_URL || 'http://localhost:3001/api/v1',
        timeout: parseInt(process.env.DEFAULT_TIMEOUT || '15000')
      }
    };

    this.config = {
      ...baseConfig,
      ...envConfigs[environment as keyof typeof envConfigs]
    };
  }

  public get(key: string): any {
    return this.getNestedValue(this.config, key);
  }

  public getEnvironment(): string {
    return process.env.NODE_ENV || 'staging';
  }

  /**
   * Get secure credentials for a specific user type
   * @param userType - Type of user (test, admin, manager, regular)
   * @returns Credentials object
   */
  public getCredentials(userType: string = 'test'): { username: string; password: string } {
    // Get credentials directly from TestDataManager, not from config object
    return TestDataManager.getSecureCredentials(userType);
  }

  /**
   * Get email domain for test data
   * @returns Email domain string
   */
  public getEmailDomain(): string {
    return this.config.security.emailDomain;
  }

  public getBaseUrl(): string {
    return this.config.baseUrl;
  }

  public getApiUrl(): string {
    return this.config.apiUrl;
  }

  public getBrowserConfig(): any {
    return this.config.browser;
  }

  public getReportingConfig(): any {
    return this.config.reporting;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}
