import {test as base,expect} from '@playwright/test'
import { PageManager } from '../POM/PageManager';




export const test = base.extend({
  // Define our custom 'pm' fixture
  pm: async ({ page }, use) => {
    // Navigate and perform login once for all tests
    await page.goto('/web/index.php/auth/login');
    page.waitForTimeout(5000)
    const pm = new PageManager(page);
    
    //await pm.getLoginPage().login('Admin', 'admin123');
    //await pm.getDashBoardPage().navigatesToAdminPage();

    // The 'use' function provides the fixture to the test
    await use(pm);
  },
});
export { expect };