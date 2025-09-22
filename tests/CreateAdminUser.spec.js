import { test, expect } from '../utils/BaseTest'

test('[@Smoke] Create Admin User', async ({ pm }) => {
    let userName = 'Test' + Date.now();
    await pm.getHomePage().navigatesToAdminPage();
    //let employeeName = await pm.getAdminPage().getCellText(0, 3);
    await pm.getAdminPage().addAdminUser('a', userName, 'Test@123');
    await pm.getAdminPage().addButton.waitFor({ state: 'visible' })

    //Search for a Admin user
    await pm.getHomePage().navigatesToAdminPage();
    const oldText = await pm.getAdminPage().noOfRecord.textContent();
    await pm.getAdminPage().searchAdminUser(userName);
    await expect(pm.getAdminPage().noOfRecord).not.toHaveText(oldText, { timeout: 5000 });
    //Verifying no of record is 1
    let NoOfRecordText = await pm.getAdminPage().noOfRecord.textContent();
    const match = (NoOfRecordText.match(/\d+/))
    const count = match ? parseInt(match[0], 10) : 0;
    expect(count).toBe(1)
    //User detail verification
    let ActualUserName = await pm.getAdminPage().getCellText(0, 1);
    let ActualUserRole = await pm.getAdminPage().getCellText(0, 2);
    expect(ActualUserName).toBe(userName)
    expect(ActualUserRole).toBe('Admin')
});


