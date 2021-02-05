import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageStateService, ContainerService } from 'moh-common-lib';
import { CREATE_FACILITY_PAGES } from '../../create-facility-route-constants';
import { CreateFacilityDataService } from '../../services/create-facility-data.service';
import { BCPApiService } from 'src/app/services/bcp-api.service';
import { CreateResponse } from '../../models/create-facility-api-model';
import { SplunkLoggerService } from '../../../../services/splunk-logger.service';
import { SignatureComponent } from '../../../core-bcp/components/signature/signature.component';
import { Validators, FormBuilder } from '@angular/forms';
import { BcpBaseForm } from '../../../core-bcp/models/bcp-base-form';
import { ValidationResponse } from '../../../core-bcp/models/base-api.model';
import { CreateFacilityApiService } from '../../services/create-facility-api.service';
import { PrivacyStmt } from '../../../core-bcp/components/core-consent-modal/core-consent-modal.component';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent extends BcpBaseForm implements OnInit, AfterViewInit {
  showDuplicateWarning = true;
  readonly privacyStatement: string = PrivacyStmt;

  signatureLabel: string = 'Facility Administrator Signature';
  errorMessage: string = `${this.signatureLabel } is required to submit the form`;

  @ViewChild(SignatureComponent, {static: true}) signature: SignatureComponent;

  constructor(protected router: Router,
              protected pageStateService: PageStateService,
              public dataService: CreateFacilityDataService,
              private api: CreateFacilityApiService,
              private splunkLoggerService: SplunkLoggerService,
              private fb: FormBuilder,
              protected containerService: ContainerService) {
    super(router, containerService, pageStateService);
   }

  ngOnInit() {
    this.containerService.setSubmitLabel('Submit');
    this.containerService.setUseDefaultColor(false);

    this.pageStateService.setPageIncomplete();
    this.showDuplicateWarning = this.dataService.apiDuplicateWarning;

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


  get pageTitle() {
    return CREATE_FACILITY_PAGES.REVIEW.title;
  }

  continue() {
    this.signature._onTouched();
    // console.log(this.dataService.declarationTextForAPI);

    if (this.canContinue()) {
      this.submit();
    }
  }

  submit() {
    this.containerService.setIsLoading();
    this.dataService.dateOfSubmission = new Date();
    const jsonPayLoad = this.dataService.getJSONPayload();
    this.api.createFacility(jsonPayLoad, this.dataService.signature, this.dataService.applicationUUID)
      .subscribe((res: ValidationResponse) => {

        this.dataService.jsonCreateFacility.response = res;
        this.splunkLoggerService.log(
          this.dataService.getSubmissionLogObject<CreateResponse>(
            'Create Facility',
            this.dataService.jsonCreateFacility.response
          )
        );

        this.containerService.setIsLoading(false);
        // TODO: Handle failure case, e.g. no backend, failed request, etc.
        this.navigate(CREATE_FACILITY_PAGES.SUBMISSION.fullpath);
      }, error => {
        // console.log('apiService onerror', error);
        this.handleError();
      });
  }

  private handleError(): void {
    this.containerService.setIsLoading(false);
    this.navigate(CREATE_FACILITY_PAGES.SUBMISSION.fullpath);
  }
}
