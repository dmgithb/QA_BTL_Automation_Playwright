# Test Execution Commands - User Guide

## 🚀 Quick Start Commands

### Normal Daily Development
```bash
# Default execution - runs only critical tests (3-5 minutes)
npm test

# Alternative syntax
npm run test:critical
```

### Specific Test Categories
```bash
# Smoke tests - ultra-fast validation (1-2 minutes)
npm run test:smoke

# Regression tests - comprehensive feature validation (10-15 minutes)
npm run test:regression

# Extended tests - edge cases and comprehensive validation (20-30 minutes)
npm run test:extended

# Full test suite - all tests (30+ minutes)
npm run test:all
```

### Development and Debugging
```bash
# Run tests in headed mode (see browser)
npm run test:headed

# Debug mode with step-by-step execution
npm run test:debug

# Interactive UI mode
npm run test:ui

# Specific test file execution
npm run test:user-management
npm run test:factory-validation
npm run test:email-validation
```

## 🏷️ Tag-Based Execution

### Using Playwright CLI with Tags
```bash
# Critical tests only (recommended for normal execution)
npx playwright test --grep "@critical"

# Smoke tests
npx playwright test --grep "@smoke"

# Regression suite
npx playwright test --grep "@regression"

# Extended tests
npx playwright test --grep "@extended"

# Specific feature tests
npx playwright test --grep "@email"
npx playwright test --grep "@factory"
npx playwright test --grep "@navigation"
npx playwright test --grep "@department"

# Combine tags
npx playwright test --grep "@critical|@regression"

# Exclude specific tests
npx playwright test --grep "@critical" --grep-invert "@skip"
```

## 📊 Execution Patterns by Scenario

### 1. Developer Workflow (Daily)
```bash
# Quick validation during development
npm test

# With visual feedback
npm run test:headed
```

### 2. Pull Request Validation
```bash
# Standard PR validation
npm run test:regression
```

### 3. Feature Development
```bash
# Test specific functionality
npx playwright test --grep "@email|@factory"
npx playwright test tests/user-management.spec.ts
```

### 4. Nightly Build / CI/CD
```bash
# Comprehensive testing
npm run test:all
```

### 5. Release Validation
```bash
# Full test suite across all browsers
npm run test:all-browsers
```

## 🎯 Project-Based Execution

### Available Projects
```bash
# Critical tests only (default)
npx playwright test --project=critical

# Full Chrome test suite
npx playwright test --project=chromium

# Smoke tests
npx playwright test --project=smoke

# Regression tests
npx playwright test --project=regression
```

## 📈 Performance Optimization

### Parallel Execution
```bash
# Run with 4 workers (faster)
npm run test:parallel

# Run serially (debugging)
npm run test:serial

# Custom worker count
npx playwright test --workers=2
```

### Browser Selection
```bash
# Chrome only (fastest)
npx playwright test --project=chromium

# Specific browser
npx playwright test --project=firefox
npx playwright test --project=webkit

# All browsers
npm run test:all-browsers
```

## 🔧 Configuration Options

### Environment Variables
```bash
# Headless mode
HEADLESS=false npm test

# Custom timeout
DEFAULT_TIMEOUT=60000 npm test

# Different environment
ENV=staging npm test

# Video recording
VIDEO_MODE=on npm test
```

### Reporter Selection
```bash
# HTML report only
npx playwright test --reporter=html

# List reporter (terminal output)
npx playwright test --reporter=list

# Multiple reporters
npx playwright test --reporter=list,html,allure-playwright
```

## 📋 Recommended Usage

### For Different User Types

#### **QA Engineers**
```bash
# Daily validation
npm test

# Feature testing
npm run test:regression

# Bug verification
npm run test:headed
```

#### **Developers**
```bash
# Quick feedback
npm test

# Development debugging
npm run test:debug

# Specific feature testing
npx playwright test tests/user-management.spec.ts --headed
```

#### **DevOps/CI**
```bash
# Pipeline stages
npm run test:smoke        # Stage 1: Quick validation
npm run test:regression   # Stage 2: Feature validation
npm run test:all         # Stage 3: Full validation
```

#### **Release Managers**
```bash
# Pre-release validation
npm run test:all-browsers

# Critical path verification
npm run test:critical
```

## 🚨 Troubleshooting

### Common Issues
```bash
# Install dependencies
npm run install:browsers

# Clean reports
npm run clean

# Type checking
npm run lint

# Specific test debugging
npx playwright test tests/user-management.spec.ts --debug --headed
```

### Performance Tips
1. Use `npm test` for daily development (fastest)
2. Use `--project=critical` for quick feedback
3. Use `--headed` only when needed for debugging
4. Use `--workers=1` for debugging flaky tests
5. Use tag-based execution for specific features

---
**Default Command**: `npm test` runs only critical tests for optimal development workflow!
