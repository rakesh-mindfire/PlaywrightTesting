// baseTest.js
//const { test as base, expect } = require('@playwright/test');
import baseTest ,{expect} from '@playwright/test';
import { LoginPage } from '../POM/loginPage'
import { DashBoardPage } from '../POM/dashBoardPage'
import { AdminPage } from '../POM/adminPage'





export const test = baseTest.extend({
  loginpage: async ({ page }, use) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    const loginpage = new LoginPage(page);
    await use(loginpage);
  },

  dashBoardPage: async ({ page }, use) => {
    const dashBoardPage = new DashBoardPage(page);
    await use(dashBoardPage);
  },

  adminPage: async ({ page }, use) => {
    const adminPage = new AdminPage(page);
    await use(adminPage);
  }
});

export { expect };