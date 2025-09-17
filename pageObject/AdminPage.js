import logger from '../utils/logger.js';


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
    this.userNameTextfield = page.locator('//label[text()="Username"]//parent::div//following-sibling::div//child::input');
    this.confirmPasswordTextField = page.locator('(//input[@type="password"])[2]');
    this.saveButton = page.locator('button[type="submit"]');
    this.searchButton = page.locator('//button[normalize-space()="Search"]');
    this.noOfRecord = page.locator('//span[contains(., "Record")]');
    this.rows = page.locator('//div[@class="oxd-table-card"]');
    this.loadingSpinner = page.locator('.oxd-loading-spinner');

  }
  // Get row count
  async getRowCount() {
    logger.info('Getting the row count.')
    return await this.rows.count();
  }

  // Get all cells from a row
  async getCellsInRow(rowIndex) {
    const row = this.rows.nth(rowIndex);
    return row.locator('div[role="cell"]');
  }
  // Get text of a specific cell by row and column
  async getCellText(rowIndex, colIndex) {
    logger.info(`Getting the table value of Row ${rowIndex} and column ${colIndex}`)
    const cells = await this.getCellsInRow(rowIndex);
    const cell = cells.nth(colIndex);
    return (await cell.textContent()).trim();
  }

  async addAdminUser(employName, userName, password) {
    logger.info(`Creating a admin user with employname as ${employName} and userName as ${userName}`);
    try {
      await this.addButton.click();
      await this.userRoleDropDown.click();
      await this.adminDropDownOption.click();
      await this.statusDropDown.click();
      await this.enabledDropDownOption.click();
      await this.employNameTextBox.fill(employName);
      await this.page.waitForTimeout(3000);
      await this.employNameTextBox.press('ArrowDown');
      await this.employNameTextBox.press('Enter');
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