
import logger from '../utils/logger.js';

export class DashBoardPage {
    constructor(page) {
        this.page = page;
        this.adminMenuOption = page.locator('//span[text()="Admin"]');
        this.PIMMenuOption = page.locator('//span[text()="PIM" and @class="oxd-text oxd-text--span oxd-main-menu-item--name"]');
        this.recruitmentMenuOption = page.locator('//span[text()="Recruitment"]');
    }


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
    async navigatesToPIMPage() {
        logger.info("Navigates to Admin page")
        try {
            await this.PIMMenuOption.click();
            logger.info('Successfully navigates to PIM page.')
        } catch (error) {
            logger.error('Failed to navigates to PIM page.')
            throw error;
        }
    }
    async navigatesToRecruitmentPage() {
        logger.info("Navigates to Admin page")
        try {
            await this.recruitmentMenuOption.click();
            logger.info('Successfully navigates to Recruitment page.')
        } catch (error) {
            logger.error('Failed to navigates to Recruitment page.')
            throw error;
        }
    }

}