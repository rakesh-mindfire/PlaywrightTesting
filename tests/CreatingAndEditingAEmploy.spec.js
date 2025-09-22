import { test, expect } from '../utils/BaseTest'
import { faker } from '@faker-js/faker'


test.describe('Adding & editing a employ', () => {
    test('[@Smoke] Adding a employee', async ({ pm }) => {
        //Generating the firstname, Lastname & employeeId for employ
        let firstName = faker.person.firstName();
        let lastName = faker.person.lastName();
        let employeeId = String(faker.number.int({ min: 10000000, max: 99999999 }));
        await pm.getHomePage().navigatesToPIMPage();
        await pm.getPIMPage().navigatesToAddEmployeePage();

        //Adding a new employ
        await pm.getPIMPage().addEmployee(firstName, lastName, employeeId)
        await pm.getPIMPage().navigatesToEmployeeListPage();
        const oldText = await pm.getPIMPage().noOfRecordText.textContent();
        //Searching the employ
        await pm.getPIMPage().searchEmployeeWithEmployeeId(employeeId)
        await expect(pm.getPIMPage().noOfRecordText).not.toHaveText(oldText, { timeout: 5000 });

        //verified the no of record is 1
        let NoOfRecordText = await pm.getPIMPage().noOfRecordText.textContent();
        const match = (NoOfRecordText.match(/\d+/))
        const count = match ? parseInt(match[0], 10) : 0;
        expect(count).toBe(1)

    });
    test('Editing a employee', async ({ pm }) => {
        await pm.getHomePage().navigatesToPIMPage();
        //Capturing the Id, Firstname ,MiddleName & Lastname before editing.
        let recordIndex = 0
        let id = await pm.getAdminPage().getCellText(recordIndex, 1);
        let oldFirstAndMiddleName = await pm.getAdminPage().getCellText(recordIndex, 2);
        let oldLastName = await pm.getAdminPage().getCellText(recordIndex, 3);
        //Creating firstName Middlename & lastName for update
        let firstName = faker.person.firstName();
        let middleName = faker.person.middleName();
        let lastName = faker.person.lastName();

        //Editing the employName
        await pm.getPIMPage().editNameOfAEmployee(recordIndex, firstName, middleName, lastName);
        await pm.getPIMPage().navigatesToEmployeeListPage();
        const oldText = await pm.getPIMPage().noOfRecordText.textContent();
        await pm.getPIMPage().searchEmployeeWithEmployeeId(id)
        await expect(pm.getPIMPage().noOfRecordText).not.toHaveText(oldText, { timeout: 5000 });

        //Verifying No of record is 1
        let NoOfRecordText = await pm.getPIMPage().noOfRecordText.textContent();
        const match = (NoOfRecordText.match(/\d+/))
        const count = match ? parseInt(match[0], 10) : 0;
        expect(count).toBe(1)

        //Verification of Name
        let newFirstAndMiddleName = await pm.getAdminPage().getCellText(recordIndex, 2);
        let newLastName = await pm.getAdminPage().getCellText(recordIndex, 3);
        expect(newFirstAndMiddleName).toBe(firstName + " " + middleName)
        expect(newLastName).toBe(lastName)
        expect(oldFirstAndMiddleName).not.toBe(newFirstAndMiddleName)
        expect(oldLastName).not.toBe(newLastName)

    });
});
