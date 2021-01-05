import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UPDATE_FACILITY_PAGES } from '../../update-facility-route-constants';
import { UpdateFacilityDataService } from '../../services/update-facility-data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { BcpBaseForm } from '../../../core-bcp/models/bcp-base-form';
import { SignatureComponent } from '../../../core-bcp/components/signature/signature.component';
import { UpdateFacilityApiService } from '../../services/update-facility-api.service';
import { SubmissionResponse } from '../../../core-bcp/models/base-api.model';
import { SplunkLoggerService } from '../../../../services/splunk-logger.service';
import { PrivacyStmt } from '../../../core-bcp/components/core-consent-modal/core-consent-modal.component';

@Component({
  selector: 'bcp-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})

export class ReviewComponent extends BcpBaseForm implements OnInit, AfterViewInit {

  @ViewChild(SignatureComponent, {static: true}) signature: SignatureComponent;

  readonly privacyStatement = PrivacyStmt;

  pageTitle: string = 'Review Application';
  signatureLabel: string = 'Signature of Administrator';
  errorMessage: string = `${this.signatureLabel } is required to submit the form`;

  constructor(public dataService: UpdateFacilityDataService,
              protected containerService: ContainerService,
              protected router: Router,
              protected pageStateService: PageStateService,
              private fb: FormBuilder,
              private apiService: UpdateFacilityApiService,
              private splunkLoggerService: SplunkLoggerService) {
    super(router, containerService, pageStateService);
  }



  ngOnInit() {
    this.containerService.setSubmitLabel('Submit');
    this.containerService.setUseDefaultColor(false);
    this.pageStateService.setPageIncomplete();

    // Set isPrintView to false
    this.dataService.isPrintView = false;

    this.formGroup = this.fb.group({
      signature: [this.dataService.signature, [Validators.required]]
    });
  }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.formGroup.valueChanges.subscribe( val => {
      // Update data service values
      this.dataService.signature = val.signature;
      this.dataService.dateOfAcceptance = val.signature ? new Date() : null;
    });
  }

  continue() {
    this.signature._onTouched();

    if ( this.canContinue() ) {
      this.submit();
    }
  }

  submit() {
    this.containerService.setIsLoading();
    this.dataService.dateOfSubmission = new Date();
    const jsonPayLoad = this.dataService.getJSONPayload();
    this.apiService.submitForm(jsonPayLoad, this.dataService.signature, this.dataService.applicationUUID)
      .subscribe((res: SubmissionResponse) => {

        this.dataService.jsonSubmission.response = res;
        this.splunkLoggerService.log(
          this.dataService.getSubmissionLogObject<SubmissionResponse>(
            'Maintain Facility',
            this.dataService.jsonSubmission.response
          )
        );

        this.containerService.setIsLoading(false);
        this.navigate(UPDATE_FACILITY_PAGES.SUBMISSION.fullpath);
      }, error => {
        // console.log('apiService onerror', error);
        this.containerService.setIsLoading(false);
        this.navigate(UPDATE_FACILITY_PAGES.SUBMISSION.fullpath);
      });
  }
}

