
import logger from '../utils/Logger.js';

export class HomePage {
    constructor(page) {
        this.page = page;
        this.adminMenuOption = page.locator('//span[@class="oxd-text oxd-text--span oxd-main-menu-item--name"][text()="Admin"]');
        this.PIMMenuOption = page.locator('//span[@class="oxd-text oxd-text--span oxd-main-menu-item--name"][text()="PIM"]');
        this.recruitmentMenuOption = page.locator('//span[@class="oxd-text oxd-text--span oxd-main-menu-item--name"][text()="Recruitment"]');
        this.leaveMenuOption = page.locator('//span[@class="oxd-text oxd-text--span oxd-main-menu-item--name"][normalize-space()="Leave"]');
        this.timeMenuOption = page.locator('//span[@class="oxd-text oxd-text--span oxd-main-menu-item--name"][normalize-space()="Time"]');
        this.myInfoMenuOption = page.locator('//span[@class="oxd-text oxd-text--span oxd-main-menu-item--name"][normalize-space()="My Info"]');
        this.performanceMenuOption = page.locator('//span[@class="oxd-text oxd-text--span oxd-main-menu-item--name"][normalize-space()="Performance"]');
        this.dashboardMenuOption = page.locator('//span[@class="oxd-text oxd-text--span oxd-main-menu-item--name"][normalize-space()="Dashboard"]');
        this.directoryMenuOption = page.locator('//span[@class="oxd-text oxd-text--span oxd-main-menu-item--name"][normalize-space()="Directory"]');
        this.maintenanceMenuOption = page.locator('//span[@class="oxd-text oxd-text--span oxd-main-menu-item--name"][normalize-space()="Maintenance"]');
        this.claimMenuOption = page.locator('//span[@class="oxd-text oxd-text--span oxd-main-menu-item--name"][normalize-space()="Claim"]');
        this.buzzMenuOption = page.locator('//span[@class="oxd-text oxd-text--span oxd-main-menu-item--name"][normalize-space()="Buzz"]');
    }
    /**
     * Navigating to Admin Page
     */
    async navigatesToAdminPage() {
        logger.info("Navigates to Admin page")
        try {
            await this.adminMenuOption.click();
            logger.info('Successfully navigates to Admin page.')
        } catch (error) {
            logger.error('Failed to navigates to admin page.')
            throw error;
        }
    }
    /**
     * Navigating to PIM Page
     */
    async navigatesToPIMPage() {
        logger.info("Navigates to PIM page")
        try {
            await this.PIMMenuOption.click();
            logger.info('Successfully navigates to PIM page.')
        } catch (error) {
            logger.error('Failed to navigates to PIM page.')
            throw error;
        }
    }
    /**
     * Navigating to Recruitment Page
     */
    async navigatesToRecruitmentPage() {
        logger.info("Navigates to Recruitment page")
        try {
            await this.recruitmentMenuOption.click();
            logger.info('Successfully navigates to Recruitment page.')
        } catch (error) {
            logger.error('Failed to navigates to Recruitment page.')
            throw error;
        }
    }
}