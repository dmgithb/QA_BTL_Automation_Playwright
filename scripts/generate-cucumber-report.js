const reporter = require('cucumber-html-reporter');
const path = require('path');

const options = {
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber-report.json',
  output: 'reports/cucumber-html-report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  metadata: {
    "App Version": "1.0.0",
    "Test Environment": process.env.NODE_ENV || "test",
    "Browser": "Chromium",
    "Platform": process.platform,
    "Executed": new Date().toISOString()
  },
  failedSummaryReport: true,
  brandTitle: 'Bulktainer ERP - BDD Test Report',
  name: 'Cucumber BDD Automation Report',
  columnLayout: 1,
  storeScreenshots: true,
  screenshotsDirectory: 'reports/screenshots/',
  noInlineScreenshots: false
};

try {
  reporter.generate(options);
  console.log('✅ Cucumber HTML report generated successfully!');
  console.log(`📊 Report available at: ${path.resolve(options.output)}`);
} catch (error) {
  console.error('❌ Error generating Cucumber HTML report:', error.message);
  process.exit(1);
}
