import { test as setup, expect } from '@playwright/test';
import { ConfigManager } from '../src/utils/config-manager';
import { FileUtils } from '../src/utils/file-utils';

const authFile = 'reports/auth-states/admin-auth.json';

/**
 * Setup test to prepare the environment and validate connectivity
 */
setup('Environment setup and validation', async ({ page }) => {
  // Initialize required directories
  FileUtils.initializeDirectories();
  
  // Test connectivity to the application
  await page.goto(ConfigManager.BASE_URL + '/login');
  
  // Verify the login page loads
  await expect(page).toHaveTitle(/Bulktainer Logistics ERP System/);
  
  // Take a screenshot for validation
  await page.screenshot({ path: 'reports/screenshots/setup-validation.png' });
  
  console.log('✅ Environment setup completed successfully');
  console.log('✅ Application connectivity verified');
});
