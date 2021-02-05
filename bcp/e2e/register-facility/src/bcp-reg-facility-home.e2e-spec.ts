import { browser } from 'protractor';
import { BCPHomePage, BCPBasePage } from './bcp-reg-facility.po';
import { CREATE_FACILITY_PAGES } from '../../../src/app/modules/create-facility/create-facility-route-constants';

describe('BCP Create Facility - Home Page (Unit Test)', () => {

    let page: BCPBasePage;
    let homePage: BCPHomePage;

    beforeEach(() => {
        homePage = new BCPHomePage();
        page = new BCPBasePage();
    });

    it('01. should not be able to continue if captcha is empty', () => {
        homePage.navigateTo();
        homePage.clickModalContinue();
        expect(browser.getCurrentUrl()).toContain(CREATE_FACILITY_PAGES.HOME.fullpath, 'the modal should stay and user cant continue');
    });

    it('02. should not be able to continue if captcha is wrong/invalid', () => {
        homePage.navigateTo();
        homePage.typeCaptcha('sample');
        homePage.clickModalContinue();
        expect(browser.getCurrentUrl()).toContain(CREATE_FACILITY_PAGES.HOME.fullpath, 'the modal should stay and user cant continue');
    });

    it('03. should be able to continue if captcha is correct', () => {
        homePage.navigateTo();
        homePage.typeCaptcha('irobot');
        homePage.checkConsent();
        homePage.clickModalContinue();
        homePage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(CREATE_FACILITY_PAGES.FACILITY_ADMIN.fullpath, 'should continue to the Facility Admin Page');
    });

});
