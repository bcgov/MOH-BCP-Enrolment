import { browser } from 'protractor';
import { BCPInfoPage } from './bcp-reg-facility.po';
import { CREATE_FACILITY_PAGES } from '../../../src/app/modules/create-facility/create-facility-route-constants';

describe('BCP Create Facility - Facility Information Page (Unit Test)', () => {

    let infoPage: BCPInfoPage;
    let index = 0;

    beforeEach(() => {
        infoPage = new BCPInfoPage();
    });

    afterEach(() => {
        index++;
    });

    // VALIDATION TESTS
    it('01. should be able to create a new Facility Name with valid data (NO MATCH)', () => {
        infoPage.navigateTo();
        infoPage.fillPage(index);
        infoPage.clickContinue();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain(CREATE_FACILITY_PAGES.REVIEW.fullpath, 'should continue to the next page');
        infoPage.hasWarningMessage().then(val => {
            expect(val).toBe(false, 'No warning message should NOT be displayed since it is a new facility name');
        });
    });

    it('02. should be able to see a warning message if the Facility Name and Postal Code already exists (NEAR MATCH)', () => {
        infoPage.navigateTo();
        infoPage.fillPage(index);
        infoPage.clickContinue();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain(CREATE_FACILITY_PAGES.REVIEW.fullpath, 'should continue to the next page');
        infoPage.hasWarningMessage().then(val => {
            expect(val).toBe(true, 'A warning message should be displayed since it is an existing facility name');
        });
    });

    it('03. should be able to see a warning message if the Facility Name and Postal Code already exists (EXACT MATCH)', () => {
        infoPage.navigateTo();
        infoPage.fillPage(index);
        infoPage.clickContinue();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain(CREATE_FACILITY_PAGES.REVIEW.fullpath, 'should continue to the next page');
        infoPage.hasWarningMessage().then(val => {
            expect(val).toBe(true, 'A warning message should be displayed since it is an existing facility name');
        });
    });

    it('04. should be able to go through the next page if all the required fields are filled out', () => {
        infoPage.navigateTo();
        infoPage.fillPage(index);
        infoPage.clickContinue();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain(CREATE_FACILITY_PAGES.REVIEW.fullpath, 'should continue to the next page');
    });

    it('05. should result in an ERROR if the user inserts non-printable characters into the input fields', () => {
        infoPage.navigateTo();
        infoPage.fillPage(index);
        infoPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(CREATE_FACILITY_PAGES.FACILITY_INFO.fullpath, 'should NOT navigate to the next page');
    }, 100000);

    it('06. should verify that a user can only enter up to the max length of input fields', () => {
        infoPage.navigateTo();
        infoPage.fillPage(index);
        infoPage.checkInfoInputValues(index);
    }, 100000);

});
