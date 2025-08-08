# 🎭 Playwright Test Execution Commands - Complete Reference

## ✅ **ISSUE RESOLVED** 
Firefox and WebKit projects are now available! The error was due to commented-out browser configurations.

---

## 🚀 **Available Test Projects**

Your framework now supports these projects:

```bash
Available Projects:
├── 🏗️  setup                 # Environment setup and validation
├── 🚨  critical              # Must-pass tests (Chrome)
├── 🌐  chromium              # Full test suite (Chrome)
├── 🔄  regression            # Comprehensive tests (Chrome)
├── 💨  smoke                 # Quick validation (Chrome)
├── 🦊  firefox               # Full test suite (Firefox)
├── 🌍  webkit                # Full test suite (Safari)
├── 🚨  critical-firefox      # Critical tests (Firefox)
└── 🚨  critical-webkit       # Critical tests (Safari)
```

---

## 🎯 **Essential Test Commands**

### **Priority-Based Execution** (Recommended)
```bash
# 🚨 Critical tests - Run these first (2-3 minutes)
npm run test:critical

# 💨 Smoke tests - Essential functionality (5-10 minutes)
npm run test:smoke

# 🔄 Regression tests - Full validation (20-30 minutes)
npm run test:regression
```

### **Browser-Specific Testing**
```bash
# Chrome (Default)
npx playwright test --project=chromium
npm run test:chromium

# Firefox - NOW WORKING! 🦊
npx playwright test --project=firefox
npm run test:firefox

# Safari/WebKit 🌍
npx playwright test --project=webkit
npm run test:webkit

# All browsers in parallel 🌐
npm run test:all-browsers
```

### **Critical Tests Across Browsers**
```bash
# Critical tests in Chrome (default)
npm run test:critical

# Critical tests in Firefox 🦊
npm run test:critical-firefox

# Critical tests in Safari 🌍
npm run test:critical-webkit
```

---

## 🔧 **Development & Debugging**

### **Interactive Testing**
```bash
# UI Mode (Visual test runner)
npm run test:ui

# Debug mode (step-by-step)
npm run test:debug

# Headed mode (visible browser)
npm run test:headed

# Code generation
npm run codegen
```

### **Specific Test Files**
```bash
# Login tests only
npm run test:login

# User management tests
npm run test:user-management

# Security validation
npx playwright test security-validation.spec.ts

# Data factory validation
npm run test:factory-validation
```

### **Performance Options**
```bash
# Parallel execution (4 workers)
npm run test:parallel

# Serial execution (1 worker) - for debugging
npm run test:serial

# List tests without running
npx playwright test --list
```

---

## 📊 **Reporting Commands**

### **Generate Reports**
```bash
# HTML report (immediate)
npm run show-report

# Allure report (comprehensive)
npm run allure:generate
npm run allure:open

# Serve reports locally
npm run allure:serve
```

### **View Test Lists**
```bash
# List all Firefox tests
npx playwright test --project=firefox --list

# List critical tests
npx playwright test --project=critical --list

# List tests by grep pattern
npx playwright test --grep="@smoke" --list
```

---

## 🏷️ **Test Tag Filtering**

### **By Priority Tags**
```bash
# Critical tests only
npx playwright test --grep="@critical"

# Smoke tests only  
npx playwright test --grep="@smoke"

# Regression tests
npx playwright test --grep="@regression"
```

### **By Feature Tags**
```bash
# Email validation tests
npx playwright test --grep="@email"

# Navigation tests
npx playwright test --grep="@navigation"

# Factory pattern tests
npx playwright test --grep="@factory"
```

### **Exclude Tests**
```bash
# Skip specific tests
npx playwright test --grep-invert="@skip"

# Run all except extended tests
npx playwright test --grep-invert="@extended"
```

---

## 🌐 **Cross-Browser Testing Examples**

### **Single Browser**
```bash
# Test login in Firefox
npx playwright test login.spec.ts --project=firefox

# Test user management in Safari
npx playwright test user-management.spec.ts --project=webkit
```

### **Multiple Browsers**
```bash
# Critical tests across all browsers
npx playwright test --grep="@critical" --project=chromium --project=firefox --project=webkit

# Specific test file across browsers
npx playwright test login.spec.ts --project=firefox --project=webkit
```

### **Browser Matrix Testing**
```bash
# Run the same test across all browsers
for browser in chromium firefox webkit; do
  npx playwright test login.spec.ts --project=$browser
done
```

---

## 🛠️ **Environment-Specific Commands**

### **Different Environments**
```bash
# Development environment
npm test

# Staging environment
BASE_URL=https://staging.example.com npm test

# Production environment (read-only tests)
BASE_URL=https://prod.example.com npm run test:critical
```

### **CI/CD Commands**
```bash
# CI environment simulation
CI=true npm test

# Headless mode
HEADLESS=true npm test

# Maximum retries
RETRY_COUNT=3 npm test
```

---

## 📱 **Mobile & Device Testing**

### **Mobile Viewports** (If enabled)
```bash
# Mobile Chrome
npx playwright test --project="Mobile Chrome"

# Mobile Safari  
npx playwright test --project="Mobile Safari"

# Custom viewport
npx playwright test --config viewport='{"width":390,"height":844}'
```

---

## 🔍 **Troubleshooting Commands**

### **Validation Commands**
```bash
# Validate environment setup
npm run test:config-validation

# Check browser installations
npx playwright install --dry-run

# Verify project configuration
npx playwright test --list-projects
```

### **Debug Information**
```bash
# Show Playwright version
npx playwright --version

# Show installed browsers
npx playwright install --help

# Check configuration
cat playwright.config.ts | grep -A 10 "projects:"
```

---

## 🎯 **Quick Reference**

### **Most Common Commands**
```bash
# ⚡ Quick development testing
npm run test:critical

# 🦊 Test in Firefox
npm run test:firefox

# 🔍 Interactive debugging
npm run test:ui

# 📊 View last results
npm run show-report

# 🧹 Clean and restart
npm run clean && npm test
```

### **Before Committing Code**
```bash
# 1. Run critical tests
npm run test:critical

# 2. Run cross-browser critical tests
npm run test:critical-firefox

# 3. Check for any broken tests
npm run test:smoke

# 4. View results
npm run show-report
```

---

## 🎉 **Success!** 

Your Firefox testing is now fully functional! You can run:

```bash
npx playwright test --project=firefox
```

And all other browser combinations are available for comprehensive testing! 🚀
