import { test, expect } from './BaseTest'






test('[@Smoke] Create Admin User', async ({ pm }) => {
    let userName = 'Test' + Date.now();
    await pm.getDashBoardPage().navigatesToAdminPage();
    let employeeName = await pm.getAdminPage().getCellText(0, 3);
    await pm.getAdminPage().addAdminUser(employeeName, userName, 'Test@123');
    await pm.getAdminPage().addButton.waitFor({ state: 'visible' })
    //Search for a Admin user
    await pm.getDashBoardPage().navigatesToAdminPage();
    const oldText = await pm.getAdminPage().noOfRecord.textContent();
    await pm.getAdminPage().searchAdminUser(userName);
    await expect(pm.getAdminPage().noOfRecord).not.toHaveText(oldText, { timeout: 5000 });
    let NoOfRecordText = await pm.getAdminPage().noOfRecord.textContent();
    const match = (NoOfRecordText.match(/\d+/))
    const count = match ? parseInt(match[0], 10) : 0;
    expect(count).toBe(1)

});


