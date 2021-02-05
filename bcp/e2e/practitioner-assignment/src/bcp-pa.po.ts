import { browser, by, element, protractor, Key } from 'protractor';
import { AbstractTestPage } from 'moh-common-lib/e2e';
import { PRACTITIONER_REGISTRATION_PAGES } from '../../../src/app/modules/practitioner-registration/practitioner-registration-route-constants';
import * as fs from 'fs';
import * as sampleFile from './bcppa-data.json';
import { PRACTITIONER_ATTACHMENT } from '../../../src/app/modules/practitioner-registration/models/practitioner-attachment';

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

    typeDate(legendVal: string, year: string, month: string, day: string) {
        const months = [ 'January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December' ];
        element(by.cssContainingText('legend', `${legendVal}`)).element(by.xpath('../..'))
            .element(by.css('select[id^="month"]')).sendKeys(months[parseInt(month, 10) - 1]);
        // element(by.cssContainingText('legend', `${legendVal}`)).element(by.xpath('../..'))
        //     .element(by.css(`option[value="${month}"]`)).click();
        element(by.cssContainingText('legend', `${legendVal}`)).element(by.xpath('../..'))
            .element(by.css(`input[id^="day"]`)).click();
        element(by.cssContainingText('legend', `${legendVal}`)).element(by.xpath('../..'))
            .element(by.css(`input[id^="day"]`)).sendKeys(day);
        element(by.cssContainingText('legend', `${legendVal}`)).element(by.xpath('../..'))
            .element(by.css(`input[id^="year"]`)).sendKeys(year);
    }
}

export class BCPHomePage extends BCPBasePage {

    navigateTo() {
      return browser.get(PRACTITIONER_REGISTRATION_PAGES.HOME.fullpath);
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
    }
}

export class BCPPractitionerInfoPage extends BCPBasePage {

    navigateTo() {
      return browser.get(PRACTITIONER_REGISTRATION_PAGES.PRACTITIONER_INFO.fullpath);
    }

    fillPage(index: number) {
        this.setIndex(index);
        this.typeText('First name', this.jsonData[this.index].firstName);
        this.typeText('Last name', this.jsonData[this.index].lastName);
        this.typeText('Medical Services Plan Practitioner Number', this.jsonData[this.index].MSPPractitionerNum);
        this.typeText('Email address (optional)', this.jsonData[this.index].emailAdd);
        this.typeText('Phone number', this.jsonData[this.index].phoneNum);
        this.typeText('Extension', this.jsonData[this.index].extension);
    }

    checkPracInfoInputValues(index: number) {
        this.getInputValue('First name').then(firstName => {
            expect(firstName).toBe(this.jsonData[this.index].firstName, 'First name values should be the same');
        });
        this.getInputValue('Last name').then(lastName => {
            expect(lastName).toBe(this.jsonData[this.index].lastName, 'Last name values should be the same');
        });
        this.getInputValue('Medical Services Plan Practitioner Number').then(MSPPractitionerNum => {
            expect(MSPPractitionerNum).toBe(this.jsonData[this.index].MSPPractitionerNum, 'MSP Practitioner values should be the same');
        });
        this.getInputValue('Email address (optional)').then(emailAdd => {
            expect(emailAdd).toBe(this.jsonData[this.index].emailAdd, 'Email address values should be the same');
        });
        this.getInputValue('Phone number').then(phoneNum => {
            expect(phoneNum.replace(/[^0-9]/g, '')).toBe(this.jsonData[this.index].phoneNum, 'Phone number values should be the same');
        });
        // this.getExtension().then(extension => {
        //     expect(extension).toBe(this.jsonData[this.index].extension, 'Extension values should be the same');
        // });
    }
}

export class BCPFacilityInfoPage extends BCPBasePage {

    navigateTo() {
        return browser.get(PRACTITIONER_REGISTRATION_PAGES.FACILITY_INFO.fullpath);
    }

    typeMailingCity(text: string) {
        element(by.css('common-city[name="mailingfacAdminFirstNameCity"]')).element(by.css('input')).sendKeys(text);
    }

    typeMailingPostal(text: string) {
        element(by.css('common-postal-code[name="facilityPostalCode"]')).element(by.css('input')).sendKeys(text);
    }

