import { test as base, expect } from '@playwright/test'
import { PageManager } from '../pageObject/PageManager';
import logger, { setBrowserName } from '../utils/logger';




export const test = base.extend({
  // Define our custom 'pm' fixture
  pm: async ({ page }, use) => {
    await page.goto('/');
    const pm = new PageManager(page);
    await use(pm);
  },
});

test.beforeEach(async ({ browser }, testInfo) => {
  const browserName = browser.browserType().name();
  setBrowserName(browserName); // Set browser name before logging
  logger.info(`==== TEST START: ${testInfo.title} ====`);
});

test.afterEach(async ({ browser }, testInfo) => {
  logger.info(`==== TEST END: ${testInfo.title} ====`);
});
export { expect };