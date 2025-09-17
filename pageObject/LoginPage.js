import logger from '../utils/logger.js';

export class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.LoginButton = page.locator('button[type="submit"]');
    }
    async goto(url) {
        logger.info(`Navigating to ${url}`)
        try {
            await this.page.goto(url)
            logger.info(`Successfully navigates to ${url}`)
        } catch (error) {
            logger.error(`Failed to navigates to ${url}`)
            throw error;
        }
    }

    async login(username, password) {
        logger.info(`logging into application using userName as ${username}`)
        try {
            await this.usernameInput.fill(username);
            await this.passwordInput.fill(password);
            await this.LoginButton.click();
        } catch (error) {
            logger.error('Failed to login')
            throw error;
        }


    }

}