    fillPage(index: number) {
        this.setIndex(index);
        this.typeText('Facility or practice name', this.jsonData[this.index].facilityName);
        this.typeText('Medical Services Plan Facility Number', this.jsonData[this.index].MSPFacilityNum);
        this.typeText('Physical address', this.jsonData[this.index].physicalAddress);
        this.typeText('City', this.jsonData[this.index].city);
        this.typeText('Postal code', this.jsonData[this.index].postal);
        this.typeText('Fax number (optional)', this.jsonData[this.index].faxNum);
    }

    checkInfoInputValues(index: number) {
        this.getInputValue('Facility or practice name').then(faciName => {
            expect(faciName).toBe(this.jsonData[this.index].facilityName, 'Facility name values should be the same');
        });
        this.getInputValue('Medical Services Plan Facility Number').then(faciNum => {
            expect(faciNum).toBe(this.jsonData[this.index].MSPFacilityNum, 'MSP Facility Num values should be the same');
        });
        this.getInputValue('Physical address').then(address => {
            expect(address).toBe(this.jsonData[this.index].physicalAddress, 'Physical address values should be the same');
        });
        this.getInputValue('City').then(city => {
            expect(city).toBe(this.jsonData[this.index].city, 'City values should be the same');
        });
        this.getInputValue('Postal code').then(postalCode => {
            expect(postalCode.replace(/[^A-Z0-9]/g, '')).toBe(this.jsonData[this.index].postal, 'Postal values should be the same');
        });
        this.getInputValue('Fax number (optional)').then(faxNum => {
            expect(faxNum.replace(/[^0-9]/g, '')).toBe(this.jsonData[this.index].faxNum, 'Fax number values should be the same');
        });
    }
}

export class BCPPractitionerAttachmentPage extends BCPBasePage {

    navigateTo() {
        return browser.get(PRACTITIONER_REGISTRATION_PAGES.PRACTITIONER_ASSIGN.fullpath);
    }

    fillPage(index: number) {
        this.setIndex(index);
        const changeAttach = this.jsonData[this.index].changeAttach;
        this.clickOption('What change are you making for this attachment', changeAttach);
        this.scrollDown();
        if (changeAttach === 'new') {
            const effectiveDate = this.jsonData[this.index].effectiveDate;
            const eYear = effectiveDate.split('-')[0];
            const eMonth = effectiveDate.split('-')[1];
            const eDay = effectiveDate.split('-')[2];
            this.typeDate('Effective date for new attachment', eYear, eMonth, eDay);
            this.scrollDown();
            this.clickOption('Is this a Locum or other temporary attachment?', this.jsonData[this.index].isAttachmentLocum);
            if (this.jsonData[this.index].isAttachmentLocum === true) {
                const cancellationDate = this.jsonData[this.index].cancellationDate;
                const cYear = cancellationDate.split('-')[0];
                const cMonth = cancellationDate.split('-')[1];
                const cDay = cancellationDate.split('-')[2];
                this.typeDate('Cancellation date for new attachment', cYear, cMonth, cDay);
            }
        } else if (changeAttach === 'cancel') {
            const cancellationDate = this.jsonData[this.index].cancellationDate;
            const cYear = cancellationDate.split('-')[0];
            const cMonth = cancellationDate.split('-')[1];
            const cDay = cancellationDate.split('-')[2];
            this.typeDate('Cancellation date for existing attachment', cYear, cMonth, cDay);
        } else if (changeAttach === 'change') {
            const newEffectiveDate = this.jsonData[this.index].newEffectiveDate;
            const neYear = newEffectiveDate.split('-')[0];
            const neMonth = newEffectiveDate.split('-')[1];
            const neDay = newEffectiveDate.split('-')[2];
            this.typeDate('New effective date for existing attachment (if applicable)', neYear, neMonth, neDay);
            const newCancellationDate = this.jsonData[this.index].newCancellationDate;
            const ncYear = newCancellationDate.split('-')[0];
            const ncMonth = newCancellationDate.split('-')[1];
            const ncDay = newCancellationDate.split('-')[2];
            this.typeDate('New cancellation date for existing attachment (if applicable)', ncYear, ncMonth, ncDay);
        } else {
            return;
        }
    }

}

export class BCPReviewPage extends BCPBasePage {

    navigateTo() {
        return browser.get(PRACTITIONER_REGISTRATION_PAGES.REVIEW.fullpath);
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

}

export class BCPConfirmationPage extends BCPBasePage {

    navigateTo() {
        return browser.get(PRACTITIONER_REGISTRATION_PAGES.SUBMISSION.fullpath);
    }

}
