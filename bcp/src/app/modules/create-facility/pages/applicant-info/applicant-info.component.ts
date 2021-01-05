import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateFacilityDataService } from '../../services/create-facility-data.service';
import { CREATE_FACILITY_PAGES } from '../../create-facility-route-constants';
import { SplunkLoggerService } from '../../../../services/splunk-logger.service';
import { FormBuilder, Validators } from '@angular/forms';
import { PageStateService, ContainerService } from 'moh-common-lib';
import { BcpBaseForm } from '../../../core-bcp/models/bcp-base-form';
import { ValidationResponse, ReturnCodes } from '../../../core-bcp/models/base-api.model';
import { CreateFacilityApiService } from '../../services/create-facility-api.service';

@Component({
  selector: 'app-applicant-info',
  templateUrl: './applicant-info.component.html',
  styleUrls: ['./applicant-info.component.scss']
})
export class ApplicantInfoComponent extends BcpBaseForm implements OnInit, AfterViewInit {
  public systemDownError = false;
  public showValidationError = false;
  public validationErrorMessage = 'This field does not match our records';

  constructor(
    protected router: Router,
    protected pageStateService: PageStateService,
    public dataService: CreateFacilityDataService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private apiService: CreateFacilityApiService,
    private splunkLoggerService: SplunkLoggerService,
    protected containerService: ContainerService) {
    super(router, containerService, pageStateService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.formGroup = this.fb.group({
      facAdminFirstName: [this.dataService.facAdminFirstName, Validators.required],
      facAdminLastName: [this.dataService.facAdminLastName, Validators.required],
      pracNumber: [this.dataService.pracNumber, Validators.required],
      email: [this.dataService.emailAddress], // optional field
      phoneNumber: [this.dataService.facAdminPhoneNumber, Validators.required],
      extension: [this.dataService.facAdminExtension], // optional field
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.formGroup.valueChanges.subscribe( val => {

      // Update data service values
      this.dataService.facAdminFirstName = val.facAdminFirstName;
      this.dataService.facAdminLastName = val.facAdminLastName;
      this.dataService.pracNumber = val.pracNumber;
      this.dataService.emailAddress = val.email;
      this.dataService.facAdminPhoneNumber = val.phoneNumber;
      this.dataService.facAdminExtension = val.extension;
    });
  }

  get pageTitle() {
    return CREATE_FACILITY_PAGES.FACILITY_ADMIN.title;
  }

  continue() {
    this.markAllInputsTouched();


    if (this.canContinue()) {
      this.containerService.setIsLoading();

      this.apiService.validatePractitioner({
        firstName: this.dataService.facAdminFirstName,
        lastName: this.dataService.facAdminLastName,
        number: this.dataService.pracNumber,
        doctor: false
      }, this.dataService.applicationUUID).subscribe((res: ValidationResponse) => {
        // console.log('apiService response', res);

        this.dataService.jsonApplicantValidation.response = res;

        this.splunkLoggerService.log(
          this.dataService.getSubmissionLogObject<ValidationResponse>(
            'Validate Pracitioner',
            this.dataService.jsonApplicantValidation.response
          )
        );


        if (res.returnCode === ReturnCodes.SUCCESS) {
          this.handleValidation(true);
          this.navigate(CREATE_FACILITY_PAGES.FACILITY_INFO.fullpath);
        } else if (res.returnCode === ReturnCodes.FAILURE) { // Note: Warning is never returned by this request
          this.handleValidation(false);
        } else { // Negative response codes
          // fall-through case, likely an error
          this.handleError();
        }
      }, error => {
        // console.log('apiService onerror', error);
        this.handleError();
      });

    }

  }

  private handleError(): void {
    this.systemDownError = true;
    this.containerService.setIsLoading(false);
    this.cdr.detectChanges();
  }

  private handleValidation(isValid: boolean): void {
    this.showValidationError = !isValid;
    this.containerService.setIsLoading(false);
    this.systemDownError = false;
    this.cdr.detectChanges();
  }

}

