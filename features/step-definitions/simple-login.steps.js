const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, expect } = require('@playwright/test');
require('dotenv').config();

// Set default timeout to 30 seconds
setDefaultTimeout(30000);

let browser;
let page;

Given('I navigate to the login page', async function () {
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('https://training.bt-ms.com/MAIN-STAGE/erp.php/login');
  console.log('✅ Navigated to login page');
});

When('I enter valid credentials', async function () {
  const username = process.env.TEST_USER_USERNAME;
  const password = process.env.TEST_USER_PASSWORD;
  
  console.log(`🔐 Using credentials - Username: ${username}, Password: ${password ? '[SET]' : '[NOT SET]'}`);
  
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  console.log('✅ Entered valid credentials');
});

When('I click login', async function () {
  await page.click('input[type="submit"], button[type="submit"]');
  console.log('✅ Clicked login button');
});

Then('I should be logged in successfully', async function () {
  try {
    // Wait a bit for the navigation to complete
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log(`✅ Current URL after login: ${currentUrl}`);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'reports/bdd-login-result.png', fullPage: true });
    console.log('📷 Screenshot saved: reports/bdd-login-result.png');
    
    // Check if we're on the welcome page (more flexible matching)
    if (currentUrl.includes('Welcome.php') || currentUrl.includes('welcome') || currentUrl.includes('Welcome')) {
      console.log('✅ Successfully logged in - Welcome page detected');
    } else {
      throw new Error(`Login may have failed - Current URL: ${currentUrl}`);
    }
  } catch (error) {
    console.log(`❌ Login verification failed: ${error.message}`);
    // Take a screenshot for debugging
    await page.screenshot({ path: 'reports/bdd-login-error.png', fullPage: true });
    throw error;
  } finally {
    // Cleanup
    await browser.close();
  }
});
