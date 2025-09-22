import { test as base, expect } from '@playwright/test'
import { PageManager } from '../pageObject/PageManager';
import logger, { setBrowserName } from './Logger';

export const test = base.extend({
  pm: async ({ page }, use, testInfo) => {
    const browserName = testInfo.project.name;
    setBrowserName(browserName); // Set browser name before logging
    logger.info(`==== TEST START: ${testInfo.title} in project ${browserName} ====`);
    await page.goto('/');
    const pm = new PageManager(page);
    await use(pm);
    logger.info(`==== TEST END: ${testInfo.title} in project ${browserName} ====`);
  },
});

export { expect, logger };