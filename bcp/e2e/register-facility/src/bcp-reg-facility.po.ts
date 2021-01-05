import { browser, by, element, protractor, Key } from 'protractor';
import { AbstractTestPage } from 'moh-common-lib/e2e';
import { CREATE_FACILITY_PAGES } from '../../../src/app/modules/create-facility/create-facility-route-constants';
import * as fs from 'fs';
import * as sampleFile from './bcprf-data.json';

/**
 * This class is for GENERAL functions, and all those that target components
 * from the moh-common-lib.  The long-term plan will be to move these over to
 * `moh-common-lib/testing` once created. That way different Angular projects
 * can use the same e2e starting board.
 */

export function getJSONData() {
    const input = process.argv.filter(x => x.startsWith('--data'));
    if (input.toString() !== '') {
        const filename = input.toString().split('=')[1];
        const data = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data);
    } else {
        return sampleFile;
    }
}

export class BCPBasePage extends AbstractTestPage {

    protected jsonData = getJSONData();
    protected index: number;

    setIndex(index: number) {
        this.index = index;
    }

    navigateTo() {
        return browser.get('');
    }

    clickContinue() {
        element(by.cssContainingText('button', ' Continue ')).click();
    }

    typeText(labelVal: string, text: string) {
        element(by.cssContainingText('label', `${labelVal}`)).element(by.xpath('../..'))
            .element(by.css('input')).sendKeys(text);
    }

    clickOption(legendVal: string, forVal: string) {
        element(by.cssContainingText('legend', `${legendVal}`)).element(by.xpath('../..'))
            .element(by.css(`label[for^="${forVal}"]`)).click();
    }

    clickRadioButton(nameVal: string, forVal: string) {
        element(by.css(`common-radio[name^=${nameVal}]`)).element(by.css(`label[for^="${forVal}"]`)).click();
    }

    getData() {
        return this.jsonData;
    }

    getInputValue(labelVal: string) {
        return element(by.cssContainingText('label', `${labelVal}`)).element(by.xpath('../..')).element(by.css('input')).getAttribute('value');
    }

    getExtension() {
        return element(by.css('input[name="extension"]')).getAttribute('value');
    }
}

export class BCPHomePage extends BCPBasePage {

    navigateTo() {
      return browser.get(CREATE_FACILITY_PAGES.HOME.fullpath);
    }

    typeCaptcha(text: string) {
        element(by.css('input[id="answer"]')).sendKeys(text);
    }

    checkConsent() {
        element(by.css('label[for="agree"]')).click();
    }

    clickModalContinue() {
        element(by.css('button[type="submit"]')).click();
    }

    fillPage(index: number) {
        this.setIndex(index);
        this.typeCaptcha('irobot');
        this.checkConsent();
        this.clickModalContinue();
        this.clickContinue();
    }
}

export class BCPAdminPage extends BCPBasePage {

    navigateTo() {
      return browser.get(CREATE_FACILITY_PAGES.FACILITY_ADMIN.fullpath);
    }

    fillPage(index: number) {
        this.setIndex(index);
        this.typeText('First name', this.jsonData[this.index].facilityAdminFirstName);
        this.typeText('Last name', this.jsonData[this.index].facilityAdminLastName);
        this.typeText('Medical Services Plan Practitioner Number', this.jsonData[this.index].MSPPractitionerNum);
        this.typeText('Contact email (optional)', this.jsonData[this.index].emailAdd);
        this.typeText('Contact phone number', this.jsonData[this.index].phoneNum);
        this.typeText('Extension (optional)', this.jsonData[this.index].extension);
        browser.sleep(2000);
    }

    checkAdminInputValues(index: number) {
        this.getInputValue('First name').then(firstName => {
            expect(firstName).toBe(this.jsonData[this.index].facilityAdminFirstName, 'First name values should be the same');
        });
        this.getInputValue('Last name').then(lastName => {
            expect(lastName).toBe(this.jsonData[this.index].facilityAdminLastName, 'Last name values should be the same');
        });
        this.getInputValue('Medical Services Plan Practitioner Number').then(mspPracNum => {
            expect(mspPracNum).toBe(this.jsonData[this.index].MSPPractitionerNum, 'MSP Practitioner values should be the same');
        });
        this.getInputValue('Contact email (optional)').then(contactEmail => {
            expect(contactEmail).toBe(this.jsonData[this.index].emailAdd, 'Email address values should be the same');
        });
        this.getInputValue('Contact phone number').then(contactPhone => {
            expect(contactPhone.replace(/[^0-9]/g, '')).toBe(this.jsonData[this.index].phoneNum, 'Phone number values should be the same');
        });
        // this.getExtension().then(extension => {
        //     expect(extension).toBe(this.jsonData[this.index].extension, 'Extension values should be the same');
        // });
    }
}

