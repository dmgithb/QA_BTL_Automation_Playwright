# 🎯 Playwright Framework FAQ

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Framework Basics](#framework-basics)
3. [Test Writing](#test-writing)
4. [Page Objects](#page-objects)
5. [Test Data](#test-data)
6. [Configuration](#configuration)
7. [CI/CD & Deployment](#cicd--deployment)
8. [Debugging & Troubleshooting](#debugging--troubleshooting)
9. [Best Practices](#best-practices)
10. [Advanced Topics](#advanced-topics)

---

## 🚀 Getting Started

### Q: How do I set up the framework for the first time?

**A:** Follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/jibinjoyqa/btl-playwright-automation.git
cd btl-playwright-automation

# 2. Install dependencies
npm install
npx playwright install

# 3. Set up environment
cp .env.template .env
# Edit .env with your credentials

# 4. Verify setup
npm run test:critical
```

### Q: What are the system requirements?

**A:** 
- **Node.js**: v18 or higher
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Disk Space**: At least 2GB free space
- **Network**: Access to target application

### Q: Which browsers are supported?

**A:** The framework supports:
- ✅ **Chromium** (Chrome, Edge)
- ✅ **Firefox**
- ✅ **WebKit** (Safari)
- ✅ **Mobile browsers** (via device emulation)

### Q: How do I know if my setup is working correctly?

**A:** Run the validation script:

```bash
# Validate environment setup
node scripts/validate-env.js

# Run a simple test
npx playwright test login.spec.ts --headed
```

---

## 🏗️ Framework Basics

### Q: What is the Page Object Model and why do we use it?

**A:** Page Object Model (POM) is a design pattern where:

- **Each page** has its own class with locators and methods
- **Tests** interact with pages through these methods, not directly with elements
- **Benefits**: Better maintainability, reusability, and readability

**Example:**
```typescript
// Without POM (❌ Bad)
test('Login', async ({ page }) => {
  await page.fill('#username', 'user@example.com');
  await page.fill('#password', 'password');
  await page.click('#login-btn');
});

// With POM (✅ Good)
test('Login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('user@example.com', 'password');
});
```

### Q: How is the framework organized?

**A:** The framework follows a layered architecture:

```
📦 Framework Layers
├── 🧪 Test Layer (tests/)
├── 📄 Page Object Layer (src/pages/)
├── 🔧 Utility Layer (src/utils/)
└── 📊 Data Layer (data/)
```

### Q: What are the different types of tests in the framework?

**A:**
- **@critical**: Core functionality that must pass (2-3 min runtime)
- **@smoke**: Quick validation tests (5-10 min runtime)
- **@regression**: Comprehensive feature tests (20-30 min runtime)
- **@integration**: Cross-system tests
- **@api**: API-focused tests

---

## ✍️ Test Writing

### Q: How do I write my first test?

**A:** Follow this template:

```typescript
import { test, expect } from '@playwright/test';
import { FeaturePage } from '../src/pages/feature.page';

test.describe('Feature Tests', () => {
  let featurePage: FeaturePage;

  test.beforeEach(async ({ page }) => {
    featurePage = new FeaturePage(page);
    await page.goto('/feature');
  });

  test('Should perform action successfully @smoke', async ({ page }) => {
    // Arrange
    const testData = { value: 'test input' };
    
    // Act
    await featurePage.performAction(testData);
    
    // Assert
    await expect(featurePage.getSuccessMessage()).toBeVisible();
  });
});
```

### Q: How do I add test tags and why are they important?

**A:** Tags help categorize and run specific test subsets:

```typescript
test('Critical user login @critical @smoke', async ({ page }) => {
  // This test runs in both critical and smoke suites
});

test('Advanced user permissions @regression', async ({ page }) => {
  // This test only runs in regression suite
});
```

**Run specific tags:**
```bash
npm run test:critical    # Only @critical tests
npm run test:smoke       # Only @smoke tests
npm run test:regression  # Only @regression tests
```

### Q: How do I handle test data securely?

**A:** Use environment variables and the TestDataManager:

```typescript
// ✅ Secure way
const credentials = TestDataManager.getSecureCredentials();
await loginPage.login(credentials.username, credentials.password);

// ❌ Insecure way (never do this)
await loginPage.login('hardcoded@email.com', 'hardcodedpassword');
```

### Q: How do I write data-driven tests?

**A:** Use JSON files and loop through test scenarios:

```typescript
import testScenarios from '../data/user-scenarios.json';

testScenarios.users.forEach((user, index) => {
  test(`Create user: ${user.department} @data-driven`, async ({ page }) => {
    const userData = TestDataManager.substituteVariables(user);
    await userPage.createUser(userData);
    await expect(userPage.getSuccessMessage()).toBeVisible();
  });
});
```

---

## 📄 Page Objects

### Q: How do I create a new page object?

**A:** Follow this template:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class NewFeaturePage extends BasePage {
  // 1. Define locators
  private submitButton = this.page.locator('#submit');
  private inputField = this.page.locator('#input');
  
  constructor(page: Page) {
    super(page);
  }

  // 2. Action methods
  async fillAndSubmit(value: string): Promise<void> {
    try {
      await this.inputField.fill(value);
      await this.submitButton.click();
      this.logger.info('Form submitted successfully');
    } catch (error) {
      await this.handleError('form-submission', error as Error);
    }
  }

  // 3. Verification methods
  async getSuccessMessage(): Promise<Locator> {
    return this.page.locator('.success-message');
  }
}
```

### Q: What are the best practices for locators?

**A:** Use this priority order:

```typescript
// ✅ Best - Test IDs
this.page.locator('[data-testid="submit-btn"]')

// ✅ Good - Semantic attributes
this.page.locator('button:has-text("Submit")')
this.page.locator('input[type="email"]')

// ✅ Acceptable - Role-based
this.page.locator('role=button[name="Submit"]')

// ❌ Avoid - CSS classes (fragile)
this.page.locator('.btn.btn-primary')

// ❌ Avoid - Complex XPath
this.page.locator('//div[@class="container"]//button[1]')
```

### Q: How do I handle dynamic content in page objects?

**A:** Use parameterized methods and proper waiting:

```typescript
export class UserListPage extends BasePage {
  // Dynamic locator method
  getUserRow(email: string): Locator {
    return this.page.locator(`tr:has-text("${email}")`);
  }

  // Wait for dynamic content
  async waitForUserToAppear(email: string): Promise<void> {
    await expect(this.getUserRow(email)).toBeVisible({ timeout: 10000 });
  }
}
```

---

## 📊 Test Data

### Q: How do I manage test data effectively?

**A:** Use the framework's data management system:

**1. JSON Files for Static Data:**
```json
// data/user-test-data.json
{
  "validUsers": [
    {
      "username": "test_user_${TIMESTAMP}",
      "email": "test${TIMESTAMP}@digitalmesh.com",
      "department": "IT"
    }
  ]
}
```

**2. Factory Pattern for Dynamic Data:**
```typescript
// Generate unique data
const userData = TestDataFactory.generateUserData();

// Load data from files
const testData = await TestDataManager.getSecureTestData('user-test-data.json');
```

### Q: How do I handle sensitive data like passwords?

**A:** Always use environment variables:

```bash
# .env file
TEST_USER_USERNAME=user@digitalmesh.com
TEST_USER_PASSWORD=SecurePassword123!
```

```typescript
// In tests
const credentials = TestDataManager.getSecureCredentials();
// credentials.username and credentials.password are loaded from env
```

### Q: Can I use the same test data across different environments?

**A:** Yes! Use environment-specific configuration:

```typescript
// Environment-specific data
const config = EnvironmentConfig.getConfig();
const baseUrl = config.baseURL; // Different per environment
const userData = TestDataFactory.generateUserData();
userData.email = `test${Date.now()}@${config.emailDomain}`;
```

---

## ⚙️ Configuration

### Q: How do I configure the framework for different environments?

**A:** Use environment-specific files:

```bash
# Development
.env                 # Default development config

# Staging  
.env.staging         # Staging-specific config

# Production
.env.production      # Production-specific config
```

```bash
# Run with specific environment
NODE_ENV=staging npm run test:critical
NODE_ENV=production npm run test:smoke
```

### Q: How do I change browser settings?

**A:** Modify `playwright.config.ts`:

```typescript
export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        video: 'retain-on-failure',
        screenshot: 'only-on-failure'
      },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

### Q: How do I configure test timeouts?

**A:** Set timeouts at different levels:

```typescript
// Global timeout (playwright.config.ts)
export default defineConfig({
  timeout: 30 * 1000,           // 30 seconds per test
  expect: { timeout: 5000 },    // 5 seconds for assertions
});

// Test-level timeout
test.setTimeout(60000); // 60 seconds for this test

// Individual action timeout
await page.click('#button', { timeout: 10000 });
```

---

## 🚀 CI/CD & Deployment

### Q: How do I set up CI/CD for the framework?

**A:** The framework includes GitHub Actions workflows:

**1. Set up repository secrets:**
- Go to GitHub Repository → Settings → Secrets
- Add: `BASE_URL`, `TEST_USER_USERNAME`, `TEST_USER_PASSWORD`

**2. The pipeline runs automatically on:**
- Push to main/develop branches
- Pull requests
- Daily schedule (2 AM)
- Manual trigger

### Q: How do I run tests in different environments in CI/CD?

**A:** Use matrix strategy in GitHub Actions:

```yaml
strategy:
  matrix:
    environment: [development, staging, production]
    test-suite: [critical, smoke]

env:
  NODE_ENV: ${{ matrix.environment }}
  BASE_URL: ${{ secrets[format('BASE_URL_{0}', matrix.environment)] }}
```

### Q: How do I access test reports in CI/CD?

**A:** Reports are automatically generated and stored as artifacts:

- **HTML Report**: Available in GitHub Actions artifacts
- **Allure Report**: Generated and uploaded
- **JUnit Report**: For integration with other tools
- **Screenshots/Videos**: Attached on failures

---

## 🔍 Debugging & Troubleshooting

### Q: My test is failing, how do I debug it?

**A:** Use these debugging strategies:

```bash
# 1. Run in headed mode (visible browser)
npx playwright test failing-test.spec.ts --headed

# 2. Run with debug mode
npx playwright test failing-test.spec.ts --debug

# 3. Slow down execution
npx playwright test failing-test.spec.ts --headed --slowMo=1000

# 4. Enable verbose logging
DEBUG=pw:* npx playwright test failing-test.spec.ts
```

### Q: How do I handle flaky tests?

**A:** Common solutions for flaky tests:

```typescript
// ❌ Avoid hard waits
await page.waitForTimeout(5000);

// ✅ Use proper waiting strategies
await expect(page.locator('#element')).toBeVisible();
await expect(page.locator('#status')).toHaveText('Completed');

// ✅ Wait for network requests
await page.waitForResponse(resp => resp.url().includes('/api/data'));

// ✅ Use soft assertions for non-critical checks
await expect.soft(element).toBeVisible();
```

### Q: Tests pass locally but fail in CI/CD. Why?

**A:** Common CI/CD issues and solutions:

**1. Environment Differences:**
```yaml
# Add debug information
- name: Debug Environment
  run: |
    echo "Node: $(node --version)"
    echo "Browser: $(npx playwright --version)"
    echo "URL: $BASE_URL"
```

**2. Timing Issues:**
```typescript
// Increase timeouts for CI
const timeout = process.env.CI ? 60000 : 30000;
test.setTimeout(timeout);
```

**3. Resource Constraints:**
```yaml
# Reduce parallel execution
- name: Run Tests
  run: npx playwright test --workers=2
```

### Q: How do I capture screenshots and videos for debugging?

**A:** Configure in `playwright.config.ts`:

```typescript
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  }
});
```

Or in specific tests:
```typescript
test('Debug test', async ({ page }) => {
  // Take manual screenshot
  await page.screenshot({ path: 'debug-screenshot.png' });
  
  // Start tracing
  await page.context().tracing.start({ screenshots: true });
  
  // Test steps...
  
  // Stop tracing
  await page.context().tracing.stop({ path: 'trace.zip' });
});
```

---

## 💡 Best Practices

### Q: What are the top 10 best practices for this framework?

**A:**

1. **Use Page Object Model** - Keep page logic separate from tests
2. **Environment Variables** - Never hardcode credentials or URLs
3. **Descriptive Test Names** - Make test purpose clear
4. **Appropriate Tags** - Use @critical, @smoke, @regression correctly
5. **Proper Waiting** - Use expect() instead of waitForTimeout()
6. **Error Handling** - Implement try-catch with meaningful errors
7. **Test Independence** - Tests should not depend on each other
8. **Data Management** - Use TestDataFactory for dynamic data
9. **Consistent Structure** - Follow AAA pattern (Arrange, Act, Assert)
10. **Regular Maintenance** - Keep tests and framework updated

### Q: How do I write maintainable tests?

**A:** Follow these principles:

```typescript
// ✅ Good test structure
test('Should create user with IT department @critical', async ({ page }) => {
  // Arrange - Set up test data
  const userData = TestDataFactory.generateUserData();
  userData.department = 'IT';
  
  // Act - Perform the action
  await userPage.navigateToUserManagement();
  await userPage.createUser(userData);
  
  // Assert - Verify the outcome
  await expect(userPage.getSuccessMessage()).toBeVisible();
  await expect(userPage.isUserInTable(userData.email)).toBeTruthy();
});
```

### Q: How often should I run different test suites?

**A:** Recommended schedule:

- **@critical**: Every code commit (2-3 minutes)
- **@smoke**: Every pull request (5-10 minutes)
- **@regression**: Daily or before releases (20-30 minutes)
- **@integration**: Weekly or before major releases

---

## 🚀 Advanced Topics

### Q: How do I test APIs along with UI?

**A:** Use the built-in API utilities:

```typescript
import { ApiUtils } from '../src/utils/api-utils';

test('Hybrid UI + API test', async ({ page }) => {
  const apiUtils = new ApiUtils();
  
  // Create user via UI
  await userPage.createUser(userData);
  
  // Verify via API
  const createdUser = await apiUtils.getUserByEmail(userData.email);
  expect(createdUser).toBeDefined();
  
  // Cleanup via API
  await apiUtils.deleteUser(createdUser.id);
});
```

### Q: How do I test on mobile devices?

**A:** Use device emulation:

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'Mobile Chrome',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12 Safari'] },
    },
  ],
});

// Run mobile tests
npx playwright test --project="Mobile Chrome"
```

### Q: How do I extend the framework with custom utilities?

**A:** Create utilities following the framework pattern:

```typescript
// src/utils/custom-utility.ts
export class CustomUtility {
  private logger = Logger.getInstance();
  
  async performCustomAction(data: any): Promise<any> {
    try {
      this.logger.info('Performing custom action', { data });
      // Implementation
      return result;
    } catch (error) {
      this.logger.error('Custom action failed', { error });
      throw error;
    }
  }
}

// Use in tests
const customUtil = new CustomUtility();
const result = await customUtil.performCustomAction(testData);
```

### Q: How do I contribute improvements to the framework?

**A:** Follow these steps:

1. **Fork** the repository
2. **Create** a feature branch
3. **Implement** your improvement
4. **Add tests** for your changes
5. **Update documentation**
6. **Submit** a pull request

**Example contribution areas:**
- New utility functions
- Enhanced error handling
- Additional reporting features
- Performance optimizations

---

## 🆘 Common Error Messages

### Q: "Error: TEST_USER_USERNAME is not defined"

**A:** Set up your environment variables:

```bash
# Check if .env file exists
ls -la .env

# Copy template if missing
cp .env.template .env

# Edit with your credentials
# Validate setup
node scripts/validate-env.js
```

### Q: "Error: Browser executable not found"

**A:** Install Playwright browsers:

```bash
npx playwright install
# Or specific browser
npx playwright install chromium
```

### Q: "TimeoutError: Waiting for selector"

**A:** Improve your waiting strategy:

```typescript
// Instead of:
await page.click('#button');

// Use:
await expect(page.locator('#button')).toBeVisible();
await page.locator('#button').click();
```

### Q: "Test results vary between runs"

**A:** Fix flaky tests:

```typescript
// Add proper waits
await expect(page.locator('#loading')).toBeHidden();
await expect(page.locator('#content')).toBeVisible();

// Use stable locators
await page.locator('[data-testid="stable-element"]').click();
```

---

## 📞 Getting Help

### Q: Where can I get support?

**A:**
- **Documentation**: `docs/` directory in the repository
- **Examples**: Check `tests/` directory for patterns
- **Issues**: Create GitHub issues for bugs
- **Team Chat**: Internal Slack/Teams channels
- **Training**: Refer to `TEAM-TRAINING-WORKSHOP.md`

### Q: How do I stay updated with framework changes?

**A:**
- **Watch** the GitHub repository
- **Review** release notes
- **Attend** team knowledge sharing sessions
- **Subscribe** to framework announcements

---

*This FAQ covers the most common questions about the BTL Playwright Framework. For specific issues not covered here, please reach out to the framework team! 🚀*
