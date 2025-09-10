export class AdminPage{
    constructor(page){
        this.page=page;
        this.addButton=page.locator('button[class="oxd-button oxd-button--medium oxd-button--secondary"]');
        this.userRoleDropDown=page.locator('(//div[@class="oxd-select-text oxd-select-text--active"])[1]');
        this.adminDropDownOption=page.locator('//div[@role="option"]//descendant::span[text()="Admin"]');
        this.statusDropDown=page.locator('(//div[@class="oxd-select-text oxd-select-text--active"])[2]');
        this.enabledDropDownOption=page.locator('//span[text()="Enabled"]');
        this.passwordTextField=page.locator('(//input[@type="password"])[1]');
        this.employNameTextBox=page.locator('input[placeholder="Type for hints..."]');
        this.userNameTextfield=page.locator('//label[text()="Username"]//parent::div//following-sibling::div//child::input');
        this.confirmPasswordTextField=page.locator('(//input[@type="password"])[2]');
        this.saveButton=page.locator('button[type="submit"]');
        this.searchButton=page.locator('//button[normalize-space()="Search"]');
        this.noOfRecord=page.locator('//span[contains(., "Record")]');
    }

    async addAdminUser(employName,userName,password){
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
    }
    async searchAAdminUser(userName){
        await this.userNameTextfield.fill(userName);
        await this.searchButton.click();
        
    }

}