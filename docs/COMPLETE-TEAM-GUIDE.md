# 🎯 Playwright Automation Framework - Complete Team Guide

## 📚 Table of Contents

1. [Framework Overview](#framework-overview)
2. [Quick Start Guide](#quick-start-guide)
3. [Detailed Setup Instructions](#detailed-setup-instructions)
4. [Framework Architecture](#framework-architecture)
5. [Writing Tests](#writing-tests)
6. [Best Practices](#best-practices)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Framework Overview

### What is This Framework?

This is a **production-ready Playwright automation framework** built with TypeScript, designed specifically for testing the **Bulktainer Logistics ERP System**. The framework follows enterprise-grade best practices and includes:

- ✅ **Page Object Model (POM)** for maintainable test code
- ✅ **Environment-based configuration** for different test environments
- ✅ **Secure credential management** using environment variables
- ✅ **Test prioritization** with tags (@critical, @smoke, @regression)
- ✅ **Comprehensive reporting** with Allure and HTML reports
- ✅ **CI/CD integration** with GitHub Actions
- ✅ **Data-driven testing** with JSON test data files

### Why Use This Framework?

1. **Maintainable**: Page Object Model keeps tests organized and reusable
2. **Secure**: No hardcoded credentials - everything in environment variables
3. **Fast**: Test prioritization runs critical tests in 2-3 minutes instead of 30+
4. **Reliable**: Built-in error handling, retries, and comprehensive logging
5. **Scalable**: Easy to add new tests and extend functionality

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** (v18 or higher)
- **Git** for version control
- **VS Code** (recommended IDE)
- **Access to Bulktainer ERP System**

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/jibinjoyqa/btl-playwright-automation.git
cd btl-playwright-automation
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
npx playwright install
\`\`\`

### 3. Set Up Environment Variables

\`\`\`bash
# Copy the environment template
cp .env.template .env

# Edit .env file with your credentials
\`\`\`

**Required Environment Variables:**
\`\`\`bash
# Application Settings
BASE_URL=https://your-erp-system.com
ENVIRONMENT=development

# Test User Credentials
TEST_USER_USERNAME=your-test-username
TEST_USER_PASSWORD=your-test-password

# Email Settings
TEST_EMAIL_DOMAIN=@digitalmesh.com
\`\`\`

### 4. Run Your First Test

\`\`\`bash
# Run critical tests only (fastest)
npm run test:critical

# Run specific test file
npx playwright test login.spec.ts

# Run with UI mode
npx playwright test --ui
\`\`\`

### 5. View Test Reports

\`\`\`bash
# Generate and open HTML report
npx playwright show-report

# Generate Allure report
npm run report:allure
\`\`\`

---

## 📋 Detailed Setup Instructions

### Step 1: Development Environment Setup

#### Install Node.js
\`\`\`bash
# Download from nodejs.org or use package manager
# For Windows with Chocolatey:
choco install nodejs

# For macOS with Homebrew:
brew install node

# Verify installation
node --version
npm --version
\`\`\`

#### Install VS Code Extensions
- **Playwright Test for VS Code** - Test runner integration
- **TypeScript** - Language support
- **GitLens** - Git integration
- **Thunder Client** - API testing (optional)

#### Clone and Setup Project
\`\`\`bash
# Clone repository
git clone https://github.com/jibinjoyqa/btl-playwright-automation.git
cd btl-playwright-automation

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Verify setup
npx playwright --version
\`\`\`

### Step 2: Environment Configuration

#### Create Environment Files

**For Development (.env):**
\`\`\`bash
# Application Configuration
BASE_URL=https://dev-erp.digitalmesh.com
ENVIRONMENT=development
TIMEOUT=30000

# Authentication
TEST_USER_USERNAME=dev_user@digitalmesh.com
TEST_USER_PASSWORD=DevPassword123!

# Email Configuration
TEST_EMAIL_DOMAIN=@digitalmesh.com

# Reporting
ALLURE_RESULTS_DIR=allure-results
SCREENSHOTS_ON_FAILURE=true
VIDEO_ON_FAILURE=true

# Database (if needed)
DB_CONNECTION_STRING=your-db-connection
\`\`\`

**For Staging (.env.staging):**
\`\`\`bash
BASE_URL=https://staging-erp.digitalmesh.com
ENVIRONMENT=staging
TEST_USER_USERNAME=staging_user@digitalmesh.com
TEST_USER_PASSWORD=StagingPassword123!
\`\`\`

**For Production (.env.production):**
\`\`\`bash
BASE_URL=https://erp.digitalmesh.com
ENVIRONMENT=production
TEST_USER_USERNAME=prod_user@digitalmesh.com
TEST_USER_PASSWORD=ProductionPassword123!
\`\`\`

#### Environment Validation
\`\`\`bash
# Validate environment setup
node scripts/validate-env.js

# Test environment connectivity
npm run test:env-check
\`\`\`

### Step 3: Understanding the Configuration

#### Playwright Configuration (playwright.config.ts)
\`\`\`typescript
// Key configuration settings:
export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Timeout settings
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  
  // Test execution
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  
  // Reporting
  reporter: [
    ['html'],
    ['allure-playwright'],
    ['junit', { outputFile: 'reports/junit-results.xml' }]
  ],
  
  // Global setup
  globalSetup: require.resolve('./src/utils/global-setup'),
  globalTeardown: require.resolve('./src/utils/global-teardown'),
  
  // Browser configurations
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
\`\`\`

---

## 🏗️ Framework Architecture

### Directory Structure

\`\`\`
btl-playwright-automation/
├── 📁 src/                        # Source code
│   ├── 📁 pages/                  # Page Object Model
│   │   ├── base.page.ts           # Base page class
│   │   ├── login.page.ts          # Login page
│   │   └── user-management.page.ts # User management
│   │
│   ├── 📁 utils/                  # Utility functions
│   │   ├── test-data-manager.ts   # Secure data management
│   │   ├── test-data-factory.ts   # Test data generation
│   │   ├── environment-config.ts  # Environment settings
│   │   ├── logger.ts              # Logging utility
│   │   └── api-utils.ts           # API helpers
│   │
│   └── 📁 fixtures/               # Test fixtures
│       └── test-fixtures.ts       # Custom fixtures
│
├── 📁 tests/                      # Test files
│   ├── login.spec.ts              # Login tests
│   ├── user-management.spec.ts    # User management tests
│   └── setup.setup.ts             # Global setup
│
├── 📁 data/                       # Test data
│   ├── login-data.json            # Login test data
│   ├── user-management-data.json  # User data
│   └── app-config.json            # App configuration
│
├── 📁 reports/                    # Test reports
│   ├── 📁 screenshots/            # Failure screenshots
│   ├── 📁 videos/                 # Test videos
│   └── 📁 logs/                   # Execution logs
│
└── 📁 .github/workflows/          # CI/CD pipelines
    ├── playwright-cicd.yml        # Main pipeline
    └── test-setup.yml             # Setup verification
\`\`\`

### Key Components

#### 1. Page Object Model (POM)

**Base Page (src/pages/base.page.ts):**
\`\`\`typescript
export class BasePage {
  protected page: Page;
  protected logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = Logger.getInstance();
  }

  // Common methods used across all pages
  async waitForPageLoad() { /* implementation */ }
  async takeScreenshot(name: string) { /* implementation */ }
  async handleError(error: Error) { /* implementation */ }
}
\`\`\`

**Login Page (src/pages/login.page.ts):**
\`\`\`typescript
export class LoginPage extends BasePage {
  // Locators
  private usernameInput = this.page.locator('#username');
  private passwordInput = this.page.locator('#password');
  private loginButton = this.page.locator('#login-btn');

  // Actions
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Verifications
  async isLoginSuccessful() {
    return await this.page.locator('.dashboard').isVisible();
  }
}
\`\`\`

#### 2. Test Data Management

**Secure Data Manager (src/utils/test-data-manager.ts):**
\`\`\`typescript
export class TestDataManager {
  // Get secure credentials from environment
  static getSecureCredentials() {
    return {
      username: process.env.TEST_USER_USERNAME!,
      password: process.env.TEST_USER_PASSWORD!
    };
  }

  // Load test data with environment substitution
  static async getSecureTestData(dataFile: string) {
    const data = await this.loadTestData(dataFile);
    return this.substituteEnvironmentVariables(data);
  }
}
\`\`\`

#### 3. Test Data Factory

**Data Factory (src/utils/test-data-factory.ts):**
\`\`\`typescript
export class TestDataFactory {
  // Generate unique user data
  static generateUserData() {
    const timestamp = Date.now();
    return {
      username: \`test_user_\${timestamp}\`,
      email: \`test\${timestamp}@digitalmesh.com\`,
      firstName: \`Test\${timestamp}\`,
      lastName: 'User',
      department: 'IT'
    };
  }

  // Generate test data for specific scenarios
  static getLoginData(scenario: string) {
    const scenarios = {
      'valid': { /* valid credentials */ },
      'invalid': { /* invalid credentials */ },
      'empty': { /* empty fields */ }
    };
    return scenarios[scenario];
  }
}
\`\`\`

---

## ✍️ Writing Tests

### Test Structure and Conventions

#### 1. Test File Organization

**File Naming Convention:**
- \`feature-name.spec.ts\` for test files
- \`feature-name.page.ts\` for page objects
- \`feature-name-data.json\` for test data

**Test Structure:**
\`\`\`typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';
import { TestDataManager } from '../src/utils/test-data-manager';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto('/login');
  });

  test('Should login with valid credentials @critical @smoke', async ({ page }) => {
    // Arrange
    const credentials = TestDataManager.getSecureCredentials();
    
    // Act
    await loginPage.login(credentials.username, credentials.password);
    
    // Assert
    await expect(loginPage.isLoginSuccessful()).toBeTruthy();
  });
});
\`\`\`

#### 2. Test Tags and Prioritization

**Available Tags:**
- \`@critical\` - Must-pass tests for core functionality
- \`@smoke\` - Quick validation tests
- \`@regression\` - Comprehensive feature tests
- \`@integration\` - Cross-system integration tests

**Usage Examples:**
\`\`\`typescript
// Critical test - runs in every build
test('User login @critical @smoke', async ({ page }) => {
  // Test implementation
});

// Regression test - runs in full test suite
test('User profile update @regression', async ({ page }) => {
  // Test implementation
});

// Integration test - runs in integration builds
test('API data sync @integration', async ({ page }) => {
  // Test implementation
});
\`\`\`

#### 3. Data-Driven Testing

**Using JSON Test Data:**
\`\`\`typescript
import userData from '../data/user-management-data.json';

test.describe('User Creation Tests', () => {
  userData.users.forEach((user, index) => {
    test(\`Create user with \${user.department} department @regression\`, async ({ page }) => {
      const userPage = new UserManagementPage(page);
      await userPage.createUser(user);
      await expect(userPage.getUserCreatedMessage()).toBeVisible();
    });
  });
});
\`\`\`

**Test Data File (data/user-management-data.json):**
\`\`\`json
{
  "users": [
    {
      "username": "test_user_${TIMESTAMP}",
      "email": "test_user_${TIMESTAMP}@digitalmesh.com",
      "firstName": "Test",
      "lastName": "User",
      "department": "IT",
      "role": "Admin"
    },
    {
      "username": "comm_user_${TIMESTAMP}",
      "email": "comm_user_${TIMESTAMP}@digitalmesh.com",
      "firstName": "Commercial",
      "lastName": "User",
      "department": "Commercial",
      "role": "User"
    }
  ]
}
\`\`\`

### Advanced Test Patterns

#### 1. Custom Fixtures

**Create Custom Fixtures (src/fixtures/test-fixtures.ts):**
\`\`\`typescript
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { UserManagementPage } from '../pages/user-management.page';

type TestFixtures = {
  loginPage: LoginPage;
  userPage: UserManagementPage;
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  userPage: async ({ page }, use) => {
    const userPage = new UserManagementPage(page);
    await use(userPage);
  },

  authenticatedPage: async ({ page }, use) => {
    // Auto-login for tests that need authentication
    const loginPage = new LoginPage(page);
    const credentials = TestDataManager.getSecureCredentials();
    
    await page.goto('/login');
    await loginPage.login(credentials.username, credentials.password);
    
    await use(page);
  }
});
\`\`\`

**Using Custom Fixtures:**
\`\`\`typescript
import { test } from '../src/fixtures/test-fixtures';

test('Create new user @critical', async ({ authenticatedPage, userPage }) => {
  // Test starts with user already logged in
  await userPage.navigateToUserManagement();
  
  const userData = TestDataFactory.generateUserData();
  await userPage.createUser(userData);
  
  await expect(userPage.getUserCreatedMessage()).toBeVisible();
});
\`\`\`

#### 2. API Testing Integration

**API Utilities (src/utils/api-utils.ts):**
\`\`\`typescript
export class ApiUtils {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = EnvironmentConfig.getApiBaseUrl();
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${process.env.API_TOKEN}\`
    };
  }

  async createUserViaAPI(userData: any) {
    const response = await fetch(\`\${this.baseURL}/api/users\`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  async deleteUserViaAPI(userId: string) {
    await fetch(\`\${this.baseURL}/api/users/\${userId}\`, {
      method: 'DELETE',
      headers: this.headers
    });
  }
}
\`\`\`

**Hybrid UI + API Tests:**
\`\`\`typescript
test('User creation with API validation @integration', async ({ page, userPage }) => {
  const apiUtils = new ApiUtils();
  const userData = TestDataFactory.generateUserData();

  // Create user via UI
  await userPage.createUser(userData);
  await expect(userPage.getUserCreatedMessage()).toBeVisible();

  // Validate via API
  const createdUser = await apiUtils.getUserByEmail(userData.email);
  expect(createdUser).toBeDefined();
  expect(createdUser.email).toBe(userData.email);

  // Cleanup via API
  await apiUtils.deleteUserViaAPI(createdUser.id);
});
\`\`\`

---

## 📋 Best Practices

### 1. Test Writing Best Practices

#### DO's:
✅ **Use Page Object Model** - Keep page logic separate from test logic
\`\`\`typescript
// Good
await loginPage.login(username, password);
await expect(loginPage.isLoginSuccessful()).toBeTruthy();

// Avoid
await page.fill('#username', username);
await page.fill('#password', password);
await page.click('#login-btn');
\`\`\`

✅ **Use Descriptive Test Names**
\`\`\`typescript
// Good
test('Should create user with IT department and admin role @critical', async ({ page }) => {

// Avoid
test('User test', async ({ page }) => {
\`\`\`

✅ **Use Environment Variables for Credentials**
\`\`\`typescript
// Good
const credentials = TestDataManager.getSecureCredentials();

// Avoid
const username = 'hardcoded@email.com';
const password = 'hardcodedpassword';
\`\`\`

✅ **Add Appropriate Tags for Test Prioritization**
\`\`\`typescript
test('Core login functionality @critical @smoke', async ({ page }) => {
test('Advanced user permissions @regression', async ({ page }) => {
\`\`\`

#### DON'Ts:
❌ **Don't use hardcoded waits**
\`\`\`typescript
// Avoid
await page.waitForTimeout(5000);

// Use instead
await expect(page.locator('.element')).toBeVisible();
\`\`\`

❌ **Don't hardcode test data in tests**
\`\`\`typescript
// Avoid
await userPage.createUser('john.doe@example.com', 'John', 'Doe');

// Use instead
const userData = TestDataFactory.generateUserData();
await userPage.createUser(userData);
\`\`\`

### 2. Page Object Best Practices

#### Locator Strategies:
\`\`\`typescript
export class UserManagementPage extends BasePage {
  // Good - Use data-testid for test-specific locators
  private createUserButton = this.page.locator('[data-testid="create-user-btn"]');
  
  // Good - Use semantic selectors for stable elements
  private userTable = this.page.locator('table[role="grid"]');
  
  // Avoid - CSS selectors that can change
  private badLocator = this.page.locator('.btn.btn-primary.user-create');
}
\`\`\`

#### Method Organization:
\`\`\`typescript
export class UserManagementPage extends BasePage {
  // 1. Locators (private)
  private createUserButton = this.page.locator('[data-testid="create-user-btn"]');
  
  // 2. Navigation methods
  async navigateToUserManagement() {
    await this.page.goto('/users');
    await this.waitForPageLoad();
  }
  
  // 3. Action methods
  async createUser(userData: UserData) {
    await this.createUserButton.click();
    await this.fillUserForm(userData);
    await this.submitForm();
  }
  
  // 4. Verification methods
  async isUserCreated(email: string): Promise<boolean> {
    return await this.page.locator(\`text=\${email}\`).isVisible();
  }
  
  // 5. Helper methods (private)
  private async fillUserForm(userData: UserData) {
    // Implementation
  }
}
\`\`\`

### 3. Test Data Management

#### Secure Credential Handling:
\`\`\`typescript
// Environment Variables (.env)
TEST_USER_USERNAME=user@digitalmesh.com
TEST_USER_PASSWORD=SecurePassword123!

// Test Data Manager
export class TestDataManager {
  static getSecureCredentials() {
    const username = process.env.TEST_USER_USERNAME;
    const password = process.env.TEST_USER_PASSWORD;
    
    if (!username || !password) {
      throw new Error('Test credentials not configured');
    }
    
    return { username, password };
  }
}
\`\`\`

#### Dynamic Test Data Generation:
\`\`\`typescript
export class TestDataFactory {
  static generateUniqueUser() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    
    return {
      username: \`test_user_\${timestamp}_\${random}\`,
      email: \`test\${timestamp}\${random}@digitalmesh.com\`,
      firstName: \`TestUser\${random}\`,
      lastName: 'AutoGenerated',
      department: this.getRandomDepartment()
    };
  }
  
  private static getRandomDepartment() {
    const departments = ['IT', 'Commercial', 'HR', 'Finance'];
    return departments[Math.floor(Math.random() * departments.length)];
  }
}
\`\`\`

### 4. Error Handling and Debugging

#### Comprehensive Error Handling:
\`\`\`typescript
export class BasePage {
  protected async handleError(action: string, error: Error) {
    // Take screenshot on error
    const screenshot = await this.takeScreenshot(\`error-\${action}\`);
    
    // Log error details
    this.logger.error(\`Error during \${action}\`, {
      error: error.message,
      stack: error.stack,
      screenshot: screenshot,
      url: this.page.url(),
      timestamp: new Date().toISOString()
    });
    
    // Re-throw error for test failure
    throw error;
  }
}
\`\`\`

#### Debug-Friendly Assertions:
\`\`\`typescript
// Good - Descriptive error messages
await expect(loginPage.errorMessage).toHaveText(
  'Invalid credentials', 
  { timeout: 5000 }
);

// Better - Custom assertion with context
await expect.soft(loginPage.errorMessage).toHaveText(
  'Invalid credentials',
  'Login should show error message for invalid credentials'
);
\`\`\`

---

## 🚀 CI/CD Pipeline

### GitHub Actions Configuration

The framework includes automated CI/CD pipelines that run tests on every code change and provide comprehensive reporting.

### 📊 **Viewing Test Results in GitHub**

#### **Method 1: GitHub Actions Artifacts** 📦

**Step 1: Navigate to Actions**
```
URL: https://github.com/jibinjoyqa/btl-playwright-automation/actions
```

**Step 2: Find Your Workflow Run**
- Click on "Playwright Tests" workflow
- Select the latest run (green ✅ = passed, red ❌ = failed)
- Look for runs triggered by your commits

**Step 3: View Job Results**
- See matrix results for different browsers/OS combinations
- Check individual job logs for detailed information
- View execution times and success rates

**Step 4: Download Test Artifacts**
```
Artifacts Section (bottom of workflow run):
├── playwright-report-ubuntu-latest-chromium
├── playwright-report-windows-latest-firefox  
├── test-results-critical-chromium
├── test-results-smoke-firefox
└── allure-results-merged
```

**Step 5: Open Reports Locally**
```bash
# Download artifact ZIP file
# Extract to local folder
# Open the HTML report
open playwright-report/index.html
```

#### **Method 2: GitHub Pages (Live Reports)** 🌐

**Access Live Reports**:
```
Live URL: https://jibinjoyqa.github.io/btl-playwright-automation/
```

**Features Available**:
- 📊 **Interactive Dashboard**: Real-time test metrics
- 🔍 **Detailed Test Results**: Step-by-step execution details  
- 📸 **Screenshots**: Failure screenshots with context
- 🎬 **Videos**: Test execution recordings
- 📈 **Trends**: Historical test performance
- 📝 **Logs**: Detailed execution logs

**Check Deployment Status**:
```
Go to: Repository Settings → Pages
Status: Should show "Your site is published at..."
```

#### **Method 3: Workflow Summary View** 📋

**Quick Results Overview**:
1. Click on any workflow run
2. View the summary dashboard showing:
   - ✅ Passed tests count
   - ❌ Failed tests count  
   - ⏱️ Execution duration
   - 🌐 Browser/OS matrix results

#### **Method 4: Pull Request Integration** 🔄

**Automatic PR Checks**:
- Test results appear automatically on Pull Requests
- See pass/fail status before merging
- Click "Details" link to view full reports
- Required status checks prevent merging failed tests

### 🎯 **Understanding Report Contents**

#### **HTML Report Features**:
```
📊 Test Dashboard
├── 📈 Execution Summary (pass/fail/skip counts)
├── ⏱️ Performance Metrics (execution times)
├── 🌐 Browser Breakdown (results per browser)
├── 📁 Test File Organization
├── 🔍 Filtering Options (@critical, @smoke, @regression)
└── 📱 Mobile-Friendly Interface
```

#### **Allure Report Features**:
```
📈 Advanced Analytics
├── 🎯 Test Execution Trends
├── 📊 Flaky Test Detection  
├── ⏱️ Duration Analysis
├── 🏷️ Category Breakdown (by tags)
├── 📸 Rich Media (screenshots/videos)
├── 📝 Step-by-Step Details
└── 🔄 Historical Comparisons
```

#### **Artifact Contents**:
```
Downloaded Artifacts Include:
├── 📄 playwright-report/ (HTML reports)
├── 📸 test-results/ (screenshots, videos)
├── 📊 allure-results/ (raw data)
├── 📋 junit-results.xml (CI integration)
└── 📝 execution.log (detailed logs)
```

#### Main Pipeline (`.github/workflows/playwright-cicd.yml`)

\`\`\`yaml
name: Playwright CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  # Test execution with matrix strategy
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        test-suite: [critical, smoke, regression]
        browser: [chromium, firefox, webkit]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm ci
        npx playwright install
    
    - name: Run tests
      env:
        BASE_URL: \${{ secrets.BASE_URL }}
        TEST_USER_USERNAME: \${{ secrets.TEST_USER_USERNAME }}
        TEST_USER_PASSWORD: \${{ secrets.TEST_USER_PASSWORD }}
      run: npm run test:\${{ matrix.test-suite }}
    
    - name: Upload test reports
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: test-results-\${{ matrix.test-suite }}-\${{ matrix.browser }}
        path: |
          reports/
          test-results/
\`\`\`

#### Repository Secrets Setup

Required secrets in GitHub repository settings:

1. **Go to Repository Settings → Secrets and Variables → Actions**
2. **Add the following secrets:**

\`\`\`
BASE_URL=https://your-erp-system.com
TEST_USER_USERNAME=your-test-user@digitalmesh.com
TEST_USER_PASSWORD=your-secure-password
TEST_EMAIL_DOMAIN=@digitalmesh.com
API_TOKEN=your-api-token (if needed)
\`\`\`

### Running Tests Locally vs CI

#### Local Development:
\`\`\`bash
# Run specific test suites
npm run test:critical    # Runs in 2-3 minutes
npm run test:smoke       # Runs in 5-10 minutes
npm run test:regression  # Runs in 20-30 minutes

# Run with specific browser
npx playwright test --project=chromium

# Run with UI mode for debugging
npx playwright test --ui

# Run specific test file
npx playwright test login.spec.ts
\`\`\`

#### CI Pipeline Execution:
- **Pull Request**: Runs critical and smoke tests
- **Main Branch**: Runs full regression suite
- **Scheduled**: Daily full test execution
- **Manual**: On-demand execution via workflow_dispatch

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Environment Setup Issues

**Issue**: \`Error: TEST_USER_USERNAME is not defined\`
\`\`\`bash
# Solution: Check your .env file
cat .env

# Ensure variables are set
echo $TEST_USER_USERNAME

# Validate environment
node scripts/validate-env.js
\`\`\`

**Issue**: \`Browser not installed\`
\`\`\`bash
# Solution: Install Playwright browsers
npx playwright install

# Install specific browser
npx playwright install chromium
\`\`\`

#### 2. Test Execution Issues

**Issue**: Tests failing due to timeouts
\`\`\`typescript
// Solution: Increase timeout in playwright.config.ts
export default defineConfig({
  timeout: 60 * 1000, // 60 seconds
  expect: {
    timeout: 10 * 1000 // 10 seconds for assertions
  }
});
\`\`\`

**Issue**: Element not found errors
\`\`\`typescript
// Solution: Use better waiting strategies
// Instead of:
await page.click('#button');

// Use:
await page.locator('#button').waitFor({ state: 'visible' });
await page.locator('#button').click();

// Or with expect:
await expect(page.locator('#button')).toBeVisible();
await page.locator('#button').click();
\`\`\`

#### 3. CI/CD Issues

**Issue**: Tests pass locally but fail in CI
\`\`\`yaml
# Solution: Check environment differences
# Add debug information in CI
- name: Debug environment
  run: |
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    echo "Playwright version: $(npx playwright --version)"
    echo "BASE_URL: $BASE_URL"
    
# Run tests with debug output
- name: Run tests with debug
  run: DEBUG=pw:* npm run test:critical
\`\`\`

#### 4. Reporting Issues

**Issue**: Reports not generating
\`\`\`bash
# Solution: Check reporter configuration
# Install Allure if missing
npm install -g allure-commandline

# Generate reports manually
npx playwright test --reporter=html
npx allure generate allure-results --clean -o allure-report
\`\`\`

### Debug Mode and Logging

#### Enable Debug Mode:
\`\`\`bash
# Enable Playwright debug mode
DEBUG=pw:* npx playwright test

# Enable browser in headed mode
npx playwright test --headed

# Slow down execution for debugging
npx playwright test --headed --slowMo=1000
\`\`\`

#### Use Built-in Logging:
\`\`\`typescript
import { Logger } from '../src/utils/logger';

test('Debug test execution', async ({ page }) => {
  const logger = Logger.getInstance();
  
  logger.info('Starting test execution');
  
  try {
    await page.goto('/login');
    logger.info('Navigated to login page');
    
    // Test steps with logging
    
  } catch (error) {
    logger.error('Test failed', { error: error.message });
    throw error;
  }
});
\`\`\`

### Performance Optimization

#### Test Execution Speed:
\`\`\`typescript
// Use test.describe.parallel for independent tests
test.describe.parallel('User Management Tests', () => {
  test('Create user', async ({ page }) => { /* test */ });
  test('Edit user', async ({ page }) => { /* test */ });
  test('Delete user', async ({ page }) => { /* test */ });
});

// Use authentication state storage
test.describe('Authenticated Tests', () => {
  test.use({ storageState: 'auth-states/user-auth.json' });
  
  test('Dashboard access', async ({ page }) => {
    // User is already logged in
  });
});
\`\`\`

---

## 📚 Additional Resources

### Learning Materials

1. **Playwright Documentation**: [playwright.dev](https://playwright.dev)
2. **TypeScript Handbook**: [typescriptlang.org](https://www.typescriptlang.org/docs/)
3. **Page Object Model Guide**: Internal framework examples
4. **CI/CD Best Practices**: GitHub Actions documentation

### Framework-Specific Resources

1. **Test Data Management**: \`src/utils/test-data-manager.ts\`
2. **Page Object Examples**: \`src/pages/\` directory
3. **Configuration Guide**: \`playwright.config.ts\` comments
4. **Environment Setup**: \`.env.template\` file

### Support and Contact

- **Framework Maintainer**: [Your Name/Team]
- **Internal Documentation**: [Your internal docs link]
- **Issue Tracking**: GitHub Issues
- **Team Communication**: [Your team channel]

---

## 🎉 Quick Reference

### Essential Commands
\`\`\`bash
# Setup
npm install && npx playwright install

# Testing
npm run test:critical     # Fast critical tests
npm run test:smoke        # Smoke tests  
npm run test:regression   # Full test suite
npx playwright test --ui  # Interactive mode

# Reporting
npx playwright show-report  # HTML report
npm run report:allure       # Allure report

# Debugging
npx playwright test --headed --slowMo=1000
DEBUG=pw:* npx playwright test
\`\`\`

### Test Tags
- \`@critical\` - Must-pass core functionality
- \`@smoke\` - Quick validation tests
- \`@regression\` - Comprehensive feature tests

### Environment Files
- \`.env\` - Development environment
- \`.env.staging\` - Staging environment  
- \`.env.production\` - Production environment

This framework is designed to be **maintainable**, **scalable**, and **reliable**. Follow these guidelines to ensure consistent, high-quality test automation! 🚀
