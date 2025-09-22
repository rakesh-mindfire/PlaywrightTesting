import { test, expect } from '../utils/BaseTest'
import { faker } from '@faker-js/faker'



test('Adding a vacancy', async ({ pm }) => {
    let VacancyName = 'Software Developer-' + faker.number.int({ min: 1, max: 1000 })
    //creating a vacancy
    await pm.getHomePage().navigatesToRecruitmentPage();
    await pm.getRecruitmentPage().navigatesToVacanciesPage();
    await pm.getRecruitmentPage().addAVacancy(VacancyName, 't', '5')

    //verifying the vacancy is created
    await pm.getHomePage().navigatesToRecruitmentPage();
    await pm.getRecruitmentPage().navigatesToVacanciesPage();
    const oldText = await pm.getRecruitmentPage().noOfRecordText.textContent();
    await pm.getRecruitmentPage().searchAVacancy(VacancyName, "Software Engineer")
    await expect(pm.getRecruitmentPage().noOfRecordText).not.toHaveText(oldText, { timeout: 5000 });

    //verified the no of record is 1
    let NoOfRecordText = await pm.getRecruitmentPage().noOfRecordText.textContent();
    const match = (NoOfRecordText.match(/\d+/))
    const count = match ? parseInt(match[0], 10) : 0;
    expect(count).toBe(1)
    //Marking the TC as Fail
    expect(count).toBe(10)
});
