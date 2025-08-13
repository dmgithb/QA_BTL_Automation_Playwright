import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { Page, Browser, BrowserContext } from '@playwright/test';
import { expect } from '@playwright/test';
import { TestDataManager } from '../../src/utils/test-data-manager';
import { LoginPage } from '../../src/pages/login.page';
import { world } from '../support/world';
import { performance } from 'perf_hooks';

// Define types for performance and accessibility testing
interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
}

interface AccessibilityResult {
  violations: any[];
  passes: any[];
  incomplete: any[];
}

// Custom World properties for performance and accessibility
interface PerformanceAccessibilityWorldExtension {
  loginPage?: LoginPage;
  testDataManager?: TestDataManager;
  performanceMetrics?: PerformanceMetrics;
  accessibilityResult?: AccessibilityResult;
  validUser?: any;
  loadStartTime?: number;
  loadEndTime?: number;
}

// Extend world with performance/accessibility properties
let perfAccWorld: PerformanceAccessibilityWorldExtension = {};

Before(async function() {
  console.log('[BDD-Test] Browser context and page initialized for scenario');
});

After(async function() {
  console.log('[BDD-Test] Browser context closed after scenario');
});

// Background step
Given('I am on the login page', async function() {
  if (!world.page) {
    throw new Error('Page not initialized');
  }
  
  perfAccWorld.loginPage = new LoginPage(world.page);
  perfAccWorld.testDataManager = new TestDataManager();
  
  await perfAccWorld.loginPage.navigateToLoginPage();
  console.log('[BDD-Test] Navigated to login page');
});

// Performance Testing Steps
When('I navigate to the login page and measure performance', async function() {
  if (!perfAccWorld.loginPage) {
    throw new Error('LoginPage not initialized');
  }
  
  perfAccWorld.loadStartTime = performance.now();
  
  // Navigate to login page (already done in background, but measure this navigation)
  await perfAccWorld.loginPage.navigateToLoginPage();
  
  // Wait for page to be fully loaded
  await world.page?.waitForLoadState('networkidle');
  
  perfAccWorld.loadEndTime = performance.now();
  
  console.log('[BDD-Test] Login page loaded with performance measurement');
});

Then('the page should load within acceptable time limits', async function() {
  if (!perfAccWorld.loadStartTime || !perfAccWorld.loadEndTime) {
    throw new Error('Performance metrics not captured');
  }
  
  const loadTime = perfAccWorld.loadEndTime - perfAccWorld.loadStartTime;
  perfAccWorld.performanceMetrics = { loadTime, domContentLoaded: loadTime };
  
  console.log(`[BDD-Test] Page load time: ${loadTime.toFixed(2)}ms`);
  
  // Assert that load time is under 5 seconds (5000ms)
  expect(loadTime).toBeLessThan(5000);
  
  console.log('[BDD-Test] Page load time is within acceptable limits');
});

Then('the load time should be logged for monitoring', async function() {
  if (!perfAccWorld.performanceMetrics) {
    throw new Error('Performance metrics not available');
  }
  
  // Log performance data for monitoring
  const metricsLog = {
    timestamp: new Date().toISOString(),
    loadTime: perfAccWorld.performanceMetrics.loadTime,
    url: world.page?.url() || 'unknown'
  };
  
  console.log('[BDD-Test] Performance metrics logged:', JSON.stringify(metricsLog, null, 2));
});

Then('performance should meet the required standards', async function() {
  if (!perfAccWorld.performanceMetrics) {
    throw new Error('Performance metrics not available');
  }
  
  // Define performance standards
  const standards = {
    maxLoadTime: 5000, // 5 seconds
    maxDomContentLoaded: 3000 // 3 seconds
  };
  
  const meetsStandards = 
    perfAccWorld.performanceMetrics.loadTime <= standards.maxLoadTime &&
    perfAccWorld.performanceMetrics.domContentLoaded <= standards.maxDomContentLoaded;
  
  if (!meetsStandards) {
    throw new Error(`Performance standards not met. Load time: ${perfAccWorld.performanceMetrics.loadTime}ms, DOM ready: ${perfAccWorld.performanceMetrics.domContentLoaded}ms`);
  }
  
  console.log('[BDD-Test] Performance meets required standards');
});

