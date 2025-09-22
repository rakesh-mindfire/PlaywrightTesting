import { AdminPage } from "./AdminPage";
import { HomePage } from "./HomePage";
import { LoginPage } from "./LoginPage";
import { PIMPage } from "./PIMPage";
import { RecruitmentPage } from './RecruitmentPage'

export class PageManager {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.homePage = new HomePage(this.page)
        this.adminPage = new AdminPage(this.page)
        this.pimPage = new PIMPage(this.page)
        this.recruitmentPage = new RecruitmentPage(this.page)
    }

    getLoginPage() {
        return this.loginPage;
    }

    getHomePage() {
        return this.homePage;
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