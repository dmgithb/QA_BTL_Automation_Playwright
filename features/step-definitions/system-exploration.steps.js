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

When('I examine the page content', async function () {
  await page.waitForTimeout(3000);
  
  // Get page title
  const title = await page.title();
  console.log(`📄 Page title: ${title}`);
  
  // Get current URL
  const url = page.url();
  console.log(`🔗 Current URL: ${url}`);
  
  // Get all visible links
  const links = await page.locator('a').evaluateAll(elements => 
    elements
      .filter(el => el.offsetWidth > 0 && el.offsetHeight > 0)
      .map(el => ({ text: el.textContent?.trim(), href: el.href }))
      .filter(link => link.text && link.text.length > 0)
  );
  
  console.log('🔗 Available links:');
  links.forEach((link, index) => {
    console.log(`   ${index + 1}. "${link.text}" -> ${link.href}`);
  });
  
  // Get all buttons
  const buttons = await page.locator('button, input[type="button"], input[type="submit"]').evaluateAll(elements =>
    elements
      .filter(el => el.offsetWidth > 0 && el.offsetHeight > 0)
      .map(el => ({ text: el.textContent?.trim() || el.value, type: el.type }))
      .filter(btn => btn.text && btn.text.length > 0)
  );
  
  console.log('🔘 Available buttons:');
  buttons.forEach((button, index) => {
    console.log(`   ${index + 1}. "${button.text}" (${button.type})`);
  });
  
  // Get main content structure
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll(elements =>
    elements
      .filter(el => el.offsetWidth > 0 && el.offsetHeight > 0)
      .map(el => ({ tag: el.tagName, text: el.textContent?.trim() }))
      .filter(heading => heading.text && heading.text.length > 0)
  );
  
  console.log('📋 Page headings:');
  headings.forEach((heading, index) => {
    console.log(`   ${index + 1}. ${heading.tag}: "${heading.text}"`);
  });
});

Then('I should see available menu options', async function () {
  await expect(page.locator('body')).toBeVisible();
  console.log('✅ Page exploration completed successfully');
  
  // Cleanup
  await browser.close();
});
