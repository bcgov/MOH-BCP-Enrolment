import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BaseDataService } from '../../../services/base-data.service';
import { BRITISH_COLUMBIA } from 'moh-common-lib';
import {
  prepareDeclarationTextForAPI,
  stripPostalCodeSpaces,
  stripPhoneFormatting,
  convertToJSONDate } from '../../core-bcp/models/helperFunc';

@Injectable({
  providedIn: 'root'
})
export class UpdateFacilityDataService extends BaseDataService {

  constructor() {
    super();
    if (environment.useDummyData) {
      this.firstName = 'Mock First Name';
      this.lastName = 'Mock Last Name';
      this.email = 'test@example.com';
      this.phone = '2501231234';
      this.phoneExt = '123';
      this.facilityName = 'Test Facility';
      this.facilityMSPNumber = '89902';
      this.facilityFax = '2511231234';

      this.checkChangeAdminInfo = false;
      this.changeAdminInfoFirstName = 'TEST';
      this.changeAdminInfoLastName = 'PRIVATEPRACTICE';
      this.changeAdminInfoMSPPracNumber = '89902';
      this.changeAdminInfoEmail = 'email@email.com';
      this.changeAdminInfoPhoneNumber = '2501231231';
      this.changeAdminInfoEffectiveDate = new Date(2020, 3, 1);
      this.otherChangeRequests = 'test\ntest\ntest\ntest\ntest\ntest';
    }

        // Partial setup for using data in back end
    if (environment.useMockBackendData) {
    }
  }

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneExt: string;
  facilityName: string;
  facilityMSPNumber: string;
  facilityFax: string;

  checkChangeFacilityAddress: boolean = false;
  checkChangeMailingAddress: boolean = false;
  checkChangeAppliesFees: boolean = false;
  checkCancelBCP: boolean = false;
  checkChangeBCPEffectiveDate: boolean = false;
  checkChangeBCPCancelDate: boolean = false;
  checkChangeAdminInfo: boolean = false;
  checkCancelFacilityNumber: boolean = false;
  otherChangeRequests: string = '';

  changeFacilityAddressPreviousAddress: string;
  changeFacilityAddressPreviousCity: string;
  changeFacilityAddressPreviousPostalCode: string;
  changeFacilityAddressPreviousFax: string;
  changeFacilityAddressNewAddress: string;
  changeFacilityAddressNewCity: string;
  changeFacilityAddressNewPostalCode: string;
  changeFacilityAddressNewFax: string;
  changeFacilityAddressEffectiveDate: Date;

  changeMailingAddressPreviousAddress: string;
  changeMailingAddressPreviousCity: string;
  changeMailingAddressPreviousPostalCode: string;
  changeMailingAddressNewAddress: string;
  changeMailingAddressNewCity: string;
  changeMailingAddressNewPostalCode: string;
  changeMailingAddressEffectiveDate: Date;

  changeAppliesFeesEffectiveDate: Date;
  cancelBCPEffectiveDate: Date;
  changeBCPEffectiveDateEffectiveDate: Date;
  changeBCPCancelDateCancelDate: Date;

  changeAdminInfoFirstName: string;
  changeAdminInfoLastName: string;
  changeAdminInfoMSPPracNumber: string;
  changeAdminInfoEmail: string;
  changeAdminInfoPhoneNumber: string;
  changeAdminInfoPhoneNumberExt: string;
  changeAdminInfoEffectiveDate: Date;

  cancelFacilityNumberCancelDate: Date;


  jsonSubmission = {
    request: null,
    response: null
  };

  readonly declarationText = `I understand that:
  <ol class='no-bullets'>
      <li>i. this is a legal document and I represent that the information that I have provided on this document is true to the best of my knowledge;</li>
      <li>ii. MSP is a public system based on trust, but also that claims, including those portions relating to the Business Cost Premium, are subject to audit and financial recovery for claims made contrary to the Medicare Protection Act (the "Act"); and</li>
      <li>iii. submitting false or misleading claims information is an offence under the Act and may be an offence under the Criminal Code of Canada.</li>
  </ol>`;

