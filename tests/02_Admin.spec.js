import{test,expect} from '../tests/baseTest'

let userName='Test'+Date.now();

test('[@Smoke] Create Admin User',async({page,loginpage, dashBoardPage, adminPage})=>{
  
    
    await loginpage.login('Admin','admin123');
    await dashBoardPage.navigatesToAdminPage();
    await adminPage.addAdminUser('Test',userName,'Test@123');
    await adminPage.addButton.waitFor({ state: 'visible' })
    //await page.waitForTimeout(5000)
});
test('Serach for a admin user',async({page,loginpage, dashBoardPage, adminPage})=>{
    await loginpage.login('Admin','admin123');
    await dashBoardPage.navigatesToAdminPage();
    await adminPage.searchAAdminUser(userName);
    let NoOfRecordText=await adminPage.noOfRecord.textContent();
    console.log(NoOfRecordText)
    const match = (NoOfRecordText.match(/\d+/))
    const count = match ? parseInt(match[0], 10) : 0;
    expect(count).toBeGreaterThan(0)
});
test('Failed Test Case',async({loginpage, dashBoardPage, adminPage})=>{
    await loginpage.login('Admin','admin123');
    await dashBoardPage.navigatesToAdminPage();
    await expect(adminPage.noOfRecord).toContainText('Testing')
});
