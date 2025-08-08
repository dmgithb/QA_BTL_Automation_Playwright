# Bulktainer ERP Automation Framework

A comprehensive Playwright automation framework built with TypeScript for testing the Bulktainer Logistics ERP System. This framework follows industry best practices including Page Object Model (POM), data-driven testing, comprehensive reporting, and advanced utilities.

## 🚀 Features

- **Page Object Model (POM)**: Clean separation of test logic and page interactions
- **Data-Driven Testing**: Support for JSON, CSV, and Excel test data
- **Multi-Browser Support**: Tests run on Chromium, Firefox, and WebKit
- **Comprehensive Reporting**: HTML, JSON, JUnit, and Allure reports
- **Advanced Logging**: Structured logging with Winston
- **CI/CD Ready**: GitHub Actions workflow included
- **Environment Configuration**: Flexible environment management with dotenv
- **Parallel Execution**: Configurable parallel test execution
- **Screenshot & Video**: Automatic capture on test failures
- **Authentication State**: Save and reuse login sessions
- **API Testing**: Built-in API utilities for backend testing
- **File Operations**: Comprehensive file handling utilities

## 📁 Project Structure

```
BTLPlaywright/
├── .github/
│   ├── workflows/
│   │   └── playwright.yml        # CI/CD workflow
│   └── copilot-instructions.md   # Copilot customization
├── src/
│   ├── pages/                    # Page Object Models
│   │   ├── base.page.ts          # Base page class
│   │   └── login.page.ts         # Login page object
│   ├── utils/                    # Utility classes
│   │   ├── config-manager.ts     # Configuration management
│   │   ├── logger.ts             # Logging utility
│   │   ├── test-data-manager.ts  # Test data handling
│   │   ├── api-utils.ts          # API testing utilities
│   │   ├── file-utils.ts         # File operations
│   │   ├── global-setup.ts       # Global test setup
│   │   └── global-teardown.ts    # Global test teardown
│   └── fixtures/
│       └── test-fixtures.ts      # Custom test fixtures
├── tests/
│   ├── login.spec.ts             # Login functionality tests
│   └── setup.ts                  # Environment setup tests
├── data/
│   ├── test-data.json            # JSON test data
│   └── login-test-data.csv       # CSV test data
├── config/                       # Configuration files
├── reports/                      # Test reports and artifacts
│   ├── screenshots/              # Test screenshots
│   ├── videos/                   # Test videos
│   ├── logs/                     # Log files
│   └── auth-states/              # Saved authentication states
├── .env                          # Environment variables
├── playwright.config.ts          # Playwright configuration
└── package.json                  # Project dependencies
```

## 🛠️ Installation

1. **Clone or initialize the project**:
   ```bash
   git clone <repository-url>
   cd BTLPlaywright
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers**:
   ```bash
   npm run install:browsers
   ```

4. **Install system dependencies** (Linux/macOS):
   ```bash
   npm run install:deps
   ```

## ⚙️ Configuration

### Environment Variables

Create or modify the `.env` file to configure your test environment:

```bash
# Application URLs
BASE_URL=https://training.bt-ms.com/MAIN-STAGE/erp.php
API_BASE_URL=https://training.bt-ms.com/api/v1

# Test Configuration
DEFAULT_TIMEOUT=30000
RETRY_COUNT=2
HEADLESS=false

# Browser Configuration
BROWSER=chromium
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080

# Parallel Execution
MAX_WORKERS=4
FULLY_PARALLEL=true

# Reporting
SCREENSHOT_MODE=only-on-failure
VIDEO_MODE=retain-on-failure
LOG_LEVEL=info
```

### Test Data

#### JSON Test Data (`data/test-data.json`)
```json
{
  "validUsers": [
    {
      "username": "admin",
      "password": "admin123",
      "role": "administrator"
    }
  ],
  "invalidUsers": [
    {
      "username": "invalid_user",
      "password": "wrong_password",
      "expectedError": "Invalid credentials"
    }
  ]
}
```

#### CSV Test Data (`data/login-test-data.csv`)
```csv
username,password,role,expectedResult,description
admin,admin123,administrator,success,Valid admin login
invalid_user,wrong_pass,user,failure,Invalid credentials
```

## 🚀 Running Tests

### Basic Test Execution

```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui
```

### Browser-Specific Tests

```bash
# Run tests on specific browsers
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Test Suites

```bash
# Run login tests only
npm run test:login

# Run setup tests
npm run test:setup
```

### Parallel Execution

```bash
# Run tests in parallel (4 workers)
npm run test:parallel

# Run tests serially (1 worker)
npm run test:serial
```

### Code Generation

```bash
# Generate test code for any website
npm run codegen

# Generate test code for login page
npm run codegen:login
```

## 📊 Reporting

### View Reports

