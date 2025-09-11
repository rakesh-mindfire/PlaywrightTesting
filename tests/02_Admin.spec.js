import {test,expect} from './baseTest'
//import { PageManager } from '../POM/PageManager';

let userName='Test'+Date.now();

test('[@Smoke] Create Admin User',async({pm})=>{
    //const pm=new PageManager(page);
    //await pm.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    await pm.getLoginPage().login(process.env.ADMIN_USERNAME,process.env.ADMIN_PASSWORD);
    await pm.getDashBoardPage().navigatesToAdminPage();
    await pm.getAdminnPage().addAdminUser('Test',userName,'Test@123');
    await pm.getAdminnPage().addButton.waitFor({ state: 'visible' })
    //await page.waitForTimeout(5000)
});
test('Serach for a admin user',async({pm})=>{
    //const pm=new PageManager(page);
    //await pm.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    await pm.getLoginPage().login(process.env.ADMIN_USERNAME,process.env.ADMIN_PASSWORD);
    await pm.getDashBoardPage().navigatesToAdminPage();
    await pm.getAdminnPage().searchAAdminUser(userName);
    let NoOfRecordText=await pm.getAdminnPage().noOfRecord.textContent();
    console.log(NoOfRecordText)
    const match = (NoOfRecordText.match(/\d+/))
    const count = match ? parseInt(match[0], 10) : 0;
    expect(count).toBeGreaterThan(0)
});

