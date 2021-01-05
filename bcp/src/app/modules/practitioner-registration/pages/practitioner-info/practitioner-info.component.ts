import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { PRACTITIONER_REGISTRATION_PAGES } from '../../practitioner-registration-route-constants';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterPractitionerDataService } from '../../services/register-practitioner-data.service';
import { CorePractitionerInfoFormItems } from '../../../core-bcp/components/core-practitioner-info/core-practitioner-info.component';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { BcpBaseForm } from '../../../core-bcp/models/bcp-base-form';
import { RegisterPractitionerApiService } from '../../services/register-practitioner-api.service';
import { ValidationResponse, ReturnCodes } from '../../../core-bcp/models/base-api.model';
import { SplunkLoggerService } from '../../../../services/splunk-logger.service';


@Component({
  selector: 'bcp-practitioner-info',
  templateUrl: './practitioner-info.component.html',
  styleUrls: ['./practitioner-info.component.scss']
})
export class PractitionerInfoComponent extends BcpBaseForm implements OnInit, AfterViewInit {

  pageTitle: string = 'Practitioner Information';
  formGroup: FormGroup;
  showValidationError: boolean = false;
  systemDownError: boolean = false;


  constructor( protected containerService: ContainerService,
               protected router: Router,
               protected pageStateService: PageStateService,
               private fb: FormBuilder,
               public dataService: RegisterPractitionerDataService,
               private splunkLoggerService: SplunkLoggerService,
               private apiService: RegisterPractitionerApiService ) {
    super(router, containerService, pageStateService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.formGroup = this.fb.group({
      firstName: [this.dataService.pracInfoFirstName, [Validators.required]],
      lastName: [this.dataService.pracInfoLastName, [Validators.required]],
      mspPracNumber: [this.dataService.pracInfoMSPPracNumber, [Validators.required]],
      email: [this.dataService.pracInfoEmail, [Validators.email]],
      phoneNumber: [this.dataService.pracInfoPhoneNumber, [Validators.required]],
      phoneNumberExt: [this.dataService.pracInfoPhoneNumberExt],
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.formGroup.valueChanges.subscribe( value => {
      // Update data service values
      this.dataService.pracInfoFirstName = value.firstName;
      this.dataService.pracInfoLastName = value.lastName;
      this.dataService.pracInfoMSPPracNumber = value.mspPracNumber;
      this.dataService.pracInfoEmail = value.email;
      this.dataService.pracInfoPhoneNumber = value.phoneNumber;
      this.dataService.pracInfoPhoneNumberExt = value.phoneNumberExt;
    });
  }

  continue() {
    this.markAllInputsTouched();

    if (this.formGroup.valid) {

      this.containerService.setIsLoading();

      this.apiService.validatePractitioner({
        firstName: this.dataService.pracInfoFirstName,
        lastName: this.dataService.pracInfoLastName,
        number: this.dataService.pracInfoMSPPracNumber,
        doctor: true
      }, this.dataService.applicationUUID).subscribe((res: ValidationResponse) => {
        // console.log('apiService response', res);

        this.dataService.jsonApplicantValidation.response = res;

        this.splunkLoggerService.log(
          this.dataService.getSubmissionLogObject<ValidationResponse>(
            'Validate practitioner',
            this.dataService.jsonApplicantValidation.response
          )
        );
        // console.log( 'res: ', res );

        if (res.returnCode === ReturnCodes.SUCCESS) {
          this.handleValidation(true);
          this.navigate(PRACTITIONER_REGISTRATION_PAGES.FACILITY_INFO.fullpath);
        } else if (res.returnCode === ReturnCodes.FAILURE) {
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
  }

  private handleValidation(isValid: boolean): void {
    this.showValidationError = !isValid;
    this.systemDownError = false;
    this.containerService.setIsLoading(false);
  }
}