```bash
# Show HTML report
npm run show-report

# Generate Allure report
npm run allure:generate

# Open Allure report
npm run allure:open

# Serve Allure report
npm run allure:serve
```

### Report Types

1. **HTML Report**: `reports/html-report/index.html`
2. **JSON Report**: `reports/test-results.json`
3. **JUnit Report**: `reports/junit-results.xml`
4. **Allure Report**: `allure-report/index.html`
5. **Logs**: `reports/logs/test-execution.log`

## 📝 Writing Tests

### Basic Test Structure

```typescript
import { test, expect, LoginPage } from '../src/fixtures/test-fixtures';

test.describe('Feature Tests', () => {
  test('Test case description', async ({ loginPage, logger }) => {
    // Test steps
    logger.step('Step description');
    await loginPage.navigateToLoginPage();
    
    // Assertions
    await expect(loginPage.usernameInput).toBeVisible();
  });
});
```

### Data-Driven Tests

```typescript
test('Data-driven test', async ({ loginPage, logger }) => {
  const testData = await TestDataManager.readCsvData('login-test-data');
  
  for (const data of testData) {
    logger.step(`Testing with: ${data.description}`);
    await loginPage.login(data.username, data.password);
    // Assertions based on data.expectedResult
  }
});
```

### Page Object Usage

```typescript
// Create new page object
export class DashboardPage extends BasePage {
  readonly welcomeMessage: Locator;
  
  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.locator('[data-testid="welcome"]');
  }
  
  async verifyWelcomeMessage(expectedText: string): Promise<void> {
    await this.verifyText(this.welcomeMessage, expectedText);
  }
}
```

## 🔧 Advanced Features

### Authentication State Management

```typescript
// Save authentication state
await TestHooks.saveAuthState(page, 'admin');

// Use saved state in test
test.use({ storageState: TestHooks.getAuthStateFile('admin') });
```

### API Testing

```typescript
import { ApiUtils } from '../src/utils/api-utils';

test('API test', async () => {
  const api = new ApiUtils();
  await api.init();
  
  const response = await api.get('/api/users');
  expect(response.status).toBe(200);
});
```

### File Operations

```typescript
import { FileUtils } from '../src/utils/file-utils';

// Read file content
const content = FileUtils.readFileAsString('data/config.json');

// Write to file
FileUtils.writeToFile('reports/results.txt', 'Test completed');
```

## 🐳 Docker Support

### Build Docker Image

```bash
npm run docker:build
```

### Run Tests in Docker

```bash
npm run docker:run
```

## 🔄 CI/CD Integration

The framework includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) that:

- Runs tests on multiple operating systems
- Executes tests in parallel
- Uploads test artifacts
- Publishes test reports
- Sends notifications on failure

### CI/CD Environment Variables

Set these secrets in your GitHub repository:

- `SLACK_WEBHOOK_URL`: For Slack notifications
- `BASE_URL`: Application URL for different environments

## 🧹 Maintenance

### Clean Up

```bash
# Clean all reports and artifacts
npm run clean

# Clean only screenshot and video reports
npm run clean:reports
```

### Update Dependencies

```bash
# Update Playwright
npm update @playwright/test

# Update all dependencies
npm update
```

## 🏗️ Best Practices

### Test Organization

1. **One feature per test file**
2. **Use descriptive test names**
3. **Group related tests with describe blocks**
4. **Use proper test data separation**

### Page Objects

1. **Extend BasePage for common functionality**
2. **Use descriptive locator names**
3. **Keep page-specific logic in page objects**
4. **Use explicit waits instead of hard delays**

### Test Data

1. **Separate test data from test logic**
2. **Use appropriate data formats (JSON/CSV/Excel)**
3. **Create reusable test data sets**
4. **Avoid hardcoded values in tests**

### Assertions

1. **Use meaningful assertion messages**
2. **Verify expected outcomes explicitly**
3. **Use custom matchers when appropriate**
4. **Group related assertions logically**

## 🐛 Troubleshooting

### Common Issues

1. **Tests timing out**:
   - Increase timeout in `.env` file
   - Check network connectivity
   - Verify application responsiveness

2. **Locators not found**:
   - Use browser developer tools
   - Try different locator strategies
   - Add explicit waits

3. **Tests failing in CI**:
   - Run tests in headless mode locally
   - Check environment-specific configurations
   - Verify CI environment setup

### Debug Mode

```bash
# Run single test in debug mode
npx playwright test tests/login.spec.ts --debug

# Run with browser developer tools
npx playwright test --headed --slowMo=1000
```

## 📖 Documentation

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Allure Framework](https://docs.qameta.io/allure/)
- [Winston Logger](https://github.com/winstonjs/winston)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions and support:

- Create an issue in the repository
- Contact the automation team
- Check the troubleshooting section

---

**Happy Testing! 🎭**
