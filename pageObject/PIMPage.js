import logger from '../utils/Logger.js';

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
        this.rows = page.locator('//div[@class="oxd-table-card"]');
        this.cell = page.locator('div[role="cell"]');
        this.editIcon = page.locator('//i[@class="oxd-icon bi-pencil-fill"]');
        this.personalDetailPageTitle = page.locator('//h6[normalize-space()="Personal Details"]');
        this.loadingSpinner = page.locator('.oxd-loading-spinner');
    }

    /**
    * Get the no of Row count in the Table
    * @returns RowCount
    */
    async getRowCount() {
        logger.info('Getting the row count.')
        return await this.rows.count();
    }

    /**
     * Get all the cell value in a Table Row
     * @param {Number} rowIndex 
     * @returns CellsValues
    */
    async getCellsInRow(rowIndex) {
        const row = this.rows.nth(rowIndex);
        return row.locator(this.cell);
    }

    /**
     * Get text of a specific cell by row and column
     * @param {Number} rowIndex 
     * @param {Number} colIndex 
     * @returns CellValue
     */
    async getCellText(rowIndex, colIndex) {
        logger.info(`Getting the table value of Row ${rowIndex} and column ${colIndex}`)
        const cells = await this.getCellsInRow(rowIndex);
        const cell = cells.nth(colIndex);
        return (await cell.textContent()).trim();
    }

    /**
     * Navigating to Add Employee Page
     */
    async navigatesToAddEmployeePage() {
        logger.info(`Navigates to Add Employee page`)
        try {
            await this.addEmployeeMenubar.click();
        } catch (error) {
            logger.error('Unable to navigates to add employee page. ')
            throw error;
        }
    }

    /**
     * Adding A new Employee
     * @param {String} firstName 
     * @param {String} lastName 
     * @param {String} employeeId 
     */
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

    /**
     * Navigating to Employee list page
     */
    async navigatesToEmployeeListPage() {
        logger.info(`Navigates to Employee List page`)
        try {
            await this.EmployeeListMenubar.click();
        } catch (error) {
            logger.error('Failed to navigates to Employee list page.')
            throw error
        }
    }

    /**
     * Searching a Employee with employee Id
     * @param {String} employeeId 
     */
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

    /**
     * Editing a employee with row index.
     * @param {number} recordIndex 
     * @param {String} firstName 
     * @param {String} middleName 
     * @param {String} lastname 
     */
    async editNameOfAEmployee(recordIndex, firstName, middleName, lastname) {
        logger.info(`Editing name of a employ`)
        try {
            await this.editIcon.nth(recordIndex).click();
            await this.personalDetailPageTitle.waitFor({ state: 'visible' })
            await this.firstNameInput.clear();
            await this.firstNameInput.fill(firstName);
            await this.middleNameInput.clear();
            await this.middleNameInput.fill(middleName);
            await this.lastNameInput.clear();
            await this.lastNameInput.fill(lastname);

            //Clicking on first Save button
            await this.saveButton.nth(0).click();
            //Taking sometime to store the data in DB
            await this.page.waitForTimeout(3000);
            if (await this.loadingSpinner.isVisible({ timeout: 3000 })) {
                await this.loadingSpinner.waitFor({ state: 'hidden' });
            }
            await this.firstNameInput.waitFor({ state: 'visible' })
        }
        catch (error) {
            logger.error('Failed to edit the name of a employ.');
            throw error;
        }
    }
}