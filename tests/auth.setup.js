
import { test as setup } from '@playwright/test'
import { LoginPage } from "../pageObject/LoginPage.js";
const path = require('path');

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(process.env.BASE_URL + '/web/index.php/auth/login')
  await loginPage.login(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
  await page.waitForURL(process.env.BASE_URL + '/web/index.php/dashboard/index');  // Expected post-login URL

  //// Access cookies from the current context
  const cookies = await page.context().cookies();
  const cookieHeader = cookies
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');
  // Make the API request using context.request
  try {
    await page.context().request.put(
      'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/localization',
      {
        headers: {
          'Cookie': cookieHeader,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          language: 'en_US',
          dateFormat: 'Y-d-m',
        }),
      }
    );
  } catch (error) {
    console.log(`API request failed: ${error.message}`)
    throw error;
  }
  await page.context().storageState({ path: authFile });
});