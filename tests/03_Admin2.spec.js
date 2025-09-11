import {test,expect} from './baseTest'



test('Failed Test Case',async({pm})=>{
    //const pm=new PageManager(page);
    //await pm.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    await pm.getLoginPage().login(process.env.ADMIN_USERNAME,process.env.ADMIN_PASSWORD);
    await pm.getDashBoardPage().navigatesToAdminPage();
    await expect(pm.getAdminnPage().noOfRecord).toContainText('Testing')
});
