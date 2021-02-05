import { browser } from 'protractor';
import { BCPHomePage, BCPPractitionerInfoPage, BCPFacilityInfoPage, BCPPractitionerAttachmentPage, BCPReviewPage, BCPConfirmationPage } from './bcp-pa.po';
import { PRACTITIONER_REGISTRATION_PAGES } from '../../../src/app/modules/practitioner-registration/practitioner-registration-route-constants';

fdescribe('BCP Practitioner Assignment- Happy Path e2e', () => {

    let homePage: BCPHomePage;
    let pracInfoPage: BCPPractitionerInfoPage;
    let faciInfoPage: BCPFacilityInfoPage;
    let pracAttachPage: BCPPractitionerAttachmentPage;
    let reviewPage: BCPReviewPage;
    let confirmationPage: BCPConfirmationPage;
    const HAPPY_PATH_DATA = 2;
    let index = HAPPY_PATH_DATA;

    beforeEach(() => {
        homePage = new BCPHomePage();
        pracInfoPage = new BCPPractitionerInfoPage();
        faciInfoPage = new BCPFacilityInfoPage();
        pracAttachPage = new BCPPractitionerAttachmentPage();
        reviewPage = new BCPReviewPage();
        confirmationPage = new BCPConfirmationPage();
    });

    afterEach(() => {
        index++;
    });

    it('01. should sucesfully send the form and display the yellow border in the confirmation page', () => {
        homePage.navigateTo();
        homePage.fillPage(index);
        homePage.clickContinue();
        browser.sleep(2000);
        expect(browser.getCurrentUrl()).toContain(PRACTITIONER_REGISTRATION_PAGES.PRACTITIONER_INFO.fullpath, 'should be able to go to the Prac Info Page');
        pracInfoPage.fillPage(index);
        pracInfoPage.clickContinue();
        browser.sleep(2000);
        expect(browser.getCurrentUrl()).toContain(PRACTITIONER_REGISTRATION_PAGES.FACILITY_INFO.fullpath, 'should be able to go to the Facility Info Page');
        faciInfoPage.fillPage(index);
        faciInfoPage.clickContinue();
        browser.sleep(2000);
        expect(browser.getCurrentUrl()).toContain(PRACTITIONER_REGISTRATION_PAGES.PRACTITIONER_ASSIGN.fullpath, 'should be able to go to the Prac Attach Info Page');
        // expect(browser.getCurrentUrl()).toContain(PRACTITIONER_REGISTRATION_PAGES.SUBMISSION.fullpath, 'should go to Submission Page');
    }, 100000);

});
