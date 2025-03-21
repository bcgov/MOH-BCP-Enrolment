import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BRITISH_COLUMBIA } from 'moh-common-lib';
import { convertToJSONDate, stripPhoneFormatting, stripPostalCodeSpaces, prepareDeclarationTextForAPI } from '../../core-bcp/models/helperFunc';
import { BaseDataService } from '../../../services/base-data.service';
import { isThisQuarter } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class CreateFacilityDataService extends BaseDataService {

  //#endregion

  constructor() {
    super();
    if (environment.bypassModal) {
      this.informationCollectionNoticeConsent = true;
    }

    if (environment.useDummyData) {
      // Name and PracNumber will pass backend validation in TEST
      this.facAdminFirstName = 'TEST';
      this.facAdminLastName = 'PRIVATEPRACTICE';
      this.pracNumber = '89902';
      // this.emailAddress = 'test@privatepractice.com'; // optional field
      this.facAdminPhoneNumber = '(222) 222-2221';

      // Following code is as per directions by Adam ref:bcp-68 18/10/2019 10:40AM
      // facility
      this.facInfoFacilityName = 'TODS OF FACILITY';
      this.facInfoPhysicalAddress = '12345 Douglas Street';
      this.facInfoCity = 'Victoria';
      this.facInfoProvince = 'BC';
      this.facInfoPostalCode = 'V8R3C2';
      // this.facInfoPhoneNumber = '(250) 555-1234';
      // this.facInfoPhoneExtension = '444'
      // this.facInfoFaxNumber = '(222) 222-2222'; // optional field
      this.facInfoEffectiveDate = new Date(2020, 0, 10);

      this.facInfoIsSameMailingAddress = true;
      this.facInfoIsQualifyForBCP = true;
      // mailing info
      this.facInfoMailAddress = '12345 Carson Street';
      this.facInfoMailCity = 'Victoria';
      this.facInfoMailProvince = BRITISH_COLUMBIA;
      this.facInfoMailPostalCode = 'V8J 8J8';

      // Review page
      this.dateOfAcceptance = new Date();
    }


    // Partial setup for using data in back end
    if (environment.useMockBackendData) {
      // Name and PracNumber will pass backend validation in TEST
      this.facAdminFirstName = 'TEST';
      this.facAdminLastName = 'PRIVATEPRACTICE';
      this.pracNumber = '99901';
      this.facAdminPhoneNumber = '(222) 222-2221';

      // Following code is as per directions by Adam ref:bcp-68 18/10/2019 10:40AM
      // facility
      this.facInfoFacilityName = 'RiverDale House';
      this.facInfoPhysicalAddress = '12345 Douglas Street';
      this.facInfoCity = 'Victoria';
      this.facInfoProvince = BRITISH_COLUMBIA;
      this.facInfoPostalCode = 'V1V1V1';
      this.facInfoEffectiveDate = new Date(2020, 0, 10);

      this.facInfoIsSameMailingAddress = true;
      this.facInfoIsQualifyForBCP = true;
    }

  }

  // Facility Administrator
  facAdminFirstName: string;
  facAdminLastName: string;
  pracNumber = '';
  emailAddress: string; // optional field
  facAdminPhoneNumber: string;
  facAdminExtension: string;

  // Following code is as per directions by Adam ref:bcp-68 18/10/2019 10:40AM
  // facility info
  facInfoFacilityName: string;
  facInfoPhysicalAddress: string;
  facInfoCity: string;
  facInfoProvince: string = BRITISH_COLUMBIA;
  facInfoPostalCode: string;
  facInfoFaxNumber: string;
  facInfoEffectiveDate: Date;
  facInfoIsSameMailingAddress: boolean | null = null;
  facInfoIsQualifyForBCP: boolean;

  // mailing info
  facInfoMailAddress: string;
  facInfoMailCity: string;
  facInfoMailProvince: string = BRITISH_COLUMBIA;
  facInfoMailPostalCode: string;

  // API responses
  apiDuplicateWarning: boolean = false;

  validateFacilityMessage: string;

  // TODO: Figure out where this variable is used
  // json: any;

  //#endregion

  jsonCreateFacility = {
    request: null,
    response: null
  };

  // constant?
  readonly declarationText = `I understand that:
  <ol class='no-bullets'>
    <li>i. this is a legal document and I represent that the information that I have provided on this document is true to the best of my knowledge;</li>
    <li>ii. MSP is a public system based on trust, but also that claims, including those portions relating to the Business Cost Premium, are subject to audit and financial recovery for claims made contrary to the <em>Medicare Protection Act</em> (the "Act");</li>
    <li>iii. submitting false or misleading claims information is an offence under the Act and may be an offence under the Criminal Code of Canada;</li>
    <li>iv. the Business Cost Premium applies to Eligible Fees claimed by Eligible Physicians (physicians responsible to pay for some or all of the lease, rental, or ownership costs of the community-based office that has been issued an MSP Facility Number). Eligible Physicians must apply separately to be attached to the MSP Facility Number for this facility to claim the Business Cost Premium on Eligible Fees.</li>
    <li>v. (a) any MSP Facility Number issued to this facility is specific to this facility and to the physical address of this facility; (b) the MSP Facility Number issued to this facility will be used to calculate the applicable Business Cost Premium on Eligible Fees payable to Eligible Physicians;  and (c)  Physicians who do not meet the criteria to be Eligible Physicians or who are not entitled to bill Eligible Fees are not to be attached to the MSP Facility Number assigned to this facility; and</li>
    <li>vi. If the facility set out in this document is provided with an MSP Facility Number, then I, as "Administrator" may be subsequently provided with information from the applications of practitioners requesting attachment to such MSP Facility Number for the purpose of confirming whether such attachments are valid and accord with the requirements set out in paragraphs iv. and v. above.</li>
  </ol>`;

  get declarationTextForAPI() {
    return prepareDeclarationTextForAPI(this.declarationText);
  }

  // Abstract method
  getJSONPayload() {

    const jsonPayLoad: any = {
      informationConsentAgreement: this.informationCollectionNoticeConsent,
      administrator: {
        firstName: this.facAdminFirstName,
        lastName: this.facAdminLastName,
        pracNumber: this.pracNumber,
        email: this.emailAddress ? this.emailAddress : null,
        phoneNumber: stripPhoneFormatting( this.facAdminPhoneNumber )
      },
      //#region Validation
      facility: {
        name: this.facInfoFacilityName,
        address: this.facInfoPhysicalAddress,
        city: this.facInfoCity,
        postalCode: stripPostalCodeSpaces(this.facInfoPostalCode),
        faxNumber: stripPhoneFormatting(this.facInfoFaxNumber),
        province: this.facInfoProvince,
        effectiveDate: convertToJSONDate(this.facInfoEffectiveDate), // "2020-11-10",
        qualifiesForBCP: this.facInfoIsQualifyForBCP,
      },
      // TODO: Verify name of this field, hasn't been confirmed with backend.
      isFacilityAddressSameAsMailingAddress: this.facInfoIsSameMailingAddress,
      declarationText: this.declarationTextForAPI,
      dateOfAcceptance: convertToJSONDate(this.dateOfAcceptance),
      validateFacilityMessage: this.validateFacilityMessage
    };

    if (this.facAdminExtension && this.facAdminExtension.length > 0) {
      jsonPayLoad.administrator.extension = this.facAdminExtension;
    }

    if (this.facInfoIsSameMailingAddress === false) {
      jsonPayLoad.facility.mailingAddress = {
        address: this.facInfoMailAddress ? this.facInfoMailAddress : this.facInfoPhysicalAddress,
        city: this.facInfoMailCity ? this.facInfoMailCity : this.facInfoCity,
        province: this.facInfoMailProvince ? this.facInfoMailProvince : this.facInfoProvince,
        postalCode: this.facInfoMailPostalCode ? stripPostalCodeSpaces(this.facInfoMailPostalCode) :
        stripPostalCodeSpaces(this.facInfoPostalCode),
      };
    } else {
      // If the addresses are the same, we must copy the Facility Address into Mailing Address, as DB requires both fields
      jsonPayLoad.facility.mailingAddress = {
        address: this.facInfoPhysicalAddress,
        city: this.facInfoCity,
        province: this.facInfoProvince,
        postalCode: stripPostalCodeSpaces(this.facInfoPostalCode),
      };
    }

    return jsonPayLoad;
  }
}