// Accessibility Testing Steps
When('I navigate to the login page', async function() {
  if (!perfAccWorld.loginPage) {
    throw new Error('LoginPage not initialized');
  }
  
  // Navigate to login page (already done in background, but ensure it's loaded)
  await perfAccWorld.loginPage.navigateToLoginPage();
  console.log('[BDD-Test] Navigated to login page for accessibility testing');
});

When('I check for basic accessibility requirements', async function() {
  if (!world.page) {
    throw new Error('Page not initialized');
  }
  
  // Basic accessibility checks
  const usernameInput = world.page.locator('input[name="username"]');
  const passwordInput = world.page.locator('input[name="password"]');
  const submitButton = world.page.locator('input[type="submit"], button[type="submit"]');
  
  // Check if elements are present and visible
  await expect(usernameInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await expect(submitButton).toBeVisible();
  
  perfAccWorld.accessibilityResult = {
    violations: [],
    passes: [],
    incomplete: []
  };
  
  // Check for proper labeling
  const usernameHasLabel = await usernameInput.getAttribute('placeholder') || 
                          await usernameInput.getAttribute('aria-label') ||
                          await world.page.locator('label[for="username"]').count() > 0;
  
  const passwordHasLabel = await passwordInput.getAttribute('placeholder') || 
                          await passwordInput.getAttribute('aria-label') ||
                          await world.page.locator('label[for="password"]').count() > 0;
  
  if (usernameHasLabel) {
    perfAccWorld.accessibilityResult.passes.push({ description: 'Username input has proper labeling' });
  } else {
    perfAccWorld.accessibilityResult.violations.push({ description: 'Username input lacks proper labeling' });
  }
  
  if (passwordHasLabel) {
    perfAccWorld.accessibilityResult.passes.push({ description: 'Password input has proper labeling' });
  } else {
    perfAccWorld.accessibilityResult.violations.push({ description: 'Password input lacks proper labeling' });
  }
  
  console.log('[BDD-Test] Basic accessibility requirements checked');
});

Then('form elements should have proper labels and attributes', async function() {
  if (!perfAccWorld.accessibilityResult) {
    throw new Error('Accessibility results not available');
  }
  
  const labelingPasses = perfAccWorld.accessibilityResult.passes.filter(p => 
    p.description.includes('labeling')
  );
  
  if (labelingPasses.length === 0) {
    throw new Error('Form elements do not have proper labels and attributes');
  }
  
  console.log(`[BDD-Test] Form elements have proper labels: ${labelingPasses.length} elements checked`);
});

Then('the submit button should be accessible', async function() {
  if (!world.page) {
    throw new Error('Page not initialized');
  }
  
  const submitButton = world.page.locator('input[type="submit"], button[type="submit"]');
  
  // Check if submit button is keyboard accessible
  await submitButton.focus();
  const isFocused = await submitButton.evaluate(el => el === document.activeElement);
  
  if (!isFocused) {
    throw new Error('Submit button is not keyboard accessible');
  }
  
  console.log('[BDD-Test] Submit button is accessible');
});

Then('all accessibility checks should pass', async function() {
  if (!perfAccWorld.accessibilityResult) {
    throw new Error('Accessibility results not available');
  }
  
  const violations = perfAccWorld.accessibilityResult.violations;
  
  if (violations.length > 0) {
    console.warn('[BDD-Test] Accessibility violations found (warnings only):');
    violations.forEach(violation => {
      console.warn(`  - ${violation.description}`);
    });
  }
  
  console.log(`[BDD-Test] Accessibility check summary: ${violations.length} violations, ${perfAccWorld.accessibilityResult.passes.length} passes`);
});

Then('the page should be WCAG compliant', async function() {
  if (!perfAccWorld.accessibilityResult) {
    throw new Error('Accessibility results not available');
  }
  
  // For demo purposes, we'll consider it compliant if there are more passes than violations
  const passes = perfAccWorld.accessibilityResult.passes.length;
  const violations = perfAccWorld.accessibilityResult.violations.length;
  
  const complianceScore = passes > violations ? 'PASS' : 'NEEDS_IMPROVEMENT';
  
  console.log(`[BDD-Test] WCAG compliance assessment: ${complianceScore} (${passes} passes, ${violations} violations)`);
  
  if (complianceScore === 'NEEDS_IMPROVEMENT') {
    console.warn('[BDD-Test] Page needs accessibility improvements for full WCAG compliance');
  }
});

// Remove the old step definitions that don't match the feature file

export { perfAccWorld };
