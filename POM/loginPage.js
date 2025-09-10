export class LoginPage{
    constructor(page){
        this.page=page;
        this.usernameInput=page.locator('input[name="username"]');
        this.passwordInput=page.locator('input[name="password"]');
        this.LoginButton=page.locator('button[type="submit"]');
    }
    async goto(){
        await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    }

    async login(username,password){
    
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.LoginButton.click();
    }

}