export class BCPInfoPage extends BCPBasePage {

    navigateTo() {
        return browser.get(CREATE_FACILITY_PAGES.FACILITY_INFO.fullpath);
    }

    typeMailingCity(text: string) {
        element(by.css('common-city[name="mailingfacAdminFirstNameCity"]')).element(by.css('input')).sendKeys(text);
    }

    typeMailingPostal(text: string) {
        element(by.css('common-postal-code[name="facilityPostalCode"]')).element(by.css('input')).sendKeys(text);
    }

    typeDate(legendVal: string, year: string, month: string, day: string) {
        const months = [ 'January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December' ];
        element(by.cssContainingText('legend', `${legendVal}`)).element(by.xpath('../..'))
           .element(by.css('select[id^="month"]')).sendKeys(months[parseInt(month, 10) - 1]);
        // element(by.cssContainingText('legend', `${legendVal}`)).element(by.xpath('../..'))
        //     .element(by.css(`option[value="${month}"]`)).click();
        element(by.css('input[id^="day"]')).click();
        element(by.css('input[id^="day"]')).sendKeys(day);
        element(by.css(`input[id^="year"]`)).sendKeys(year);
    }

    fillPage(index: number) {
        this.setIndex(index);
        this.typeText('Facility or practice name', this.jsonData[this.index].facilityName);
        this.typeText('Physical address', this.jsonData[this.index].address);
        this.typeText('City', this.jsonData[this.index].city);
        this.scrollDown();
        this.typeText('Postal code', this.jsonData[this.index].postal);
        this.typeText('Contact fax number (optional)', this.jsonData[this.index].faxNum);

        const effectiveDate = this.jsonData[this.index].effectiveDate;
        const year = effectiveDate.split('-')[0];
        const month = effectiveDate.split('-')[1];
        const day = effectiveDate.split('-')[2];
        this.typeDate('Facility effective date', year, month, day);
        this.scrollDown();
        this.clickOption('Is the mailing address the same as the physical facility address?',
        this.jsonData[this.index].hasSameMailingAddress.toString());
        if (!this.jsonData[this.index].hasSameMailingAddress) {
            this.typeText('Mailing address', this.jsonData[this.index].mailingAddress);
            this.typeMailingCity(this.jsonData[this.index].mailingCity);
            this.typeMailingPostal(this.jsonData[this.index].mailingPostal);
            this.scrollDown();
        }
        this.clickRadioButton('isQualifyForBCP', this.jsonData[this.index].qualifyForBCP);
        browser.sleep(2000);
    }

    hasWarningMessage() {
        return element(by.css('div[class="message-container border-warning"]')).isPresent();
    }

    checkInfoInputValues(index: number) {
        this.getInputValue('Facility or practice name').then(faciName => {
            expect(faciName).toBe(this.jsonData[this.index].facilityName, 'Facility name values should be the same');
        });
        this.getInputValue('Physical address').then(address => {
            expect(address).toBe(this.jsonData[this.index].address, 'Physical address values should be the same');
        });
        this.getInputValue('City').then(city => {
            expect(city).toBe(this.jsonData[this.index].city, 'City values should be the same');
        });
        this.getInputValue('Postal code').then(postalCode => {
            expect(postalCode.replace(/[^A-Z0-9]/g, '')).toBe(this.jsonData[this.index].postal, 'Postal values should be the same');
        });
        this.getInputValue('Contact fax number (optional)').then(faxNum => {
            expect(faxNum.replace(/[^0-9]/g, '')).toBe(this.jsonData[this.index].faxNum, 'Fax number values should be the same');
        });
    }
}

export class BCPReviewPage extends BCPBasePage {

    navigateTo() {
        return browser.get(CREATE_FACILITY_PAGES.REVIEW.fullpath);
    }

    clickSubmit() {
        element(by.cssContainingText('button', ' Submit ')).click();
    }

    writeSignature() {
        element(by.cssContainingText('button', 'Sign')).click();
        element(by.css('canvas')).click();
        element(by.cssContainingText('button', 'Accept')).click();
    }

    fillPage(index: number) {
        this.setIndex(index);
        this.scrollDown();
        this.writeSignature();
        this.clickSubmit();
    }

    /*
    hasSameData(label: string, data: string) {
        return element(by.cssContainingText('div', `${label}`)).element(by.xpath('../..')).element(by.cssContainingText('b', `${data}`));
    }

    checkDisplayInformation(index: number) {
        this.hasSameData(' First name: ', this.jsonData[index].facilityAdminFirstName.toString()).then(value => {
            expect(value).toBe(true, 'First name should be displayed correctly');
        });
    }
    */
}
