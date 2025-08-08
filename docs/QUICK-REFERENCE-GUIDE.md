# 🚀 Playwright Quick Reference Guide

## 📋 Essential Commands

### Setup & Installation
```bash
# Initial setup
npm install
npx playwright install

# Install specific browser
npx playwright install chromium

# Update Playwright
npm update @playwright/test
npx playwright install
```

### Running Tests
```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test login.spec.ts

# Run tests by tag
npx playwright test --grep "@critical"
npx playwright test --grep "@smoke"
npx playwright test --grep "@regression"

# Run with specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run in headed mode (visible browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run with UI mode
npx playwright test --ui
```

### Framework-Specific Commands
```bash
# Test suites by priority
npm run test:critical      # 2-3 minutes
npm run test:smoke         # 5-10 minutes  
npm run test:regression    # 20-30 minutes

# Environment-specific runs
npm run test:dev
npm run test:staging
npm run test:prod

# Generate reports
npm run report:html
npm run report:allure
```

---

## 🏗️ Framework Structure Reference

### Directory Layout
```
btl-playwright-automation/
├── 📁 src/
│   ├── 📁 pages/          # Page Object Model
│   ├── 📁 utils/          # Utility functions
│   └── 📁 fixtures/       # Test fixtures
├── 📁 tests/              # Test files
├── 📁 data/               # Test data (JSON)
├── 📁 reports/            # Test reports
└── 📁 .github/workflows/  # CI/CD pipelines
```

### Key Files
- `playwright.config.ts` - Main configuration
- `.env` - Environment variables
- `package.json` - Dependencies and scripts
- `.gitignore` - Git ignore rules

---

## 📝 Code Templates

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';
import { TestDataManager } from '../src/utils/test-data-manager';

test.describe('Feature Name', () => {
  let page: Page;
  let featurePage: FeaturePage;

  test.beforeEach(async ({ page }) => {
    featurePage = new FeaturePage(page);
    // Setup code
  });

  test('Should perform action successfully @critical', async ({ page }) => {
    // Arrange
    const testData = TestDataManager.getTestData();
    
    // Act
    await featurePage.performAction(testData);
    
    // Assert
    await expect(featurePage.getSuccessMessage()).toBeVisible();
  });
});
```

### Page Object Template
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class FeaturePage extends BasePage {
  // Locators
  private element = this.page.locator('#element-id');
  private button = this.page.locator('button:has-text("Click Me")');
  
  constructor(page: Page) {
    super(page);
  }

  // Actions
  async performAction(data: any): Promise<void> {
    try {
      await this.element.fill(data.value);
      await this.button.click();
      this.logger.info('Action performed successfully');
    } catch (error) {
      await this.handleError('action-name', error as Error);
    }
  }

  // Verifications
  async getSuccessMessage(): Promise<Locator> {
    return this.page.locator('.success-message');
  }
}
```

### Data-Driven Test Template
```typescript
import testData from '../data/feature-test-data.json';

test.describe('Data-Driven Tests', () => {
  testData.scenarios.forEach((scenario, index) => {
    test(`${scenario.name} @data-driven`, async ({ page }) => {
      const data = TestDataManager.substituteVariables(scenario.data);
      
      await featurePage.performAction(data);
      
      if (scenario.expected === 'success') {
        await expect(featurePage.getSuccessMessage()).toBeVisible();
      } else {
        await expect(featurePage.getErrorMessage()).toBeVisible();
      }
    });
  });
});
```

---

## 🎯 Common Patterns

### Authentication
```typescript
// Using fixtures for auto-login
test.use({ storageState: 'auth-states/user-auth.json' });

// Manual login in test
test('Authenticated test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const credentials = TestDataManager.getSecureCredentials();
  
  await page.goto('/login');
  await loginPage.login(credentials.username, credentials.password);
  
  // Test continues with authenticated user
});
```

### Waiting Strategies
```typescript
// Wait for element to be visible
await expect(page.locator('#element')).toBeVisible();

// Wait for element to have text
await expect(page.locator('#status')).toHaveText('Completed');

// Wait for URL change
await expect(page).toHaveURL('/dashboard');

// Wait for network response
await page.waitForResponse(response => 
  response.url().includes('/api/users') && response.status() === 200
);
```

### Error Handling
```typescript
// Try-catch with screenshot
try {
  await page.click('#button');
} catch (error) {
  await page.screenshot({ path: 'error-screenshot.png' });
  throw error;
}

// Soft assertions (continue on failure)
await expect.soft(element1).toBeVisible();
await expect.soft(element2).toHaveText('Expected');
await expect(element3).toBeEnabled(); // This will still fail the test
```

---

## 🔧 Configuration Examples

### Browser Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

### Environment Configuration
```typescript
// Environment-specific settings
const config = {
  development: {
    baseURL: 'https://dev-app.digitalmesh.com',
    timeout: 30000,
  },
  staging: {
    baseURL: 'https://staging-app.digitalmesh.com',
    timeout: 60000,
  },
  production: {
    baseURL: 'https://app.digitalmesh.com',
    timeout: 30000,
  }
};

export default defineConfig({
  ...config[process.env.NODE_ENV || 'development'],
});
```

