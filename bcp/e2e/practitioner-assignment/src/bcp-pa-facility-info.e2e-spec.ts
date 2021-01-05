import { browser } from 'protractor';
import { BCPFacilityInfoPage } from './bcp-pa.po';
import { PRACTITIONER_REGISTRATION_PAGES } from '../../../src/app/modules/practitioner-registration/practitioner-registration-route-constants';

describe('BCP Practitioner Assignment- Info Page (Unit Test)', () => {

    let infoPage: BCPFacilityInfoPage;
    let index = 0;

    beforeEach(() => {
        infoPage = new BCPFacilityInfoPage();
    });
    afterEach(() => {
        index++;
    });

    it('01. should be a MATCH since the facility number and postal code are valid', () => {
        infoPage.navigateTo();
        infoPage.fillPage(index);
        infoPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(PRACTITIONER_REGISTRATION_PAGES.PRACTITIONER_ASSIGN.fullpath, 'should continue to the next page');
    });

    it('02. should be a NO MATCH (hard stop) since the information doesnt match the records', () => {
        infoPage.navigateTo();
        infoPage.fillPage(index);
        infoPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(PRACTITIONER_REGISTRATION_PAGES.FACILITY_INFO.fullpath, 'should NOT navigate to the next page - hard stop');
    });

    it('03. should be a MATCH since the facility number and postal code are valid', () => {
        infoPage.navigateTo();
        infoPage.fillPage(index);
        infoPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(PRACTITIONER_REGISTRATION_PAGES.PRACTITIONER_ASSIGN.fullpath, 'should continue to the next page');
    });

    it('04. should be a MATCH since the facility number and postal code are valid', () => {
        infoPage.navigateTo();
        infoPage.fillPage(index);
        infoPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(PRACTITIONER_REGISTRATION_PAGES.PRACTITIONER_ASSIGN.fullpath, 'should continue to the next page');
    });

    it('05. should result in an ERROR if the user inserts non-printable characters into the input fields', () => {
        infoPage.navigateTo();
        infoPage.fillPage(index);
        expect(browser.getCurrentUrl()).toContain(PRACTITIONER_REGISTRATION_PAGES.FACILITY_INFO.fullpath, 'should NOT navigate to the next page');
    });

    it('06. should verify that a user can only enter up to the max length of input fields', () => {
        infoPage.navigateTo();
        infoPage.fillPage(index);
        infoPage.checkInfoInputValues(index);
    });

});
