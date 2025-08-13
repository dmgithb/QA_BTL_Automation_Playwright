# QA Playwright Automation Framework

A comprehensive enterprise-grade Playwright automation framework built with TypeScript. This framework follows industry best practices including **Behavior Driven Development (BDD)**, Page Object Model (POM), data-driven testing, comprehensive reporting, advanced utilities, secure credential management, test prioritization, and complete CI/CD integration.

## 🚀 **Framework Highlights**

### 🏆 **Enterprise-Grade Features**
- **Security First**: Environment-based credential management with zero credential exposure
- **BDD/Cucumber Integration**: Complete Behavior Driven Development with readable Gherkin scenarios
- **Test Prioritization**: @critical/@smoke/@regression tags with optimized execution
- **Production Ready**: Complete CI/CD pipeline with GitHub Actions and matrix strategy
- **Team Focused**: Comprehensive documentation suite for training and knowledge transfer
- **Performance Optimized**: Critical tests run in minutes vs hours for full suite

### 🎯 **Core Capabilities**

- **BDD/Cucumber Integration**: Complete Behavior Driven Development with Gherkin syntax and Cucumber.js
- **Page Object Model (POM)**: Clean separation of test logic and page interactions with enterprise architecture
- **Secure Data Management**: Environment-based credentials with JSON test data and Factory pattern
- **Test Prioritization**: @critical, @smoke, @regression tags for optimized test execution
- **Multi-Browser Support**: Tests run on Chromium, Firefox, and WebKit with parallel execution
- **Comprehensive Reporting**: HTML, JSON, JUnit, and Allure reports with detailed insights
- **Advanced Logging**: Structured logging with Winston and detailed test execution tracking
- **CI/CD Ready**: Complete GitHub Actions workflow with matrix strategy and secure environment handling
- **Environment Configuration**: Flexible environment management with secure credential access
- **Parallel Execution**: Configurable parallel test execution with performance optimization
- **Screenshot & Video**: Automatic capture on test failures with comprehensive debugging support
- **Authentication State**: Save and reuse login sessions with secure state management
- **API Testing**: Built-in API utilities for comprehensive backend testing
- **File Operations**: Comprehensive file handling utilities with data management capabilities

## 📁 Project Structure

```
├── .github/workflows/     # CI/CD pipeline configuration
├── config/               # Environment and test configuration
├── data/                 # Test data files (JSON/CSV)
├── docs/                 # Framework documentation
├── features/             # BDD/Cucumber feature files
├── reports/              # Generated test reports
├── scripts/              # Utility scripts
├── src/
│   ├── pages/           # Page Object Model classes
│   ├── utils/           # Utility functions and helpers
│   └── types/           # TypeScript type definitions
├── tests/               # Playwright test files
├── docker-compose.yml   # Docker configuration
├── cucumber.config.js   # Cucumber configuration
├── playwright.config.ts # Playwright configuration
└── tsconfig.json       # TypeScript configuration
```

## 🛠️ Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: Latest version

## ⚡ Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/dmgithb/QA_BTL_Automation_Playwright.git
cd QA_BTL_Automation_Playwright

# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
```

Required environment variables:
```bash
# Application URLs
BASE_URL=https://your-app-url.com
API_BASE_URL=https://your-api-url.com/api/v1

# Test Configuration
DEFAULT_TIMEOUT=30000
HEADLESS=false

# Credentials (use environment variables, never commit to git)
TEST_USER_USERNAME=your_username
TEST_USER_PASSWORD=your_password
```

### 3. Run Tests

```bash
# Run critical tests (recommended for quick feedback)
npm test

# Run all tests
npm run test:all

# Run tests with specific tags
npm run test:smoke
npm run test:regression

# Run tests in headed mode (see browser)
npm run test:headed

# Run BDD/Cucumber tests
npm run bdd
npm run bdd:smoke
```

## 🎯 Test Execution Commands

### Playwright Tests

```bash
# Quick test runs
npm test                    # Critical tests only (fast)
npm run test:critical      # Critical tests
npm run test:smoke         # Smoke tests
npm run test:regression    # Regression tests

# Browser-specific tests
npm run test:chromium      # Chromium only
npm run test:firefox       # Firefox only
npm run test:webkit        # WebKit only
npm run test:all-browsers  # All browsers

