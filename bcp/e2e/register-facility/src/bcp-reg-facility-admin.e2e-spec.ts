import { browser } from 'protractor';
import { BCPAdminPage } from './bcp-reg-facility.po';
import { CREATE_FACILITY_PAGES } from '../../../src/app/modules/create-facility/create-facility-route-constants';

describe('BCP Create Facility - Administrator Information Page (Unit Test)', () => {

    let adminPage: BCPAdminPage;
    let index = 0;

    beforeEach(() => {
        adminPage = new BCPAdminPage();
    });

    afterEach(() => {
        index++;
    });

    it('01. should be a MATCH since the Admin Info for Chiropractor is VALID', () => {
        adminPage.navigateTo();
        adminPage.fillPage(index);
        adminPage.clickContinue();
        browser.sleep(10000);
        expect(browser.getCurrentUrl()).toContain(CREATE_FACILITY_PAGES.FACILITY_INFO.fullpath, 'should go to the Facility Info Page');
    }, 100000);

    it('02. should be a NO MATCH since the Practitioner Number for Chiropractor is INVALID', () => {
        adminPage.navigateTo();
        adminPage.fillPage(index);
        adminPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(CREATE_FACILITY_PAGES.FACILITY_ADMIN.fullpath, 'should NOT navigate to the next page');
    }, 100000);

    it('03. should be a NO MATCH since the Last Name for Private Practice is INVALID', () => {
        adminPage.navigateTo();
        adminPage.fillPage(index);
        adminPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(CREATE_FACILITY_PAGES.FACILITY_ADMIN.fullpath, 'should NOT navigate to the next page');
    }, 100000);

    it('04. should be a MATCH since the Admin Info for Private Practice is VALID', () => {
        adminPage.navigateTo();
        adminPage.fillPage(index);
        adminPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(CREATE_FACILITY_PAGES.FACILITY_INFO.fullpath, 'should go to the Facility Info Page');
    }, 100000);

    it('05. should result in an ERROR if the user inserts non-printable characters into the input fields', () => {
        adminPage.navigateTo();
        adminPage.fillPage(index);
        adminPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(CREATE_FACILITY_PAGES.FACILITY_ADMIN.fullpath, 'should NOT navigate to the next page');
    }, 100000);

    it('06. should verify that a user can only enter up to the max length of input fields', () => {
        adminPage.navigateTo();
        adminPage.fillPage(index);
        adminPage.clickContinue();
        adminPage.checkAdminInputValues(index);
    }, 100000);

    it('07. should result in an ERROR if the user inserts a non-numeric practitioner number', () => {
        adminPage.navigateTo();
        adminPage.fillPage(index);
        adminPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(CREATE_FACILITY_PAGES.FACILITY_ADMIN.fullpath, 'should NOT navigate to the next page');
    }, 100000);

});