  get declarationTextForAPI() {
    return prepareDeclarationTextForAPI(this.declarationText);
  }

  get declarationTextForHtml(): string {
    const text = this.declarationText.replace(/<li>\w+\. /g, '<li>');
    return text.replace('class=\'no-bullets\'', 'type=\'i\'');
  }

  // Abstract method
  getJSONPayload() {

    const jsonPayLoad: any = {
      informationConsentAgreement: this.informationCollectionNoticeConsent,
      administrator: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phoneNumber: stripPhoneFormatting(this.phone),
        extension: this.phoneExt
      },
      facility: {
        name: this.facilityName,
        number: this.facilityMSPNumber,
        faxNumber: stripPhoneFormatting(this.facilityFax),
      },
      otherChangeRequest: this.otherChangeRequests,
      dateOfAcceptance: convertToJSONDate(this.dateOfAcceptance),
      declarationText: this.declarationTextForAPI,
    };

    if (this.checkChangeFacilityAddress) {
      jsonPayLoad.changeFacilityAddress = {
        prevAddress: this.changeFacilityAddressPreviousAddress,
        prevCity: this.changeFacilityAddressPreviousCity,
        prevProvince: 'BC',
        prevPostalCode: stripPostalCodeSpaces(this.changeFacilityAddressPreviousPostalCode),
        prevFaxNumber: stripPhoneFormatting(this.changeFacilityAddressPreviousFax),
        newAddress: this.changeFacilityAddressNewAddress,
        newCity: this.changeFacilityAddressNewCity,
        newProvince: 'BC',
        newPostalCode: stripPostalCodeSpaces(this.changeFacilityAddressNewPostalCode),
        newFaxNumber: stripPhoneFormatting(this.changeFacilityAddressNewFax),
        effectiveDate: convertToJSONDate(this.changeFacilityAddressEffectiveDate)
      };
    }
    if (this.checkChangeMailingAddress) {
      jsonPayLoad.changeMailingAddress = {
        prevAddress: this.changeMailingAddressPreviousAddress,
        prevCity: this.changeMailingAddressPreviousCity,
        prevProvince: 'BC',
        prevPostalCode: stripPostalCodeSpaces(this.changeMailingAddressPreviousPostalCode),
        newAddress: this.changeMailingAddressNewAddress,
        newCity: this.changeMailingAddressNewCity,
        newProvince: 'BC',
        newPostalCode: stripPostalCodeSpaces(this.changeMailingAddressNewPostalCode),
        effectiveDate: convertToJSONDate(this.changeMailingAddressEffectiveDate)
      };
    }
    if (this.checkChangeAppliesFees) {
      jsonPayLoad.requestBCPEffectiveDate = convertToJSONDate(this.changeAppliesFeesEffectiveDate);
    }
    if (this.checkCancelBCP) {
      jsonPayLoad.cancelBCPDate = convertToJSONDate(this.cancelBCPEffectiveDate);
    }
    if (this.checkChangeBCPEffectiveDate) {
      jsonPayLoad.changeBCPEffectiveDate = convertToJSONDate(this.changeBCPEffectiveDateEffectiveDate);
    }
    if (this.checkChangeBCPCancelDate) {
      jsonPayLoad.changeBCPCancelDate = convertToJSONDate(this.changeBCPCancelDateCancelDate);
    }
    if (this.checkChangeAdminInfo) {
      jsonPayLoad.changeAdministrator = {
        firstName: this.changeAdminInfoFirstName,
        lastName: this.changeAdminInfoLastName,
        pracNumber: this.changeAdminInfoMSPPracNumber,
        email: this.changeAdminInfoEmail,
        phoneNumber: stripPhoneFormatting(this.changeAdminInfoPhoneNumber),
        extension: this.changeAdminInfoPhoneNumberExt,
        effectiveDate: convertToJSONDate(this.changeAdminInfoEffectiveDate)
      };
    }
    if (this.checkCancelFacilityNumber) {
      jsonPayLoad.cancelFacilityNumberDate = convertToJSONDate(this.cancelFacilityNumberCancelDate);
    }

    return jsonPayLoad;
  }

}
