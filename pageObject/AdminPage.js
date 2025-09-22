import logger from '../utils/Logger.js';

export class AdminPage {
  constructor(page) {
    this.page = page;
    this.addButton = page.locator('button[class="oxd-button oxd-button--medium oxd-button--secondary"]');
    this.userRoleDropDown = page.locator('(//div[@class="oxd-select-text oxd-select-text--active"])[1]');
    this.adminDropDownOption = page.locator('//div[@role="option"]//descendant::span[text()="Admin"]');
    this.statusDropDown = page.locator('(//div[@class="oxd-select-text oxd-select-text--active"])[2]');
    this.enabledDropDownOption = page.locator('//span[text()="Enabled"]');
    this.passwordTextField = page.locator('(//input[@type="password"])[1]');
    this.employNameTextBox = page.locator('input[placeholder="Type for hints..."]');

    this.autoCompleteOptions = page.locator('//div[contains(@class, "oxd-autocomplete-option") and not(normalize-space(.)="Searching....")]');
    this.userNameTextfield = page.locator('//label[text()="Username"]//parent::div//following-sibling::div//child::input');
    this.confirmPasswordTextField = page.locator('(//input[@type="password"])[2]');
    this.saveButton = page.locator('button[type="submit"]');
    this.searchButton = page.locator('//button[normalize-space()="Search"]');
    this.noOfRecord = page.locator('//span[contains(., "Record")]');
    this.rows = page.locator('//div[@class="oxd-table-card"]');
    this.cell = page.locator('div[role="cell"]');
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
   * Add a admin user
   * @param {String} employName 
   * @param {String} userName 
   * @param {String} password 
   */
  async addAdminUser(employName, userName, password) {
    logger.info(`Creating a admin user with employname as ${employName} and userName as ${userName}`);
    try {
      await this.addButton.click();
      await this.userRoleDropDown.click();
      await this.adminDropDownOption.click();
      await this.statusDropDown.click();
      await this.enabledDropDownOption.click();
      await this.employNameTextBox.type(employName, { delay: 100 });
      await this.autoCompleteOptions.nth(0).waitFor({ state: 'visible', timeout: 5000 })
      await this.autoCompleteOptions.nth(0).click({ timeout: 5000 });

      await this.userNameTextfield.fill(userName)
      await this.passwordTextField.fill(password)
      await this.confirmPasswordTextField.fill(password)
      await this.saveButton.click();
      logger.info(`Succesfully created the Admin user.`);
    } catch (error) {
      logger.error('Failed to create a Admin user')
      throw error
    }
  }

  /**
   * Searcing for a Admin user by Username
   * @param {String} userName 
   */
  async searchAdminUser(userName) {
    logger.info(`Searching for a admin user with userName as ${userName}`);
    try {
      await this.userNameTextfield.fill(userName);
      await this.searchButton.click();
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 });
      logger.info(`successfully search for a admin user with userName as ${userName}`);
    } catch (error) {
      logger.error('Failed to create a Admin user')
      throw error
    }
  }
}