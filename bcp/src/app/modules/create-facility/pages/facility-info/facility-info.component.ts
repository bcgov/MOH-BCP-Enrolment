import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { cCreateFacilityValidators, validMultiFormControl } from '../../models/validators';
import { Address, getProvinceDescription, ErrorMessage, ContainerService, scrollToError, BRITISH_COLUMBIA } from 'moh-common-lib';
import { CreateFacilityDataService } from '../../services/create-facility-data.service';
import { CREATE_FACILITY_PAGES } from '../../create-facility-route-constants';
import { stripPostalCodeSpaces } from '../../../core-bcp/models/helperFunc';
import { SplunkLoggerService } from '../../../../services/splunk-logger.service';
import { startOfToday, addYears, compareAsc } from 'date-fns';
import { PageStateService } from 'moh-common-lib';
import { BcpBaseForm } from '../../../core-bcp/models/bcp-base-form';
import { ValidationResponse, ReturnCodes } from '../../../core-bcp/models/base-api.model';
import { CreateFacilityApiService } from '../../services/create-facility-api.service';
import { IRadioItems } from 'moh-common-lib/lib/components/radio/radio.component';
import { environment } from '../../../../../environments/environment';
import { SpaEnvService } from '../../../../services/spa-env.service';
import { getFullAddressText } from '../../../core-bcp/helpers/address-helper';

@Component({
  selector: 'app-facility-info',
  templateUrl: './facility-info.component.html',
  styleUrls: ['./facility-info.component.scss']
})
export class FacilityInfoComponent extends BcpBaseForm implements OnInit {

  systemDownError = false;
  showInvalidPostalCodeError: boolean = false;
  showInvalidMailingPostalCodeError: boolean = false;
  invalidPostalCodeErrorMessage: string = 'The postal code does not match the city provided.';
  public readonly addressServiceUrl: string = environment.api.address;

  // Error Messages
  qualifyBcpError: ErrorMessage = {
    required: 'Please indicate if your business qualifies for the Business Cost Premium'
  };

  sameMailAddrError: ErrorMessage = {
    required: 'Please indicate if the mailing address is the same as the physical address'
  };


  // Facility Effective Date can be on or after January 1, 1966
  effectStartRange: Date = new Date( 1966, 0, 1 );
  isEffectiveDateWarning: boolean = false;
  isQualifyForBCPOptions: Array<IRadioItems> = [
    {
      label: 'The applicant requests that the Business Cost Premium be applied to Eligible Fees paid to Eligible Physicians attached to this facility.',
      value: true
    },
    {
      label: 'The applicant requests that the Business Cost Premium not be applied to the facility referenced in this form.',
      value: false
    }
  ];

  // After this date a warning is displayed
  private _effectiveDateThreshold = addYears( startOfToday(), 1 );

  constructor(
    protected router: Router,
    protected pageStateService: PageStateService,
    public dataService: CreateFacilityDataService,
    private fb: FormBuilder,
    private api: CreateFacilityApiService,
    private cdr: ChangeDetectorRef,
    private splunkLoggerService: SplunkLoggerService,
    protected containerService: ContainerService,
    private spaEnvService: SpaEnvService) {
    super(router, containerService, pageStateService);
    this.validFormControl = validMultiFormControl;
  }

  showMailingAddress: boolean = false;
  facilityForm: FormGroup;
  mailingForm: FormGroup;

  validFormControl: (fg: FormGroup, name: string) => boolean;

  // physicalAddress: any = null;
  // mailingAddress: any = null;

  get pageTitle() {
    return CREATE_FACILITY_PAGES.FACILITY_INFO.title;
  }

  ngOnInit() {
    super.ngOnInit();
    this.facilityForm = this.initialize();
    this.updateMailingValidity(this.dataService.facInfoIsSameMailingAddress);
  }

