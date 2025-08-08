# 📊 GitHub Actions Test Monitoring Guide

## 🎯 **Quick Access Links**

### **Repository Actions Dashboard**
🔗 **Main Dashboard**: [GitHub Actions](https://github.com/jibinjoyqa/btl-playwright-automation/actions)

### **Live Test Reports**
🌐 **GitHub Pages**: [Test Reports](https://jibinjoyqa.github.io/btl-playwright-automation/)

### **Workflow Templates**
- 🚀 **Main Pipeline**: `playwright-cicd.yml`
- 💨 **Smoke Tests**: `smoke-tests.yml` 
- ⚡ **Quick Tests**: `simple-smoke-tests.yml`

---

## 📺 **Real-Time Monitoring**

### **Live Console Output**
```bash
# Watch tests execute in real-time:
1. Navigate to Actions tab
2. Click on running workflow
3. Expand job logs
4. See live Playwright output:

🚀 Running 25 tests using 4 workers
  ✓ [chromium] › login.spec.ts:12:5 › Valid login (2.3s)
  ✓ [firefox] › user-mgmt.spec.ts:8:3 › Create user (4.1s)
  ✗ [webkit] › api.spec.ts:15:2 › API validation (1.2s)
```

### **Parallel Execution View**
```
Matrix Strategy Results:
├── critical + chromium ✅ (2m 15s)
├── smoke + chromium ✅ (3m 45s)
├── regression + firefox ✅ (8m 30s)
└── smoke + webkit ❌ (1m 12s)
```

---

## 📊 **Detailed Test Reports**

### **HTML Reports (Interactive)**
```
Features:
✅ Test execution timeline
✅ Screenshots on failures
✅ Video recordings
✅ Network logs
✅ Console outputs
✅ Performance metrics
```

### **Artifact Downloads**
```
Available artifacts after each run:
📦 playwright-report-critical.zip
📦 playwright-report-smoke.zip  
📦 playwright-report-regression.zip
📦 test-results-all-browsers.zip
📦 coverage-reports.zip (if enabled)
```

---

## 🔍 **Monitoring Best Practices**

### **Check Test Health**
```bash
# Daily monitoring routine:
1. Check Actions tab for failures
2. Review artifact reports
3. Monitor execution times
4. Track flaky tests
```

### **Performance Tracking**
```
Monitor these metrics:
⏱️ Test execution time trends
📈 Success/failure rates
🔄 Retry patterns
💾 Resource usage
```

### **Failure Investigation**
```
When tests fail:
1. Check console logs first
2. Download artifacts
3. Review screenshots/videos
4. Check network logs
5. Analyze error patterns
```

---

## 📱 **Mobile Monitoring**

### **GitHub Mobile App**
- 📲 Download from App Store/Play Store
- 🔔 Enable push notifications
- 👀 View workflow status on-the-go
- 🚀 Trigger manual runs

### **Slack Integration (Optional)**
```yaml
# Add to workflow for team notifications:
- name: 📧 Slack Notification
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    text: "❌ Tests failed in ${{ matrix.test-suite }}"
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🎯 **Custom Dashboard Options**

### **Option 1: GitHub README Badges**
```markdown
![Tests](https://github.com/jibinjoyqa/btl-playwright-automation/workflows/Playwright%20Tests/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-85%25-green)
![Last Run](https://img.shields.io/github/last-commit/jibinjoyqa/btl-playwright-automation)
```

### **Option 2: Custom HTML Dashboard**
```html
<!-- Auto-generated dashboard -->
<!DOCTYPE html>
<html>
<head><title>Test Dashboard</title></head>
<body>
  <h1>Playwright Test Results</h1>
  <div class="metrics">
    <div class="metric">Total Tests: 156</div>
    <div class="metric">Passed: 152</div>
    <div class="metric">Failed: 4</div>
    <div class="metric">Success Rate: 97.4%</div>
  </div>
</body>
</html>
```

---

## 🔗 **Quick Navigation Links**

### **For Developers**
- [📋 Latest Test Results](https://github.com/jibinjoyqa/btl-playwright-automation/actions)
- [📊 GitHub Pages Reports](https://jibinjoyqa.github.io/btl-playwright-automation/)
- [🔧 Workflow Configuration](https://github.com/jibinjoyqa/btl-playwright-automation/tree/main/.github/workflows)

### **For Team Leads**
- [📈 Test Trends Dashboard](https://github.com/jibinjoyqa/btl-playwright-automation/insights)
- [⚡ Failed Runs Analysis](https://github.com/jibinjoyqa/btl-playwright-automation/actions?query=is%3Afailure)
- [🎯 Performance Metrics](https://github.com/jibinjoyqa/btl-playwright-automation/actions?query=is%3Asuccess)

### **For Stakeholders**
- [📊 Executive Summary](https://jibinjoyqa.github.io/btl-playwright-automation/summary.html)
- [📅 Scheduled Reports](https://github.com/jibinjoyqa/btl-playwright-automation/actions?query=event%3Aschedule)
- [🚀 Release Quality Gates](https://github.com/jibinjoyqa/btl-playwright-automation/releases)

---

## 🛠️ **Troubleshooting**

### **Common Issues**
```
❌ Can't see test results?
   → Check GitHub Pages is enabled
   → Verify workflow permissions
   → Check artifact retention settings

❌ Reports not updating?
   → Clear browser cache
   → Check workflow triggers
   → Verify GitHub Pages deployment

❌ Mobile notifications not working?
   → Enable notifications in GitHub app
   → Check repository watch settings
   → Verify account notifications
```

### **Support Channels**
- 📧 Framework team: [framework-support@digitalmesh.com]
- 💬 Slack: #playwright-automation
- 📚 Documentation: [Team Training Guide](./TEAM-TRAINING-WORKSHOP.md)

---

*This monitoring guide ensures complete visibility into your Playwright test execution in GitHub Actions!* 🚀
