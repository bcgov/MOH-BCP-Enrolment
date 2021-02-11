import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PRACTITIONER_REGISTRATION_PAGES } from '../../practitioner-registration-route-constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisterPractitionerDataService } from '../../services/register-practitioner-data.service';
import { getProvinceDescription, ContainerService, PageStateService, Address, BRITISH_COLUMBIA } from 'moh-common-lib';
import { BcpBaseForm } from '../../../core-bcp/models/bcp-base-form';
import { SplunkLoggerService } from '../../../../services/splunk-logger.service';
import { RegisterPractitionerApiService } from '../../services/register-practitioner-api.service';
import { stripPostalCodeSpaces } from '../../../core-bcp/models/helperFunc';
import { ValidationResponse, ReturnCodes } from '../../../core-bcp/models/base-api.model';
import { parseISO, compareAsc, isAfter } from 'date-fns';
import { SpaEnvService } from '../../../../services/spa-env.service';


@Component({
  selector: 'bcp-facility-info',
  templateUrl: './facility-info.component.html',
  styleUrls: ['./facility-info.component.scss']
})
export class FacilityInfoComponent extends BcpBaseForm implements OnInit, AfterViewInit {

  pageTitle: string = 'Facility Information';
  formGroup: FormGroup;
  showValidationError: boolean = false;
  systemDownError: boolean = false;
  address: Address;

  private _openEndedDate: Date = parseISO('9999-12-31');
  private _bcpProgramStartDate: Date = parseISO('2020-04-01');

  constructor( protected containerService: ContainerService,
               protected router: Router,
               protected pageStateService: PageStateService,
               private fb: FormBuilder,
               private dataService: RegisterPractitionerDataService,
               private splunkLoggerService: SplunkLoggerService,
               private apiService: RegisterPractitionerApiService,
               private spaEnvService: SpaEnvService) {
    super(router, containerService, pageStateService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.formGroup = this.fb.group({
      name: [this.dataService.pracFacilityName, [Validators.required, Validators.pattern(/^[ -~]+$/)]],
      mspNumber: [this.dataService.pracFacilityNumber, [Validators.required]],
      address: [this.dataService.pracFacilityAddress, [Validators.required, Validators.pattern(/^[ -~]+$/)]],
      city: [this.dataService.pracFacilityCity, [Validators.required]],
      province: [getProvinceDescription(this.dataService.pracFacilityProvince)],
      postalCode: [this.dataService.pracFacilityPostalCode, [Validators.required]],
      faxNumber: [this.dataService.pracFacilityFaxNumber],
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.formGroup.valueChanges.subscribe( value => {

      // Update data service values
      this.dataService.pracFacilityName = value.name;
      this.dataService.pracFacilityNumber = value.mspNumber;
      this.dataService.pracFacilityAddress = value.address;
      this.dataService.pracFacilityCity = value.city;
      this.dataService.pracFacilityPostalCode = value.postalCode;
      this.dataService.pracFacilityFaxNumber = value.faxNumber;
    });
  }

  addressSelected(address: Address) {
    if (!address.addressLine1
      && !address.city) {
      return;
    }
    if (address.province !== BRITISH_COLUMBIA) {
      this.formGroup.patchValue({
        address: '',
      });
      alert('Please select a valid BC address.');
      return;
    }
    this.formGroup.patchValue({
      address: address.addressLine1,
      city: address.city
    });
    if (this.isAddressValidatorEnabled) {
      this.formGroup.patchValue({
        postalCode: address.postal
      });
    }
    this.dataService.pracFacilityAddress = address.addressLine1;
    this.dataService.pracFacilityCity = address.city;
    if (this.isAddressValidatorEnabled) {
      this.dataService.pracFacilityPostalCode = address.postal;
    }
    this.address = address;
  }

  get isAddressValidatorEnabled(): boolean {
    const env = this.spaEnvService.getValues();
    return env.SPA_ENV_ENABLE_ADDRESS_VALIDATOR === 'true';
  }

  continue() {
    this.markAllInputsTouched();

    if (this.formGroup.valid) {

      this.containerService.setIsLoading();

      this.apiService.validateFacility({
        facilityName: null,
        number: this.dataService.pracFacilityNumber,
        // API expects postalCode without any spaces in it
        facilityCity: null,
        postalCode: stripPostalCodeSpaces(this.dataService.pracFacilityPostalCode)
      }, this.dataService.applicationUUID)
        .subscribe((res: ValidationResponse) => {
          this.dataService.jsonFacilityValidation.response = res;

          this.splunkLoggerService.log(
            this.dataService.getSubmissionLogObject<ValidationResponse>(
              'Validate Facility',
              this.dataService.jsonFacilityValidation.response
            )
          );

          this.containerService.setIsLoading(false);

          if (res.returnCode === ReturnCodes.SUCCESS) {

            // BCP effective dates
            // Manual review will result in no dates returned therefore use BCP start date (April 1, 2020)
            this.dataService.manualReview = res.manualReview;

            // Effective date prior to April 1, 2020 will use this date not the one returned by request
            if ( res.effectiveDate ) {
              const _effectiveDt = parseISO( res.effectiveDate );
              this.dataService.facEffectiveDate = isAfter( _effectiveDt, this._bcpProgramStartDate ) ?
                _effectiveDt : this._bcpProgramStartDate;

            } else {
              this.dataService.facEffectiveDate = this._bcpProgramStartDate;
            }

            // Dec 31, 9999 (openEndedDate) will cause facCancelDate to be set to null
            if ( res.cancelDate  ) {
              const _cancelDt = parseISO( res.cancelDate );
              this.dataService.facCancelDate = compareAsc( this._openEndedDate, _cancelDt ) === 0 ? null : _cancelDt;
            } else {
              this.dataService.facCancelDate = null;
            }

            this.handleValidation(true);
            this.navigate(PRACTITIONER_REGISTRATION_PAGES.PRACTITIONER_ASSIGN.fullpath);
          } else if (res.returnCode === ReturnCodes.FAILURE || res.returnCode === ReturnCodes.WARNING) {
            this.handleValidation(false);
          } else {
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
