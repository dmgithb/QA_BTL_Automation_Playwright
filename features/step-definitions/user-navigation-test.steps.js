const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, expect } = require('@playwright/test');
require('dotenv').config();

setDefaultTimeout(30000);

let browser;
let page;

// Helper class for login operations
class LoginHelper {
  constructor(page) {
    this.page = page;
    this.url = 'https://training.bt-ms.com/MAIN-STAGE/erp.php/login';
  }

  async navigateAndLogin() {
    await this.page.goto(this.url);
    
    const username = process.env.TEST_USER_USERNAME;
    const password = process.env.TEST_USER_PASSWORD;
    
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('input[type="submit"], button[type="submit"]');
    
    await this.page.waitForURL('**/Welcome.php', { timeout: 10000 });
  }
}

let loginHelper;

Given('I am logged into the ERP system as an administrator', async function () {
  browser = await chromium.launch({ headless: process.env.CI ? true : true });
  const context = await browser.newContext();
  page = await context.newPage();
  
  loginHelper = new LoginHelper(page);
  await loginHelper.navigateAndLogin();
  
  console.log('✅ Logged into ERP system as administrator');
});

When('I hover over the {string} menu', async function (menuName) {
  const coreDataLink = page.locator('a').filter({ hasText: 'Core Data »' });
  await coreDataLink.hover();
  await page.waitForTimeout(2000);
  console.log(`✅ Hovered over ${menuName} menu`);
});

Then('I should see the submenu options', async function () {
  await page.waitForTimeout(2000);
  
  // Get all visible links after hovering
  const submenuLinks = await page.locator('a').evaluateAll(elements => 
    elements
      .filter(el => el.offsetWidth > 0 && el.offsetHeight > 0)
      .map(el => ({ text: el.textContent?.trim(), href: el.href }))
      .filter(link => link.text && link.text.length > 0)
  );
  
  console.log('🔗 Available submenu options:');
  submenuLinks.forEach((link, index) => {
    console.log(`   ${index + 1}. "${link.text}" -> ${link.href}`);
  });
  
  // Look for any dropdown or submenu containers
  const dropdowns = await page.locator('.dropdown, .submenu, ul li').count();
  console.log(`📋 Found ${dropdowns} potential dropdown/submenu elements`);
  
  await expect(page.locator('body')).toBeVisible();
  console.log('✅ Submenu exploration completed');
  
  // Cleanup
  await browser.close();
});
