const { test: setup, expect } = require('@playwright/test');
const path = require('path');

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Replace with your app's login URL and selectors.
  await page.goto(process.env.BASE_URL+'/web/index.php/auth/login');  // Your login page URL
  await page.getByPlaceholder('Username').fill(process.env.ADMIN_USERNAME)
  await page.getByPlaceholder('Password').fill(process.env.ADMIN_PASSWORD)  // Selector for password input
  await page.click('//button[@type="submit"]');     // Selector for submit button

  // Wait for successful login (e.g., redirect or element visibility).
  await page.waitForURL(process.env.BASE_URL+'/web/index.php/dashboard/index');  // Expected post-login URL
  // Or: await expect(page.locator('#welcome-message')).toBeVisible();

  // Save the authenticated storage state.
  await page.context().storageState({ path: authFile });
});