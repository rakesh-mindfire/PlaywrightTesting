import { test, expect } from './BaseTest'
import { faker } from '@faker-js/faker'



test('[@Smoke] Adding a employee', async ({ pm }) => {
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    let employeeId = String(faker.number.int({ min: 10000000, max: 99999999 }));
    await pm.getDashBoardPage().navigatesToPIMPage();
    await pm.getPIMPage().navigatesToAddEmployeePage();
    await pm.getPIMPage().addEmployee(firstName, lastName, employeeId)
    await pm.getPIMPage().navigatesToEmployeeListPage();
    const oldText = await pm.getPIMPage().noOfRecordText.textContent();
    await pm.getPIMPage().searchEmployeeWithEmployeeId(employeeId)
    await expect(pm.getPIMPage().noOfRecordText).not.toHaveText(oldText, { timeout: 5000 });
    let NoOfRecordText = await pm.getPIMPage().noOfRecordText.textContent();
    const match = (NoOfRecordText.match(/\d+/))
    const count = match ? parseInt(match[0], 10) : 0;
    expect(count).toBe(1)
});