### Reporter Configuration
```typescript
export default defineConfig({
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['allure-playwright'],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
    ['json', { outputFile: 'reports/test-results.json' }]
  ],
});
```

---

## 🎭 Locator Strategies

### Best Practices
```typescript
// ✅ Recommended - Test IDs
page.locator('[data-testid="submit-button"]')

// ✅ Good - Semantic selectors
page.locator('button:has-text("Submit")')
page.locator('input[type="email"]')

// ✅ Acceptable - Role-based
page.locator('role=button[name="Submit"]')

// ❌ Avoid - CSS classes (fragile)
page.locator('.btn.btn-primary.submit-btn')

// ❌ Avoid - XPath (hard to maintain)
page.locator('//div[@class="container"]//button[1]')
```

### Dynamic Locators
```typescript
// Parameterized locators
getUserRow(email: string) {
  return this.page.locator(`tr:has-text("${email}")`);
}

// Conditional locators
getButton(isEnabled: boolean) {
  return isEnabled 
    ? this.page.locator('button:not([disabled])')
    : this.page.locator('button[disabled]');
}
```

---

## 📊 Test Tags Reference

### Standard Tags
- `@critical` - Must-pass tests (blocks release)
- `@smoke` - Quick validation tests
- `@regression` - Comprehensive feature tests
- `@integration` - Cross-system tests
- `@api` - API-focused tests
- `@ui` - UI-focused tests

### Custom Tags
- `@negative` - Negative test scenarios
- `@edge-case` - Edge case validation
- `@performance` - Performance-related tests
- `@security` - Security validation tests
- `@data-driven` - Data-driven test scenarios

### Usage Examples
```bash
# Run critical tests only
npx playwright test --grep "@critical"

# Run smoke and critical tests
npx playwright test --grep "@critical|@smoke"

# Exclude slow tests
npx playwright test --grep-invert "@slow"

# Run specific feature tests
npx playwright test --grep "@user-management.*@critical"
```

---

## 🌍 Environment Variables

### Required Variables
```bash
# Application
BASE_URL=https://your-app.com
ENVIRONMENT=development

# Authentication
TEST_USER_USERNAME=user@digitalmesh.com
TEST_USER_PASSWORD=secure-password

# Configuration
TIMEOUT=30000
HEADLESS=true
SCREENSHOTS_ON_FAILURE=true
```

### Optional Variables
```bash
# Reporting
ALLURE_RESULTS_DIR=allure-results
REPORT_DIR=reports

# Database (if needed)
DB_CONNECTION_STRING=connection-string

# API Testing
API_BASE_URL=https://api.your-app.com
API_TOKEN=your-api-token

# Notifications
SLACK_WEBHOOK_URL=slack-webhook
EMAIL_NOTIFICATIONS=true
```

---

## 🚨 Troubleshooting Guide

### Common Issues

#### Tests Timeout
```typescript
// Solution: Increase timeout
test.setTimeout(60000); // 60 seconds

// Or in config
export default defineConfig({
  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 }
});
```

#### Element Not Found
```typescript
// Solution: Better waiting
await page.locator('#element').waitFor({ state: 'visible' });
await expect(page.locator('#element')).toBeVisible();
```

#### Flaky Tests
```typescript
// Solution: Use proper waits
// Instead of:
await page.waitForTimeout(1000);

// Use:
await expect(page.locator('#loading')).toBeHidden();
await expect(page.locator('#content')).toBeVisible();
```

#### Environment Issues
```bash
# Check environment variables
node scripts/validate-env.js

# Verify browser installation
npx playwright install --dry-run

# Clear browser cache
rm -rf ~/.cache/ms-playwright
npx playwright install
```

### Debug Commands
```bash
# Run with debug info
DEBUG=pw:* npx playwright test

# Run single test in debug mode
npx playwright test login.spec.ts --debug

# Generate trace
npx playwright test --trace on

# Show trace
npx playwright show-trace trace.zip
```

---

## 📋 Checklists

### Pre-Test Checklist
- [ ] Environment variables configured
- [ ] Test data prepared
- [ ] Application accessible
- [ ] Dependencies installed
- [ ] Browsers installed

### Test Writing Checklist
- [ ] Descriptive test name
- [ ] Appropriate tags added
- [ ] AAA pattern followed
- [ ] Error handling included
- [ ] Assertions meaningful
- [ ] Test data externalized

### CI/CD Checklist
- [ ] Repository secrets configured
- [ ] Workflow file valid
- [ ] Test execution successful
- [ ] Reports generated
- [ ] Notifications working

---

## 🔗 Useful Links

### Documentation
- [Playwright Official Docs](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [GitHub Actions Guide](https://docs.github.com/en/actions)

### Framework Resources
- **Repository**: https://github.com/jibinjoyqa/btl-playwright-automation
- **Internal Docs**: `docs/` directory
- **Examples**: `tests/` directory
- **Support**: Team Slack channel

### Tools
- **VS Code Extension**: Playwright Test for VS Code
- **Allure Reports**: [Allure Framework](https://docs.qameta.io/allure/)
- **JSON Formatter**: Online JSON validators

---

*Keep this reference handy for quick lookups during test development! 📚*
