import { test, expect, logger } from '../utils/BaseTest'

test('Verifying the menu', async ({ pm }) => {
    await expect(pm.getHomePage().PIMMenuOption).toBeVisible();
    logger.info('Verified PIM menu is visible.')
    await expect(pm.getHomePage().recruitmentMenuOption).toBeVisible();
    logger.info('Verified Recruitment menu is visible.')
    await expect(pm.getHomePage().leaveMenuOption).toBeVisible();
    logger.info('Verified Leave menu is visible.')
    await expect(pm.getHomePage().timeMenuOption).toBeVisible();
    logger.info('Verified Time menu is visible.')

    await expect(pm.getHomePage().myInfoMenuOption).toBeVisible();
    logger.info('Verified MyInfo menu is visible.')
    await expect(pm.getHomePage().performanceMenuOption).toBeVisible();
    logger.info('Verified Performance menu is visible.')
    await expect(pm.getHomePage().dashboardMenuOption).toBeVisible();
    logger.info('Verified Dashboard menu is visible.')

    await expect(pm.getHomePage().directoryMenuOption).toBeVisible();
    logger.info('Verified Directory menu is visible.')
    await expect(pm.getHomePage().maintenanceMenuOption).toBeVisible();
    logger.info('Verified Maintenance menu is visible.')
    await expect(pm.getHomePage().claimMenuOption).toBeVisible();
    logger.info('Verified Claim menu is visible.')
    await expect(pm.getHomePage().buzzMenuOption).toBeVisible();
    logger.info('Verified Buzz menu is visible.')
});


