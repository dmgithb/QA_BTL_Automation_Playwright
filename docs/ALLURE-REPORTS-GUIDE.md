# 📊 Allure Reports Guide

## 🌐 GitHub Pages Access

Your Allure reports are automatically deployed to GitHub Pages after each test run:

**🔗 Live Report URL**: [https://dmgithb.github.io/QA_BTL_Automation_Playwright/](https://dmgithb.github.io/QA_BTL_Automation_Playwright/)

## 📋 What's Included

The Allure reports contain:

- ✅ **Test Results**: Pass/fail status, execution time, retries
- 📸 **Screenshots**: Captured on failures and key steps
- 🎥 **Videos**: Full test execution recordings
- 📊 **Dashboards**: Overview, trends, and categorized results
- 🔍 **Detailed Logs**: Step-by-step execution details
- 📈 **Historical Trends**: Test execution history over time

## 🛠️ Report Features

### 📊 Dashboard View
- Overview of test execution
- Success/failure rates
- Test duration trends
- Flaky test detection

### 🔍 Test Details
- Individual test case results
- Step-by-step execution logs
- Screenshots and videos attached to failed tests
- Error messages and stack traces

### 📈 Historical Data
- Trend analysis over multiple builds
- Performance regression detection
- Test stability metrics

## 🔧 Troubleshooting

### Images/Videos Not Loading
If images or videos don't display in the report:

1. **Check Artifact Upload**: Ensure test-results are properly uploaded
2. **Path Issues**: The workflow automatically fixes absolute paths for GitHub Pages
3. **Browser Security**: Some browsers may block local file access in GitHub Pages

### Old Data in Reports
The workflow automatically:
- Cleans previous results before generating new reports
- Merges results from all test jobs (smoke, regression, BDD)
- Retains only the latest build data

### Report Not Updating
If reports show old data:
1. Check if the workflow ran successfully
2. Verify GitHub Pages is enabled in repository settings
3. Allow 2-3 minutes for GitHub Pages deployment

## 📚 Additional Resources

- **Allure Documentation**: [https://docs.qameta.io/allure/](https://docs.qameta.io/allure/)
- **Playwright Reports**: [https://playwright.dev/docs/test-reporters](https://playwright.dev/docs/test-reporters)
- **GitHub Pages Setup**: See `docs/GITHUB-PAGES-SETUP.md`

## 🆘 Support

If you encounter issues with Allure reports:
1. Check the GitHub Actions workflow logs
2. Verify artifact upload completed successfully
3. Ensure GitHub Pages is properly configured
4. Contact the QA automation team for assistance
