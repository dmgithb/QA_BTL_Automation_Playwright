# 🚀 Quick CI/CD Test Execution Guide

## 🎯 **Run Only Smoke Tests in CI/CD**

### **Method 1: Dedicated Smoke Test Workflow**

A dedicated `smoke-tests.yml` workflow has been created that:
- ✅ **Runs automatically** on every push to main/develop
- ✅ **Executes every 2 hours** during business hours (9 AM - 5 PM, weekdays)
- ✅ **Finishes in ~2-3 minutes** (much faster than full test suite)
- ✅ **Can be triggered manually** with custom browser selection

**Automatic Triggers:**
```bash
# Smoke tests run automatically when you push code:
git push origin main
```

**Manual Trigger:**
1. Go to: `https://github.com/jibinjoyqa/btl-playwright-automation/actions`
2. Click "Smoke Tests" workflow
3. Click "Run workflow"
4. Select browser (chromium, firefox, webkit, or all)
5. Click "Run workflow" button

### **Method 2: Enhanced Main Workflow**

The main `playwright.yml` workflow now supports test type selection:

**Manual Trigger:**
1. Go to: `https://github.com/jibinjoyqa/btl-playwright-automation/actions`
2. Click "Playwright Tests" workflow
3. Click "Run workflow"
4. **Select "smoke" from test type dropdown**
5. Select browser
6. Click "Run workflow"

## 🏃‍♂️ **Local Commands for Testing**

Before pushing to CI/CD, test your smoke tests locally:

```bash
# Run smoke tests locally - Chromium
npm run test:smoke

# Run smoke tests locally - Firefox  
npm run test:smoke:firefox

# Run smoke tests locally - All browsers
npm run test:smoke && npm run test:smoke:firefox

# Quick smoke test (critical tests only)
npm run test:critical
```

## 📊 **CI/CD Test Execution Matrix**

| Trigger Method | Tests Run | Duration | Browsers | When to Use |
|---------------|-----------|----------|----------|-------------|
| **Smoke Workflow** | @smoke only | 2-3 min | Configurable | Quick validation |
| **Main + Smoke** | @smoke only | 3-5 min | Multiple OS | Manual smoke runs |
| **Main + Critical** | @critical only | 5-8 min | Multiple OS | Pre-release validation |
| **Main + Regression** | @regression only | 20-30 min | Multiple OS | Full feature testing |
| **Main + All** | All tests | 30-45 min | Multiple OS | Complete validation |

## 🔧 **Workflow Configuration**

### **Smoke Test Schedule**
```yaml
# Runs every 2 hours during business hours
schedule:
  - cron: '0 9,11,13,15,17 * * 1-5'  # 9 AM to 5 PM, weekdays
```

### **Test Type Selection**
```yaml
# In main workflow, you can select:
test_type:
  - critical   # ~5-8 minutes
  - smoke      # ~2-3 minutes  
  - regression # ~20-30 minutes
  - all        # ~30-45 minutes
```

## 🎯 **GitHub Pages Report URLs**

After CI/CD runs, view results at:

### **Smoke Test Reports:**
- **Live URL**: `https://jibinjoyqa.github.io/btl-playwright-automation/` 
- **Auto-updates**: After each smoke test run
- **Content**: Quick summary of critical functionality

### **Full Test Reports:**
- **Live URL**: `https://jibinjoyqa.github.io/btl-playwright-automation/`
- **Auto-updates**: After full test runs
- **Content**: Complete test results with trends

## 🚀 **Quick Start: Run Smoke Tests Now**

### **Option 1: Push Code (Automatic)**
```bash
# Any push triggers smoke tests automatically
git add .
git commit -m "trigger smoke tests"
git push origin main
```

### **Option 2: Manual Trigger (GitHub UI)**
1. **Go to**: [GitHub Actions](https://github.com/jibinjoyqa/btl-playwright-automation/actions)
2. **Click**: "Smoke Tests" workflow
3. **Click**: "Run workflow" button
4. **Select**: Browser (or "all" for comprehensive check)
5. **Click**: "Run workflow"
6. **Monitor**: Real-time execution (~2-3 minutes)
7. **View Results**: Click on the running workflow

### **Option 3: API Trigger (Advanced)**
```bash
# Trigger via GitHub API
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/jibinjoyqa/btl-playwright-automation/actions/workflows/smoke-tests.yml/dispatches \
  -d '{"ref":"main","inputs":{"browser":"chromium"}}'
```

## 📈 **Monitoring Smoke Test Results**

### **Real-time Monitoring:**
1. **GitHub Actions Tab**: See live execution status
2. **Slack/Email Notifications**: Can be configured for failures
3. **GitHub Pages**: Auto-updated reports after completion

### **Success Indicators:**
- ✅ **Green checkmark** in Actions tab
- ✅ **"All critical functionality is working"** message
- ✅ **Updated GitHub Pages** with latest results

### **Failure Handling:**
- ❌ **Red X** in Actions tab
- ❌ **"Critical issues detected"** message
- 📸 **Screenshots** of failures in artifacts
- 📹 **Video recordings** for debugging

## 🔄 **Integration with Development Workflow**

### **Recommended CI/CD Strategy:**

```bash
# 1. Feature Development
git checkout -b feature/new-feature
# ... make changes ...
git push origin feature/new-feature  # Triggers smoke tests on PR

# 2. Pre-merge Validation  
# Smoke tests run automatically on PR
# Review results before merging

# 3. Post-merge Deployment
git merge feature/new-feature
git push origin main  # Triggers smoke tests + full deployment

# 4. Continuous Monitoring
# Smoke tests run every 2 hours automatically
# Immediate notification if critical functionality breaks
```

## 🎛️ **Advanced Configuration**

### **Customize Smoke Test Schedule:**
Edit `.github/workflows/smoke-tests.yml`:
```yaml
schedule:
  - cron: '0 */1 * * *'    # Every hour
  - cron: '0 9,17 * * 1-5' # 9 AM and 5 PM, weekdays only
  - cron: '0 12 * * *'     # Daily at noon
```

### **Add More Test Types:**
```bash
# Add to your test files:
test.describe('New Feature @smoke @critical', () => {
  // This test runs in both smoke and critical suites
});
```

### **Environment-specific Smoke Tests:**
```yaml
# Different smoke tests for different environments
- name: Run Production Smoke Tests
  if: github.ref == 'refs/heads/main'
  run: npx playwright test --grep "@smoke.*@production"

- name: Run Staging Smoke Tests  
  if: github.ref == 'refs/heads/develop'
  run: npx playwright test --grep "@smoke.*@staging"
```

## 🎉 **Success! Your Smoke Tests Are Ready**

You now have:
- ✅ **Dedicated smoke test workflow** (2-3 minute execution)
- ✅ **Automatic triggers** on code pushes
- ✅ **Manual trigger capability** with browser selection
- ✅ **Scheduled execution** every 2 hours during business hours
- ✅ **GitHub Pages integration** for instant result viewing
- ✅ **Multiple browser support** (Chromium, Firefox, WebKit)

**Next Steps:**
1. **Test the setup**: Push a small change to trigger smoke tests
2. **Monitor execution**: Watch the Actions tab for real-time progress
3. **View results**: Check GitHub Pages for the report
4. **Train your team**: Share this guide with team members

Your CI/CD pipeline is now optimized for rapid feedback! 🚀
