import logger from '../utils/logger.js';

export class PIMPage {
    constructor(page) {
        this.page = page;
        this.addEmployeeMenubar = page.locator('//a[text()="Add Employee"]');
        this.firstNameInput = page.locator('[name="firstName"]');
        this.middleNameInput = page.locator('[name="middleName"]');
        this.lastNameInput = page.locator('[name="lastName"]');
        this.employeeIdInput = page.locator('//label[text()="Employee Id"]//parent::div//following-sibling::div//child::input');
        this.saveButton = page.locator('button[type="submit"]');
        this.EmployeeListMenubar = page.locator('//a[normalize-space()="Employee List"]');
        this.searchButton = page.locator('//button[normalize-space()="Search"]');
        this.noOfRecordText = page.locator('//span[contains(.,"Found")]');
        this.successfullySavedToaster = page.locator('//p[text()="Successfully Saved"]');

    }

    async navigatesToAddEmployeePage() {
        logger.info(`Navigates to Add Employee page`)
        try {
            await this.addEmployeeMenubar.click();
        } catch (error) {
            logger.error('Unable to navigates to add employee page. ')
            throw error;
        }
    }

    async addEmployee(firstName, lastName, employeeId) {
        logger.info(`Adding a New Employee with first name as ${firstName},LastName as ${lastName},EmplyId as ${employeeId}.`)
        try {
            await this.firstNameInput.fill(firstName)
            await this.lastNameInput.fill(lastName)
            await this.employeeIdInput.clear();
            await this.employeeIdInput.fill(employeeId)
            await this.saveButton.click()
            await this.successfullySavedToaster.waitFor({ state: 'visible' })
            logger.info('Added a new employee.')
        }
        catch (error) {
            logger.error('Failed to add a employee.')
            throw error
        }
    }
    async navigatesToEmployeeListPage() {
        logger.info(`Navigates to Employee List page`)
        try {
            await this.EmployeeListMenubar.click();
        } catch (error) {
            logger.error('Failed to navigates to Employee list page.')
            throw error
        }
    }
    async searchEmployeeWithEmployeeId(employeeId) {
        logger.info(`Searching a Employee Id as ${employeeId}`)
        try {
            await this.employeeIdInput.fill(employeeId)
            await this.searchButton.click();
            await this.noOfRecordText.waitFor({ state: 'visible' })
        }
        catch (error) {
            logger.error('Failed to search a employee.');
            throw error;
        }

    }

}