  private initialize() {
    const form = this.fb.group({
      facilityName: [this.dataService.facInfoFacilityName, cCreateFacilityValidators.facilityDetail.facilityName],

      // Facility address
      address: [this.dataService.facInfoPhysicalAddress, cCreateFacilityValidators.address.streetAddress],
      city: [this.dataService.facInfoCity, cCreateFacilityValidators.address.city],
      postalCode: [this.dataService.facInfoPostalCode, cCreateFacilityValidators.address.postalCode],

      faxNumber: [this.dataService.facInfoFaxNumber], // optional field
      isSameMailingAddress: [this.dataService.facInfoIsSameMailingAddress, cCreateFacilityValidators.facilityDetail.isSameMailingAddress],
      isQualifyForBCP: [this.dataService.facInfoIsQualifyForBCP, cCreateFacilityValidators.facilityDetail.isQualifyForBCP],

      effectiveDate: [this.dataService.facInfoEffectiveDate, cCreateFacilityValidators.facilityDetail.effectiveDate],

      // Mailing address - populated only if mailing address is different from physical
      mailingAddress: [this.dataService.facInfoMailAddress, cCreateFacilityValidators.address.streetAddress],
      mailingCity: [this.dataService.facInfoMailCity, cCreateFacilityValidators.address.city],
      mailingPostalCode: [this.dataService.facInfoMailPostalCode, cCreateFacilityValidators.address.postalCode],
    });

    form.get('isSameMailingAddress').valueChanges.subscribe(
      value => this.updateMailingValidity(value)
    );

    form.get('address').valueChanges.subscribe(
      value => {
        // console.log('%c ADDRESS (phys) changed: %o', 'color:blue', value);
        // if (!value) {
        //   this.physicalAddress = null;
        // }
        this.dataService.facInfoPhysicalAddress = value;
      }
    );

    form.get('mailingAddress').valueChanges.subscribe(
      value => {
        // console.log('%c ADDRESS (mail) changed: %o', 'color:red', value);
       /* if (!value) {
          this.mailingAddress = null;
        }*/
        this.dataService.facInfoMailAddress = value;
      }
    );

    form.get('effectiveDate').valueChanges.subscribe(
      value => {
        if (value) {
          this.isEffectiveDateWarning = compareAsc( value, this._effectiveDateThreshold ) > 0 ? true : false;
        }
      }
    );

    this.showMailingAddress = this.dataService.facInfoIsSameMailingAddress ? !this.dataService.facInfoIsSameMailingAddress : false;
   // this.physicalAddress = { addressLine1: this.dataService.facInfoPhysicalAddress };
   // this.mailingAddress = { addressLine1: this.dataService.facInfoMailAddress };
    return form;
  }

  //#region Mailing Address update data service effective date
  updateMailingValidity(isRequired: boolean | null): void {
    const address = this.facilityForm.get('mailingAddress');
    const city = this.facilityForm.get('mailingCity');
    const postalCode = this.facilityForm.get('mailingPostalCode');
    if (!isRequired) {

      address.setValidators(cCreateFacilityValidators.address.streetAddress);
      city.setValidators(cCreateFacilityValidators.address.city);
      postalCode.setValidators(cCreateFacilityValidators.address.postalCode);
    } else {
      address.clearValidators();
      city.clearValidators();
      postalCode.clearValidators();

      address.patchValue(null);
      city.patchValue(null);
      postalCode.patchValue(null);
    }

    address.updateValueAndValidity();
    city.updateValueAndValidity();
    postalCode.updateValueAndValidity();

    this.showMailingAddress = !(isRequired === null) ? !isRequired : false;
    this.facilityForm.updateValueAndValidity({ onlySelf: false });
  }

  updateDataService() {
    // As per direction  to use dataservice for state ref:bcp-68 bcp-69 comments

    const fd = this.facilityForm.value;
    this.dataService.facInfoFacilityName = fd.facilityName;
    this.dataService.facInfoPhysicalAddress = fd.address; // this.physicalAddress ? this.physicalAddress.addressLine1 : fd.address;
    this.dataService.facInfoCity = fd.city;
    this.dataService.facInfoPostalCode = fd.postalCode;
    this.dataService.facInfoFaxNumber = fd.faxNumber;
    this.dataService.facInfoIsSameMailingAddress = fd.isSameMailingAddress;
    this.dataService.facInfoIsQualifyForBCP = fd.isQualifyForBCP;
    this.dataService.facInfoEffectiveDate = fd.effectiveDate;

    this.dataService.facInfoMailAddress = fd.mailingAddress; // this.mailingAddress ? this.mailingAddress.addressLine1 : fd.mailingAddress;
    this.dataService.facInfoMailCity = fd.mailingCity;
    this.dataService.facInfoMailPostalCode = fd.mailingPostalCode;
  }

  //#region