# Debug and development
npm run test:headed        # See browser during tests
npm run test:debug         # Debug mode
npm run test:ui            # Playwright UI mode
```

### BDD/Cucumber Tests

```bash
# BDD test execution
npm run bdd                # All BDD tests
npm run bdd:smoke          # BDD smoke tests
npm run bdd:critical       # BDD critical tests
npm run bdd:login          # Login feature tests
```

### Reports and Analysis

```bash
# Generate and view reports
npm run show-report        # Open latest HTML report
npm run allure:generate    # Generate Allure report
npm run allure:open        # Open Allure report
npm run clean              # Clean all reports
```

## 🧪 Writing Tests

### Page Object Model Example

```typescript
// src/pages/login.page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { ConfigManager } from '../utils/config-manager';

export class LoginPage extends BasePage {
  readonly url = `${ConfigManager.BASE_URL}/login`;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('#submit');
  }

  async login(username: string, password: string) {
    await this.navigate();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### Test Example

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';
import { TestDataFactory } from '../src/utils/test-data-factory';

test.describe('Login Tests @critical', () => {
  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const validUser = await TestDataFactory.getValidUser();
    
    await loginPage.login(validUser.username, validUser.password);
    
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

### BDD Feature Example

```gherkin
# features/login.feature
Feature: User Login
  As a user
  I want to login to the application
  So that I can access my account

  @critical @smoke
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid credentials
    Then I should be redirected to the dashboard
```

## 🔧 Configuration

### Test Prioritization

Use tags to prioritize test execution:

- `@critical` - Essential functionality (runs first)
- `@smoke` - Basic functionality verification
- `@regression` - Comprehensive testing
- `@extended` - Extended test coverage

### Environment Management

```typescript
// config/environments.ts
export const environments = {
  test: {
    baseUrl: process.env.BASE_URL,
    apiUrl: process.env.API_BASE_URL
  },
  staging: {
    baseUrl: process.env.STAGING_BASE_URL,
    apiUrl: process.env.STAGING_API_BASE_URL
  }
};
```

## 📊 Reporting

The framework generates multiple report types:

- **HTML Report**: Interactive test results with screenshots
- **JSON Report**: Machine-readable test results
- **JUnit Report**: CI/CD integration format
- **Allure Report**: Advanced analytics and trends
- **BDD Report**: Cucumber-specific reporting

## 🐳 Docker Support

```bash
# Build and run with Docker
npm run docker:build
npm run docker:run

# Use Docker Compose
npm run docker:compose:up
npm run docker:test
```

## 🔒 Security Best Practices

1. **Never commit credentials**: Use environment variables
2. **Secure test data**: Use data factories and templates
3. **Authentication state**: Secure session management
4. **Sensitive data masking**: Automatic PII protection
5. **Environment isolation**: Separate configs per environment

## 🚀 CI/CD Integration

The framework includes GitHub Actions workflows for:

- **Pull Request Testing**: Run critical tests on PRs
- **Scheduled Testing**: Daily regression tests
- **Multi-browser Testing**: Matrix strategy for browser coverage
- **Report Publishing**: Automatic GitHub Pages deployment

## 📚 Documentation

- **[Framework FAQ](./docs/FRAMEWORK-FAQ.md)** - Frequently asked questions
- **[Quick Reference](./docs/QUICK-REFERENCE-GUIDE.md)** - Command reference
- **[CI/CD Setup](./docs/CICD-SETUP-GUIDE.md)** - CI/CD configuration guide
- **[Security Guide](./docs/SECURITY.md)** - Security best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes following the coding standards
4. Write tests for new functionality
5. Run the test suite: `npm test`
6. Commit your changes: `git commit -m 'Add feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions and support:

1. Check the [Framework FAQ](./docs/FRAMEWORK-FAQ.md)
2. Review the [Quick Reference Guide](./docs/QUICK-REFERENCE-GUIDE.md)
3. Create an issue in the repository
4. Contact the QA team

---

## 🎯 Quick Commands Reference

```bash
# Essential commands
npm test                   # Run critical tests
npm run test:headed       # Run with browser visible
npm run bdd:smoke         # Run BDD smoke tests
npm run allure:serve      # View detailed reports
npm run clean             # Clean all reports

# Development commands
npm run test:debug        # Debug tests
npm run test:ui           # Playwright UI mode
npm run codegen           # Generate test code
```

**Happy Testing! 🚀**