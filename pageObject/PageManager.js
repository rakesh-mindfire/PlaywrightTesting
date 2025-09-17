import { AdminPage } from "./AdminPage";
import { DashBoardPage } from "./DashBoardPage";
import { LoginPage } from "./LoginPage";
import { PIMPage } from "./PIMPage";
import { RecruitmentPage } from './RecruitmentPage'

export class PageManager {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashBoardPage = new DashBoardPage(this.page)
        this.adminPage = new AdminPage(this.page)
        this.pimPage = new PIMPage(this.page)
        this.recruitmentPage = new RecruitmentPage(this.page)
    }
    getLoginPage() {
        return this.loginPage;
    }
    getDashBoardPage() {
        return this.dashBoardPage;
    }
    getAdminPage() {
        return this.adminPage;
    }
    getPIMPage() {
        return this.pimPage;
    }
    getRecruitmentPage() {
        return this.recruitmentPage;
    }
};