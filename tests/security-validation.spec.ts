import { test, expect } from '@playwright/test';
import { TestDataManager } from '../src/utils/test-data-manager';
import { EnvironmentConfig } from '../src/utils/environment-config';

test.describe('Security Configuration Validation', () => {

  test('Environment variables should be properly loaded @critical @smoke', async () => {
    // Validate environment configuration
    const validation = TestDataManager.validateEnvironmentConfig();
    
    if (!validation.isValid) {
      console.warn('Missing environment variables:', validation.missingVars);
      console.log('Please ensure your .env file is properly configured');
    }
    
    // Should have basic environment variables
    expect(process.env.BASE_URL).toBeDefined();
    expect(process.env.DEFAULT_EMAIL_DOMAIN).toBeDefined();
  });

  test('Should load secure credentials for different user types @critical', async () => {
    // Test default credentials
    const defaultCreds = TestDataManager.getSecureCredentials('test');
    expect(defaultCreds).toHaveProperty('username');
    expect(defaultCreds).toHaveProperty('password');
    expect(defaultCreds.username).toBeTruthy();
    expect(defaultCreds.password).toBeTruthy();

    console.log('✅ Default credentials loaded successfully');
    console.log('Username:', defaultCreds.username);
    console.log('Password:', '***' + defaultCreds.password.slice(-3)); // Show only last 3 chars for security

    // Test through EnvironmentConfig
    const config = EnvironmentConfig.getInstance();
    const configCreds = config.getCredentials('test');
    expect(configCreds).toEqual(defaultCreds);

    console.log('✅ EnvironmentConfig credentials match TestDataManager');
  });

  test('Should substitute environment variables in test data @critical', async () => {
    // Get secure test data with environment variable substitution
    const loginData = await TestDataManager.getSecureTestData('login-data');
    
    expect(loginData).toHaveProperty('validUsers');
    expect(loginData).toHaveProperty('testEnvironment');
    
    // Check that environment variables were substituted
    const firstUser = loginData.validUsers[0];
    expect(firstUser.username).not.toContain('${');
    expect(firstUser.password).not.toContain('${');
    
    // Check test environment configuration
    expect(loginData.testEnvironment.baseUrl).not.toContain('${');
    expect(loginData.testEnvironment.emailDomain).not.toContain('${');
    
    console.log('✅ Environment variable substitution working');
    console.log('Base URL:', loginData.testEnvironment.baseUrl);
    console.log('Email Domain:', loginData.testEnvironment.emailDomain);
  });

  test('Should handle missing credentials gracefully @regression', async () => {
    // Try to get credentials for non-existent user type
    const fallbackCreds = TestDataManager.getSecureCredentials('nonexistent');
    
    // Should fallback to default credentials
    const defaultCreds = TestDataManager.getSecureCredentials('test');
    expect(fallbackCreds).toEqual(defaultCreds);
    
    console.log('✅ Fallback to default credentials works');
  });

  test('Should validate email domain configuration @critical', async () => {
    const config = EnvironmentConfig.getInstance();
    const emailDomain = config.getEmailDomain();
    
    expect(emailDomain).toBe('digitalmesh.com');
    
    console.log('✅ Email domain configured correctly:', emailDomain);
  });

  test('Should not expose credentials in configuration object @critical', async () => {
    const config = EnvironmentConfig.getInstance();
    const configString = JSON.stringify(config);
    
    // Configuration object should not contain raw passwords when serialized
    expect(configString).not.toContain('password');
    expect(configString).not.toContain('Jerrin@123');
    
    console.log('✅ Credentials not exposed in configuration serialization');
  });

  test('Should load browser and reporting configuration from environment @smoke', async () => {
    const config = EnvironmentConfig.getInstance();
    
    // Test browser configuration
    const browserConfig = config.get('browser');
    expect(browserConfig).toHaveProperty('headless');
    expect(browserConfig).toHaveProperty('viewport');
    expect(browserConfig).toHaveProperty('timeout');
    
    // Test reporting configuration
    const reportingConfig = config.get('reporting');
    expect(reportingConfig).toHaveProperty('screenshots');
    expect(reportingConfig).toHaveProperty('videos');
    
    console.log('✅ Browser and reporting configuration loaded');
    console.log('Browser timeout:', browserConfig.timeout);
    console.log('Screenshot mode:', reportingConfig.screenshots);
  });

});
