# Quick Start Guide

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### 2. Setup
```bash
npm install
npm run install:browsers
```

### 3. Run Your First Test
```bash
# Basic test run
npm test

# Run with visible browser
npm run test:headed

# Run specific test
npm run test:login
```

### 4. View Reports
```bash
# HTML Report
npm run show-report

# Allure Report
npm run allure:serve
```

## 📋 Common Commands

### Testing
```bash
npm test                    # Run all tests
npm run test:debug         # Debug mode
npm run test:ui            # Interactive UI mode
npm run test:chromium      # Chrome only
npm run test:parallel      # Parallel execution
```

### Code Generation
```bash
npm run codegen            # Generate test code
npm run codegen:login      # For login page
```

### Reporting
```bash
npm run allure:generate    # Generate Allure report
npm run allure:open        # Open Allure report
npm run clean              # Clean all reports
```

## 🏗️ Creating New Tests

### 1. Create Test File
```typescript
// tests/my-feature.spec.ts
import { test, expect, LoginPage } from '../src/fixtures/test-fixtures';

test.describe('My Feature', () => {
  test('should work', async ({ page, logger }) => {
    logger.step('Test step description');
    // Your test logic here
  });
});
```

### 2. Create Page Object
```typescript
// src/pages/my-page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class MyPage extends BasePage {
  readonly someElement: Locator;

  constructor(page: Page) {
    super(page);
    this.someElement = page.locator('[data-testid="some-element"]');
  }

  async performAction(): Promise<void> {
    await this.clickElement(this.someElement);
  }
}
```

### 3. Add Test Data
```json
// data/my-data.json
{
  "testCases": [
    {
      "name": "Test Case 1",
      "input": "value1",
      "expected": "result1"
    }
  ]
}
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
BASE_URL=https://your-app.com
HEADLESS=false
MAX_WORKERS=4
SCREENSHOT_MODE=only-on-failure
```

### Test Configuration (playwright.config.ts)
- Modify browser settings
- Change reporters
- Update timeouts
- Set base URLs

## 📊 Best Practices

### 1. Test Organization
- One feature per test file
- Use descriptive test names
- Group related tests with describe blocks

### 2. Page Objects
- Extend BasePage
- Use explicit waits
- Keep page logic separate

### 3. Test Data
- Use JSON/CSV for data
- Avoid hardcoded values
- Create reusable datasets

### 4. Assertions
- Use meaningful messages
- Verify expected outcomes
- Group related assertions

## 🐛 Troubleshooting

### Common Issues
1. **Tests timing out**: Increase timeout in .env
2. **Elements not found**: Check locators with browser devtools
3. **CI failures**: Run headless mode locally to debug

### Debug Commands
```bash
npx playwright test --debug                    # Debug mode
npx playwright test --headed --slowMo=1000     # Slow motion
npx playwright show-trace trace.zip            # View trace
```

## 📞 Support
- Check the main README.md for detailed documentation
- View test reports for error details
- Use browser developer tools for locator issues
