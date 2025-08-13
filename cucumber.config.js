module.exports = {
  default: {
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    dryRun: false,
    retry: 1,
    parallel: 1,
    tags: 'not @skip',
    paths: ['features/**/*.feature']
  },
  allure: {
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    dryRun: false,
    retry: 1,
    parallel: 1,
    tags: 'not @skip',
    paths: ['features/**/*.feature']
  },
  smoke: {
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-smoke-report.json',
      'html:reports/cucumber-smoke-report.html'
    ],
    publishQuiet: true,
    tags: '@smoke',
    paths: ['features/**/*.feature']
  },
  critical: {
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-critical-report.json',
      'html:reports/cucumber-critical-report.html'
    ],
    publishQuiet: true,
    tags: '@critical',
    paths: ['features/**/*.feature']
  },
  regression: {
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-regression-report.json',
      'html:reports/cucumber-regression-report.html'
    ],
    publishQuiet: true,
    tags: '@regression',
    paths: ['features/**/*.feature']
  },
  comprehensive: {
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-comprehensive-report.json',
      'html:reports/cucumber-comprehensive-report.html'
    ],
    publishQuiet: true,
    tags: '@comprehensive',
    paths: ['features/**/*.feature']
  },
  'data-driven': {
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-data-driven-report.json',
      'html:reports/cucumber-data-driven-report.html'
    ],
    publishQuiet: true,
    tags: '@data-driven',
    paths: ['features/**/*.feature']
  },
  performance: {
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-performance-report.json',
      'html:reports/cucumber-performance-report.html'
    ],
    publishQuiet: true,
    tags: '@performance or @accessibility',
    paths: ['features/**/*.feature']
  },
  security: {
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-security-report.json',
      'html:reports/cucumber-security-report.html'
    ],
    publishQuiet: true,
    tags: '@security',
    paths: ['features/**/*.feature']
  },
  'login-main': {
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-login-main-report.json',
      'html:reports/cucumber-login-main-report.html'
    ],
    publishQuiet: true,
    tags: '@login',
    paths: ['features/login-main.feature']
  },
  'login-data-driven': {
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-login-data-driven-report.json',
      'html:reports/cucumber-login-data-driven-report.html'
    ],
    publishQuiet: true,
    tags: '@data-driven',
    paths: ['features/login-data-driven.feature']
  },
  'login-performance': {
    require: [
      'features/step-definitions/**/*.ts',
      'features/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-login-performance-report.json',
      'html:reports/cucumber-login-performance-report.html'
    ],
    publishQuiet: true,
    tags: '@performance or @accessibility',
    paths: ['features/login-performance-accessibility.feature']
  }
};
