import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { world } from './world';
import * as fs from 'fs';
import * as path from 'path';

let browser: Browser;
let context: BrowserContext;
let page: Page;

BeforeAll(async function () {
  browser = await chromium.launch({ 
    headless: false,
    args: ['--start-maximized'] 
  });
  world.browser = browser;
});

Before(async function () {
  context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  page = await context.newPage();
  
  world.context = context;
  world.page = page;
  
  world.logger.info('Browser context and page initialized for scenario');
});

After(async function (scenario) {
  if (scenario.result?.status === 'FAILED') {
    // Create screenshots directory if it doesn't exist
    const screenshotDir = path.join(process.cwd(), 'allure-results');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const screenshotPath = path.join(screenshotDir, `screenshot-${timestamp}.png`);
    
    // Take screenshot
    const screenshot = await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    // Attach screenshot to Allure report
    this.attach(screenshot, 'image/png');
    
    // Also save to reports directory
    const reportsScreenshotPath = `reports/screenshots/failed-${timestamp}.png`;
    await page.screenshot({ 
      path: reportsScreenshotPath,
      fullPage: true 
    });
    
    world.logger.error(`Scenario failed: ${scenario.pickle.name}`);
  }
  
  await context.close();
  world.logger.info('Browser context closed after scenario');
});

AfterAll(async function () {
  await browser.close();
  world.logger.info('Browser closed after all scenarios');
});
