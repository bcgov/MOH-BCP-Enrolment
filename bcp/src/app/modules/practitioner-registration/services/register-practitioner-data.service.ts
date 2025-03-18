import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BaseDataService } from '../../../services/base-data.service';
import { BRITISH_COLUMBIA } from 'moh-common-lib';
import {
  prepareDeclarationTextForAPI,
  stripPostalCodeSpaces,
  stripPhoneFormatting,
  convertToJSONDate } from '../../core-bcp/models/helperFunc';
import { PRAC_ATTACHMENT_TYPE } from '../models/practitioner-attachment';
import { addMonths, startOfToday, parseISO } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class RegisterPractitionerDataService extends BaseDataService {

  constructor() {
    super();
    if (environment.useDummyData) {
      this.pracInfoFirstName = 'John';
      this.pracInfoLastName = 'Doe';
      this.pracInfoMSPPracNumber = '12345';
      this.pracInfoEmail = 'john.doe@example.com';
      this.pracInfoPhoneNumber = '234 567-8901';
      this.pracInfoPhoneNumberExt = '123';

      this.pracFacilityName = 'Medical Facility';
      this.pracFacilityNumber = '12345';
      this.pracFacilityAddress = '123 Fake St.';
      this.pracFacilityCity = 'Victoria';
      this.pracFacilityProvince = BRITISH_COLUMBIA;
      this.pracFacilityPostalCode = 'V9V 9V9';
      this.pracFacilityFaxNumber = '234 567-8901';

      this.pracAttachmentType = 'new';

      this.facEffectiveDate = parseISO('2020-01-01');
      this.facCancelDate = parseISO('2020-12-31');
    }

        // Partial setup for using data in back end
    if (environment.useMockBackendData) {
      this.pracInfoFirstName = 'test';
      this.pracInfoLastName = 'privatepractice';
      this.pracInfoMSPPracNumber = '99901';
      this.pracInfoEmail = 'john.doe@example.com';
      this.pracInfoPhoneNumber = '234 567-8901';
      this.pracInfoPhoneNumberExt = '123';

      this.pracFacilityName = 'Medical Facility';
      this.pracFacilityNumber = 'DA007';
      this.pracFacilityAddress = '123 Fake St.';
      this.pracFacilityCity = 'Victoria';
      this.pracFacilityProvince = BRITISH_COLUMBIA;
      this.pracFacilityPostalCode = 'v4v4v7';
      this.pracFacilityFaxNumber = '234 567-8901';

    //  this.pracAttachmentType = 'new';
    //  this.pracNewAttachmentType = true;
    //  this.attachmentType = PRAC_ATTACHMENT_TYPE.NEW;
    //  this.attachmentEffectiveDate = addMonths( startOfToday(), 4 );
    //  this.attachmentCancelDate = addMonths( this.attachmentEffectiveDate, 6 );

     }
  }

  pracInfoFirstName: string;
  pracInfoLastName: string;
  pracInfoMSPPracNumber: string;
  pracInfoEmail: string;
  pracInfoPhoneNumber: string;
  pracInfoPhoneNumberExt: string;

  pracFacilityName: string;
  pracFacilityNumber: string;
  pracFacilityAddress: string;
  pracFacilityCity: string;
  pracFacilityProvince: string = BRITISH_COLUMBIA;
  pracFacilityPostalCode: string;
  pracFacilityFaxNumber: string;

  facEffectiveDate: Date; // Date received from facility validation.
  facCancelDate: Date; // Date received from facility validation.
  manualReview: boolean;

  pracAttachmentType: string;
  pracNewAttachmentType: boolean;

  attachmentEffectiveDate: Date;
  attachmentCancelDate: Date;


  jsonMaintPractitioner = {
    request: null,
    response: null
  };

  readonly declarationText = `I, the Practitioner named above, hereby confirm that: by checking either "Add New", "Cancel" above, or by requesting an "Other Change", I am either adding, changing details of, or cancelling an attachment to the MSP Facility Number set out in this document. In the case of adding an attachment or changing details of an attachment to the above MSP Facility Number:
  <ol class='no-bullets'>
      <li>i. I am an Eligible Physician regarding the facility that has been issued the MSP Facility Number named in this document, and I understand that my claims for the Business Cost Premium on Eligible Fees will be based on my attachment to the MSP Facility Number named in this document, or to another eligible facility;</li>
      <li>ii. this attachment will result in the Business Cost Premium being applied to all Eligible Fees on claims submitted, in the format approved by the Medical Services Commission of British Columbia bearing my Practitioner Number and a valid MSP Facility Number;</li>
      <li>iii. I understand that this is a legal document and I represent that the information that I have provided on this document is true to the best of my knowledge;</li>
      <li>iv. I understand that claims in relation to the Business Cost Premium are subject to audit, and if found to be contrary to the <em>Medicare Protection Act (the "Act")</em>, are subject to financial recovery. I further understand that submitting false or misleading claims information is an offence under the Act and may be an offence under the Criminal Code of Canada;</li>
      <li>v. I authorize the sharing of this information with the Administrator for the facility named in this document, including the delivery of this information to the facility mailing address for the purposes of confirmation of my attachment to the MSP Facility Number; and</li>
      <li>vi. If, at any point, I am no longer an Eligible Physician with regard to the facility named in this document, I will submit a form for cancellation of my attachment to this MSP Facility Number to Health Insurance BC.</li>
  </ol>`;

  get declarationTextForAPI() {
    return prepareDeclarationTextForAPI(this.declarationText);
  }

  // Abstract method
  getJSONPayload() {

    const jsonPayLoad: any = {

      informationConsentAgreement: this.informationCollectionNoticeConsent,
      facility: {
        number: this.pracFacilityNumber,
        name: this.pracFacilityName,
        address: this.pracFacilityAddress,
        city: this.pracFacilityCity,
        province: this.pracFacilityProvince,
        postalCode: stripPostalCodeSpaces(this.pracFacilityPostalCode),
        faxNumber: stripPhoneFormatting(this.pracFacilityFaxNumber) // Optional
      },
      practitioner: {
        number: this.pracInfoMSPPracNumber,
        firstName: this.pracInfoFirstName,
        lastName: this.pracInfoLastName,
        email: this.pracInfoEmail ? this.pracInfoEmail : null,       // optional
        phoneNumber: stripPhoneFormatting(this.pracInfoPhoneNumber),
        phoneNumberExtension: this.pracInfoPhoneNumberExt ? this.pracInfoPhoneNumberExt : null,  // optional
      },
      // Update section for schema - needs to be reflected in the data service to only have 2 dates to keep code maintainable
      pracAssignment: {
        // when a flag is false, the corresponding date must be null.
          action: this.pracNewAttachmentType ? PRAC_ATTACHMENT_TYPE.TEMP : this.pracAttachmentType,
          effectiveDate: this.attachmentEffectiveDate ? convertToJSONDate( this.attachmentEffectiveDate ) : null,
          cancelDate: this.attachmentCancelDate ? convertToJSONDate( this.attachmentCancelDate ) : null,
          manualReview: this.manualReview  // Indicated whether MT needs to send request to MAXHUB only
      },
      dateOfAcceptance: convertToJSONDate(this.dateOfAcceptance),
      declarationText: this.declarationTextForAPI,
    };

    return jsonPayLoad;
  }

}
