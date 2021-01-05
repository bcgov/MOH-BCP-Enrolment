import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CreateFacilityDataService } from '../../services/create-facility-data.service';
import { formatDateForDisplay, setNotApplicable } from '../../../core-bcp/models/helperFunc';
import { CREATE_FACILITY_PAGES } from '../../create-facility-route-constants';
import { ApiStatusCodes, PageStateService } from 'moh-common-lib';
import { ConfirmBaseForm } from '../../../core-bcp/models/confirm-base-form';
import { HeaderService } from '../../../../services/header.service';
import { PrivacyStmt } from '../../../core-bcp/components/core-consent-modal/core-consent-modal.component';
import { environment } from '../../../../../environments/environment';

enum WarningMessage {
  NEAR_MATCH_SCEN = 0,
  NO_MATCH_CLM_DWN = 1,
  FAILED_VALIDATE_FACIL = 2
}

const DUPE_WARNING_STATUS = '3';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
  encapsulation: ViewEncapsulation.None, // for print css
})
export class SubmissionComponent extends ConfirmBaseForm implements OnInit {

  /** An application is still a "success" even if it's under review */
  isUnderReview: boolean = false;

  warningMessage: WarningMessage;
  readonly privacyStatement: string = PrivacyStmt;
  readonly practitionerAttachmentLink: string = environment.links.practitionerAttachment;

  private _warningConfirmationMsg: string = 'Your application has been submitted. To complete your application, contact Health Insurance BC <u>two business days</u> following the date of submission noted below at (604) 456-6950 (lower mainland) or 1-866-456-6950 (elsewhere in B.C.).';

  constructor(protected dataService: CreateFacilityDataService,
              protected pageStateService: PageStateService,
              protected headerService: HeaderService) {
    super(dataService, pageStateService, headerService);
  }

  ngOnInit() {
    super.ngOnInit();

    // Set icon to be displayed
    if (this.dataService.jsonCreateFacility.response) {

      if ( this.response.returnCode === ApiStatusCodes.SUCCESS ) {
        if ( this.response.referenceNumber && this.response.facilityNumber ) {
          this.displayIcon = ApiStatusCodes.SUCCESS;
        } else {
          this.displayIcon = ApiStatusCodes.WARNING;
          this.isUnderReview = true;

          if ( this.dataService.validateFacilityMessage === 'UNKNOWN' ) {
            // message Yellow 3
            this.warningMessage = WarningMessage.FAILED_VALIDATE_FACIL;
          } else {
            // message Yellow 2
            this.warningMessage = WarningMessage.NEAR_MATCH_SCEN;
          }
        }
      } else {
        // console.log( 'return code <> 0');
        // case not Successful
        if (this.response.returnCode === DUPE_WARNING_STATUS) {
          this.warningMessage = WarningMessage.NEAR_MATCH_SCEN;
          this.displayIcon = ApiStatusCodes.WARNING;
          this.isUnderReview = true;
        } else if ( this.response.referenceNumber ) {
          // message Yellow 1
          this.warningMessage = WarningMessage.NO_MATCH_CLM_DWN;
          this.displayIcon = ApiStatusCodes.WARNING;
          this.isUnderReview = true;
        }
      }
    }
  }

  get confirmationMessage() {

    if (this.displayIcon === ApiStatusCodes.WARNING) {
      let msg = 'Your application has been submitted but there may be a Facility Number assigned to that ' +
                'facility already. To complete your application, contact Health Insurance BC <u>two business days</u> following the date of submission noted below at (604) 456-6950 (lower mainland) or 1-866-456-6950 (elsewhere in B.C.).';

      if ( this.warningMessage === WarningMessage.FAILED_VALIDATE_FACIL ) {
        msg = this._warningConfirmationMsg;
      } else if ( this.warningMessage === WarningMessage.NO_MATCH_CLM_DWN ) {
        msg = this._warningConfirmationMsg;
      }

      return msg;
    }


    return super.getConfirmationMessage();
  }

  get response() {
    return this.dataService.jsonCreateFacility.response;
  }

  get facilityNumberText() {

    return this.dataService.jsonCreateFacility.response.facilityNumber ?
          this.dataService.jsonCreateFacility.response.facilityNumber : 'Contact Health Insurance BC';
  }

  get referenceNumber() {
    return this.dataService.jsonCreateFacility.response.referenceNumber ?
      this.dataService.jsonCreateFacility.response.referenceNumber : null;
  }

  get facInfoEffectiveDate() {
    return formatDateForDisplay(this.dataService.facInfoEffectiveDate);
  }

  // Title for route
  get pageTitle() {
    return CREATE_FACILITY_PAGES.SUBMISSION.title;
  }

  get declarationText() {
    return this.dataService.declarationText;
  }

}