  continue() {
    this.updateDataService();

    // todo: fix common-components issues - Not issues as the abstract form is using Template Forms not Reactive
    // note in common-library that this need to be addressed.
    this.facilityForm.markAllAsTouched();
    // this.markAllInputsTouched();
    if (this.facilityForm.valid) {
      this.pageStateService.setPageComplete();
      this.containerService.setIsLoading();

      const physicalAddressValidationPromise = new Promise((resolve, reject) => {
        this.api.validateFacility({
          facilityName: this.dataService.facInfoFacilityName,
          number: null,
          facilityCity: this.dataService.facInfoCity,
          // API expects postalCode without any spaces in it
          postalCode: stripPostalCodeSpaces(this.dataService.facInfoPostalCode)
        }, this.dataService.applicationUUID)
          .subscribe((res: ValidationResponse) => {
            this.dataService.jsonFacilityValidation.response = res;

            this.splunkLoggerService.log(
                this.dataService.getSubmissionLogObject<ValidationResponse>(
                  'Validate Facility',
                  this.dataService.jsonFacilityValidation.response
                )
            );

            if (res.returnCode === ReturnCodes.SUCCESS) {
              this.handleAPIValidation(true);
              this.dataService.validateFacilityMessage = res.message;
              resolve();
            } else {
              if (Number(res.returnCode) <= Number(ReturnCodes.FAILURE)) {
                // Message: CITY NOT VALID FOR POSTAL CODE
                this.handlePostalCodeValidationFailure();
                reject();
              } else {
                if (Number(res.returnCode) <= Number(ReturnCodes.SYSTEM_ERROR)) {
                  // Set to near match so that document is sent to MAXIMAGE
                  this.dataService.validateFacilityMessage = 'UNKNOWN';
                } else {
                  this.dataService.validateFacilityMessage = res.message;
                }
                // we treat near match or exact match the same
                this.handleAPIValidation(false);
                resolve();
              }
            }
          }, error => {
            // console.log('apiService onerror', error);
            this.handleError();
          });
      });
      const promises = [physicalAddressValidationPromise];

      if (!this.dataService.facInfoIsSameMailingAddress) {
        // Add promise.
        promises.push(new Promise((resolve, reject) => {
          this.api.validateFacility({
            facilityName: this.dataService.facInfoFacilityName,
            number: null,
            facilityCity: this.dataService.facInfoMailCity,
            // API expects postalCode without any spaces in it
            postalCode: stripPostalCodeSpaces(this.dataService.facInfoMailPostalCode)
          }, this.dataService.applicationUUID)
            .subscribe((res: ValidationResponse) => {
              if ( res.returnCode === ReturnCodes.FAILURE) {
                this.showInvalidMailingPostalCodeError = true;
                return reject();
              } else if (res.returnCode === ReturnCodes.SYSTEM_ERROR || res.returnCode === ReturnCodes.SYSTEM_DOWN) {
                this.systemDownError = true;
                return reject();
              }
              return resolve();
            });
        }));
      }

      Promise.all(promises).then(() => {
        this.containerService.setIsLoading(false);
        this.navigate(CREATE_FACILITY_PAGES.REVIEW.fullpath);
      }).catch(() => {
        this.containerService.setIsLoading(false);

        setTimeout(() => {
          scrollToError();
        }, 50);
      });
    }
  }

  get isAddressValidatorEnabled(): boolean {
    const env = this.spaEnvService.getValues();
    return env && env.SPA_ENV_ENABLE_ADDRESS_VALIDATOR === 'true';
  }

  physicalAddressSelected(address: Address) {
    // console.log('%c ADDRESS (physicalAddr): %o', 'color:red', address);

    if (!address.addressLine1
      && !address.city) {
      return;
    }
    if (address.province !== BRITISH_COLUMBIA) {
      this.facilityForm.patchValue({
        address: '',
      });
      alert('Please select a valid BC address.');
      return;
    }
    if (this.isAddressValidatorEnabled) {
      address.addressLine1 = getFullAddressText(address);
    }
    this.facilityForm.patchValue({
      address: address.addressLine1,
      city: address.city,
    });
    if (this.isAddressValidatorEnabled) {
      this.facilityForm.patchValue({
        postalCode: address.postal
      });
    }

    this.dataService.facInfoPhysicalAddress = address.addressLine1;
    this.dataService.facInfoCity = address.city;
    if (this.isAddressValidatorEnabled) {
      this.dataService.facInfoPostalCode = address.postal;
    }
    // this.physicalAddress = address;
  }

  mailingAddressSelected(address: Address) {
    // console.log('%c ADDRESS: %o', 'color:red', address);

    if (!address.addressLine1
      && !address.city) {
      return;
    }
    if (this.isAddressValidatorEnabled) {
      address.addressLine1 = getFullAddressText(address);
    }
    this.facilityForm.patchValue({
      mailingAddress: address.addressLine1,
      mailingCity: address.city
    });
    if (this.isAddressValidatorEnabled) {
      this.facilityForm.patchValue({
        mailingPostalCode: address.postal
      });
    }
    this.dataService.facInfoMailAddress = address.addressLine1;
    this.dataService.facInfoMailCity = address.city;
    if (this.isAddressValidatorEnabled) {
      this.dataService.facInfoMailPostalCode = address.postal;
    }
   // this.mailingAddress = address;
  }

  private handleError(): void {
    this.systemDownError = true;
    this.containerService.setIsLoading(false);
    this.showInvalidPostalCodeError = false;
    this.cdr.detectChanges();
  }

  handleAPIValidation(isValid: boolean) {
    this.systemDownError = false;
    this.containerService.setIsLoading(false);
    this.dataService.apiDuplicateWarning = !isValid;
    this.showInvalidPostalCodeError = false;
    this.cdr.detectChanges();
  }

  handlePostalCodeValidationFailure() {
    this.showInvalidPostalCodeError = true;
    this.systemDownError = false;
    this.containerService.setIsLoading(false);
    this.dataService.apiDuplicateWarning = false;
    this.cdr.detectChanges();
  }

  // Read-only fields
  get facInfoProvince() {
    return getProvinceDescription(this.dataService.facInfoProvince);
  }

  get facInfoMailProvince() {
    return getProvinceDescription(this.dataService.facInfoMailProvince);
  }
}
