export class DashBoardPage{
    constructor(page){
        this.page=page;
        this.adminMenuOption=page.locator('//span[text()="Admin"]');
    }

    async navigatesToAdminPage(){
    await this.adminMenuOption.click();
    }

}