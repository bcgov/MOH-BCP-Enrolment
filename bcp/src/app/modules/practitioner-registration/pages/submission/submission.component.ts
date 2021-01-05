import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PRACTITIONER_REGISTRATION_PAGES } from '../../practitioner-registration-route-constants';
import { ApiStatusCodes, PageStateService } from 'moh-common-lib';
import { RegisterPractitionerDataService } from '../../services/register-practitioner-data.service';
import { ConfirmBaseForm } from '../../../core-bcp/models/confirm-base-form';
import { PrivacyStmt } from '../../../core-bcp/components/core-consent-modal/core-consent-modal.component';
import { HeaderService } from '../../../../services/header.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'bcp-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
  encapsulation: ViewEncapsulation.None, // for print css
})
export class SubmissionComponent extends ConfirmBaseForm implements OnInit {

  readonly privacyStatement = PrivacyStmt;
  readonly hibcLink: string = environment.links.hibc;

  constructor(protected dataService: RegisterPractitionerDataService,
              protected pageStateService: PageStateService,
              protected headerService: HeaderService) {
    super(dataService, pageStateService, headerService);
  }

  ngOnInit() {
    super.ngOnInit();

    // Set icon to be displayed
    if (this.dataService.jsonMaintPractitioner.response) {

      if ( this.dataService.jsonMaintPractitioner.response.returnCode === ApiStatusCodes.SUCCESS ) {

        // Assumed all is good - processed automatically or has multiple BCP effective periods (manual review)
        this.displayIcon = ApiStatusCodes.SUCCESS;
      } else {
        if ( this.dataService.jsonMaintPractitioner.response.referenceNumber ) {
          // Assumed something went wrong with automated processing but is in MAXHUB
          this.displayIcon = ApiStatusCodes.WARNING;
        }
      }
    }
  }

  get confirmationMessage() {
    let confirmMessage = 'Your application has been successfully processed. You can now submit this Facility Number on your MSP claims for the Business Cost Premium.';
    if (this.displayIcon === ApiStatusCodes.WARNING) {
      confirmMessage = 'Your application has been submitted and will be processed within 5-10 business days. Health Insurance BC may contact you if there are questions about your application.';
    } else if (this.displayIcon === ApiStatusCodes.ERROR) {
      confirmMessage = 'There was an error processing your application. Please try again. If you continue to receive this message, contact HIBC at (604) 456-6950 (lower mainland) or 1-866-456-6950 (elsewhere in BC).';
    }

    return confirmMessage;
  }

  // Title for route
  get pageTitle() {
    return PRACTITIONER_REGISTRATION_PAGES.SUBMISSION.title;
  }

  get referenceNumber() {
    return this.dataService.jsonMaintPractitioner.response.referenceNumber;
  }

  get declarationText() {
    return this.dataService.declarationText;
  }

}
