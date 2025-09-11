import { AdminPage } from "./AdminPage";
import { DashBoardPage } from "./DashBoardPage";
import { LoginPage } from "./LoginPage";

export class PageManager{
    constructor(page){
        this.page=page;
        this.loginPage=new LoginPage(this.page);
        this.dashBoardPage=new DashBoardPage(this.page)
        this.adminPage=new AdminPage(this.page)
    }
    getLoginPage(){
        return this.loginPage;
    }
    getDashBoardPage(){
        return this.dashBoardPage;
    }
    getAdminnPage(){
        return this.adminPage;
    }
}