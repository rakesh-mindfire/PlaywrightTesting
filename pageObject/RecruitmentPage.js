import logger from '../utils/Logger.js';


export class RecruitmentPage {
  constructor(page) {
    this.page = page;
    this.candidatesMenubar = page.locator('//a[normalize-space()="Candidates"]');
    this.vacanciesMenubar = page.locator('//a[normalize-space()="Vacancies"]');
    this.addButton = page.locator('//button[normalize-space()="Add"]');
    this.vacancyNameInput = page.locator('//label[normalize-space()="Vacancy Name"]//parent::div//following-sibling::div//child::input');
    this.jobTitleDropdown = page.locator('//label[text()="Job Title"]//parent::div//following-sibling::div//descendant::div[@class="oxd-select-text oxd-select-text--active"]');
    this.vacancyDropdown = page.locator('//label[text()="Vacancy"]//parent::div//following-sibling::div//descendant::div[@class="oxd-select-text oxd-select-text--active"]');

    this.softwareEngineerDropDownOption = page.locator('//div[@role="option"]//child::span[text()="Software Engineer"]');
    this.hiringManagerInput = page.locator('//input[@placeholder="Type for hints..."]');
    this.autoCompleteOptions = page.locator('//div[contains(@class, "oxd-autocomplete-option") and not(normalize-space(.)="Searching....")]');
    this.numberOfPositionsInput = page.locator('//label[text()="Number of Positions"]//parent::div//following-sibling::div//child::input');
    this.saveButton = page.locator('//button[normalize-space()="Save"]');
    this.cancelButton = page.locator('//button[normalize-space()="Cancel"]');
    this.searchButton = page.locator('//button[normalize-space()="Search"]');
    this.noOfRecordText = page.locator('//span[contains(.,"Found")]');
    this.successfullySavedToaster = page.locator('//p[text()="Successfully Saved"]');
    this.editVacancyPageTitle = page.locator('//h6[normalize-space()="Edit Vacancy"]');
  }

  /**
   * Navigating to vacancies Page
   */
  async navigatesToVacanciesPage() {
    logger.info(`Navigating to vacancies page.`);
    try {
      await this.vacanciesMenubar.click();
    } catch (error) {
      logger.error('Could not navigate to the vacancies page.')
      throw error
    }
  }

  /**
   * Adding a new Vacancy
   * @param {String} vacancyName 
   * @param {String} hiringManager 
   * @param {String} noOfPosition 
   */
  async addAVacancy(vacancyName, hiringManager, noOfPosition) {
    logger.info(`Adding a vacancy.`);
    try {
      await this.addButton.click()
      await this.vacancyNameInput.fill(vacancyName);
      await this.jobTitleDropdown.click()
      await this.softwareEngineerDropDownOption.click()
      await this.hiringManagerInput.fill(hiringManager)
      await this.autoCompleteOptions.nth(0).waitFor({ state: 'visible', timeout: 5000 })
      await this.autoCompleteOptions.nth(0).click({ timeout: 5000 });

      await this.numberOfPositionsInput.fill(noOfPosition)
      await this.saveButton.click()
      //Taking Sometime to Store the data in DB
      await this.page.waitForTimeout(3000);
      await this.editVacancyPageTitle.waitFor({ state: 'visible' })
      await this.saveButton.click()
    } catch (error) {
      logger.error('Failed to add a vacancy.')
      throw error
    }

  }

  /**
   * Searching for a vacancy by vacancy name & JobTitle
   * @param {Search} vacancyName 
   * @param {Search} JobTitle 
   */
  async searchAVacancy(vacancyName, JobTitle) {
    logger.info(`Searching for a vacancy with Job title as ${JobTitle} and Vacancyname as ${vacancyName}`);
    try {
      await this.jobTitleDropdown.click()
      await this.softwareEngineerDropDownOption.waitFor({ state: 'visible', timeout: 10000 });
      await this.softwareEngineerDropDownOption.click()
      await this.vacancyDropdown.click()
      await this.page.waitForSelector(`text=${vacancyName}`, { state: 'visible' });
      await this.page.click(`text=${vacancyName}`)

      await this.searchButton.click();
      await this.noOfRecordText.waitFor({ state: 'visible', timeout: 5000 })
      logger.info(`successfully search for a vacancy with Job title as ${JobTitle} and Vacancyname as ${vacancyName}`);
    } catch (error) {
      logger.error(`Failed to search for a vacancy with Job title as ${JobTitle} and Vacancyname as ${vacancyName}`)
      throw error
    }
  }
}