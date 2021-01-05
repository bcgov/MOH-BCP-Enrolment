import { browser } from 'protractor';
import { BCPReviewPage, BCPAdminPage, BCPInfoPage } from './bcp-reg-facility.po';
import { CREATE_FACILITY_PAGES } from '../../../src/app/modules/create-facility/create-facility-route-constants';

describe('BCP Create Facility - Review Page (Unit Test)', () => {

    let reviewPage: BCPReviewPage;
    let adminPage: BCPAdminPage;
    let infoPage: BCPInfoPage;
    const END_TO_END_INDEX = 3;

    beforeEach(() => {
        reviewPage = new BCPReviewPage();
        adminPage = new BCPAdminPage();
        infoPage = new BCPInfoPage();
    });

    it('01. should not be able to continue if signature is not filled out', () => {
        reviewPage.navigateTo();
        reviewPage.scrollDown();
        reviewPage.clickSubmit();
        expect(browser.getCurrentUrl()).toContain(CREATE_FACILITY_PAGES.REVIEW.fullpath, 'should stay on the Review Page');
    });

});
