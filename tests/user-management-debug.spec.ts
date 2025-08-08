import { test, expect } from '../src/fixtures/test-fixtures';

test.describe('User Management Debug - @digitalmesh.com Domain', () => {
  test('Debug user creation form submission', async ({ page, userManagementPage }) => {
    console.log('Test: Debug user creation form submission');
    
    // Navigate to Users Info page
    await userManagementPage.navigateToUsersInfo();
    
    // Click Add New User
    await userManagementPage.clickAddNewUser();
    
    // Fill form with minimal required data
    const testUser = {
      userName: 'debug1',
      password: 'Debug123!',
      fullName: 'Debug User',
      email: 'debug@digitalmesh.com',
      department: 'IT',
      position: 'Tester'
    };
    
    console.log(`Creating debug user: ${testUser.fullName} with email: ${testUser.email}`);
    
    // Fill the form step by step with logging
    console.log('Step 1: Filling username...');
    await page.fill('input[name="userName"]', testUser.userName);
    
    console.log('Step 2: Filling password...');
    await page.fill('input[name="password"]', testUser.password);
    
    console.log('Step 3: Filling full name...');
    await page.fill('input[name="fullName"]', testUser.fullName);
    
    console.log('Step 4: Filling email...');
    await page.fill('input[name="email"]', testUser.email);
    
    console.log('Step 5: Selecting department...');
    await page.selectOption('select[name="department"]', testUser.department);
    
    console.log('Step 6: Filling position...');
    await page.fill('input[name="position"]', testUser.position);
    
    // Take a screenshot before submission
    await page.screenshot({ path: 'debug-before-submit.png', fullPage: true });
    console.log('Screenshot taken before form submission');
    
    // Get current URL before submission
    const urlBeforeSubmit = page.url();
    console.log(`URL before submit: ${urlBeforeSubmit}`);
    
    // Look for submit button and click it
    console.log('Step 7: Looking for submit button...');
    
    // Try different possible submit button selectors
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Create")',
      'button:has-text("Save")',
      'button:has-text("Add")',
      '.btn-primary',
      '.btn-success'
    ];
    
    let submitButtonFound = false;
    for (const selector of submitSelectors) {
      try {
        const button = page.locator(selector);
        if (await button.isVisible({ timeout: 1000 })) {
          console.log(`Found submit button with selector: ${selector}`);
          await button.click();
          submitButtonFound = true;
          break;
        }
      } catch (e) {
        console.log(`Submit button not found with selector: ${selector}`);
      }
    }
    
    if (!submitButtonFound) {
      console.log('No submit button found, taking screenshot of form...');
      await page.screenshot({ path: 'debug-no-submit-button.png', fullPage: true });
      
      // List all buttons on the page
      const allButtons = await page.locator('button, input[type="submit"], input[type="button"]').all();
      console.log(`Found ${allButtons.length} buttons/inputs on the page:`);
      
      for (let i = 0; i < allButtons.length; i++) {
        try {
          const buttonText = await allButtons[i].textContent();
          const buttonType = await allButtons[i].getAttribute('type');
          const buttonClass = await allButtons[i].getAttribute('class');
          console.log(`  Button ${i + 1}: Text="${buttonText}", Type="${buttonType}", Class="${buttonClass}"`);
        } catch (e) {
          console.log(`  Button ${i + 1}: Unable to get details`);
        }
      }
      
      throw new Error('No submit button found on the form');
    }
    
    // Wait a moment after clicking
    await page.waitForTimeout(2000);
    
    // Take a screenshot after submission
    await page.screenshot({ path: 'debug-after-submit.png', fullPage: true });
    console.log('Screenshot taken after form submission');
    
    // Get current URL after submission
    const urlAfterSubmit = page.url();
    console.log(`URL after submit: ${urlAfterSubmit}`);
    
    // Check if URL changed
    if (urlBeforeSubmit === urlAfterSubmit) {
      console.log('⚠️ URL did not change after form submission');
      
      // Check for any error messages on the page
      const errorSelectors = [
        '.alert-danger',
        '.error',
        '.invalid-feedback',
        '[class*="error"]',
        '[class*="invalid"]'
      ];
      
      for (const selector of errorSelectors) {
        try {
          const errorElement = page.locator(selector);
          if (await errorElement.isVisible({ timeout: 1000 })) {
            const errorText = await errorElement.textContent();
            console.log(`Error message found: ${errorText}`);
          }
        } catch (e) {
          // No error with this selector
        }
      }
      
    } else {
      console.log('✅ URL changed after form submission');
    }
    
    // Check if we're on the expected success page
    if (urlAfterSubmit.includes('/user/index') || urlAfterSubmit.includes('/user')) {
      console.log('✅ Successfully redirected to users page');
    } else {
      console.log(`❌ Not on expected users page. Current URL: ${urlAfterSubmit}`);
    }
    
    console.log('Debug test completed');
  });
});
