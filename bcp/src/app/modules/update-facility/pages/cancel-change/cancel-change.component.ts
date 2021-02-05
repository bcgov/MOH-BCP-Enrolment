import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UPDATE_FACILITY_PAGES } from '../../update-facility-route-constants';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateFacilityDataService } from '../../services/update-facility-data.service';
import { ContainerService, ErrorMessage, LabelReplacementTag, PageStateService, scrollToError, Address, BRITISH_COLUMBIA } from 'moh-common-lib';
import { BcpBaseForm } from '../../../core-bcp/models/bcp-base-form';
import { UpdateFacilityApiService } from '../../services/update-facility-api.service';
import { ValidationResponse, ReturnCodes } from '../../../core-bcp/models/base-api.model';
import { SplunkLoggerService } from '../../../../services/splunk-logger.service';
import { formatDateForDisplay } from '../../../core-bcp/models/helperFunc';
import { validatePostalCode } from '../../../core-bcp/models/validators';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'bcp-cancel-change',
  templateUrl: './cancel-change.component.html',
  styleUrls: ['./cancel-change.component.scss']
})
export class CancelChangeComponent extends BcpBaseForm implements OnInit, AfterViewInit {

  pageTitle: string = 'Cancel or Change Facility Details';
  formGroup: FormGroup;
  changeFacilityAddressFG: FormGroup;
  changeMailingAddressFG: FormGroup;
  changeAppliesFeesFG: FormGroup;
  cancelBCPFG: FormGroup;
  changeBCPEffectiveDateFG: FormGroup;
  changeBCPCancelDateFG: FormGroup;
  changeAdminInfoFG: FormGroup;
  cancelFacilityNumberFG: FormGroup;
  readonly bcpStartDate: Date = new Date(2020, 3, 1);
  readonly retroActiveStartDate: Date = new Date(1966, 0, 1);
  readonly OTHER_REQUEST_MAX_LENGTH: number = 1000;
  systemDownError: boolean = false;
  showValidationError: boolean = false;
  public readonly addressServiceUrl: string = environment.api.address;

  constructor( protected containerService: ContainerService,
               protected router: Router,
               protected pageStateService: PageStateService,
               private fb: FormBuilder,
               public dataService: UpdateFacilityDataService,
               private splunkLoggerService: SplunkLoggerService,
               private apiService: UpdateFacilityApiService ) {
    super(router, containerService, pageStateService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.formGroup = this.fb.group({
      checkChangeFacilityAddress: [this.dataService.checkChangeFacilityAddress, []],
      checkChangeMailingAddress: [this.dataService.checkChangeMailingAddress, []],
      checkChangeAppliesFees: [this.dataService.checkChangeAppliesFees, []],
      checkCancelBCP: [this.dataService.checkCancelBCP, []],
      checkChangeBCPEffectiveDate: [this.dataService.checkChangeBCPEffectiveDate, []],
      checkChangeBCPCancelDate: [this.dataService.checkChangeBCPCancelDate, []],
      checkChangeAdminInfo: [this.dataService.checkChangeAdminInfo, []],
      checkCancelFacilityNumber: [this.dataService.checkCancelFacilityNumber, []],
      otherChangeRequests: [this.dataService.otherChangeRequests, [Validators.pattern(/^[ -~]+$/)]],
    });

    this.changeFacilityAddressFG = this.fb.group({
      changeFacilityAddressPreviousAddress: [this.dataService.changeFacilityAddressPreviousAddress, [
        Validators.required,
        Validators.pattern(/^[ -~]+$/)
      ]],
      changeFacilityAddressPreviousCity: [this.dataService.changeFacilityAddressPreviousCity, [Validators.required]],
      changeFacilityAddressPreviousPostalCode: [this.dataService.changeFacilityAddressPreviousPostalCode, [
        Validators.required,
        validatePostalCode
      ]],
      changeFacilityAddressPreviousFax: [this.dataService.changeFacilityAddressPreviousFax, []],
      changeFacilityAddressNewAddress: [this.dataService.changeFacilityAddressNewAddress, [
        Validators.required,
        Validators.pattern(/^[ -~]+$/)
      ]],
      changeFacilityAddressNewCity: [this.dataService.changeFacilityAddressNewCity, [Validators.required]],
      changeFacilityAddressNewPostalCode: [this.dataService.changeFacilityAddressNewPostalCode, [
        Validators.required,
        validatePostalCode
      ]],
      changeFacilityAddressNewFax: [this.dataService.changeFacilityAddressNewFax, []],
      changeFacilityAddressEffectiveDate: [this.dataService.changeFacilityAddressEffectiveDate, [Validators.required]],
    });
    this.changeMailingAddressFG = this.fb.group({
      changeMailingAddressPreviousAddress: [this.dataService.changeMailingAddressPreviousAddress, [
        Validators.required,
        Validators.pattern(/^[ -~]+$/)
      ]],
      changeMailingAddressPreviousCity: [this.dataService.changeMailingAddressPreviousCity, [Validators.required]],
      changeMailingAddressPreviousPostalCode: [this.dataService.changeMailingAddressPreviousPostalCode, [
        Validators.required,
        validatePostalCode
      ]],
      changeMailingAddressNewAddress: [this.dataService.changeMailingAddressNewAddress, [
        Validators.required,
        Validators.pattern(/^[ -~]+$/)
      ]],
      changeMailingAddressNewCity: [this.dataService.changeMailingAddressNewCity, [Validators.required]],
      changeMailingAddressNewPostalCode: [this.dataService.changeMailingAddressNewPostalCode, [
        Validators.required,
        validatePostalCode
      ]],
      changeMailingAddressEffectiveDate: [this.dataService.changeMailingAddressEffectiveDate, [Validators.required]],
    });
    this.changeAppliesFeesFG = this.fb.group({
      changeAppliesFeesEffectiveDate: [this.dataService.changeAppliesFeesEffectiveDate, [Validators.required]],
    });
    this.cancelBCPFG = this.fb.group({
      cancelBCPEffectiveDate: [this.dataService.cancelBCPEffectiveDate, [Validators.required]],
    });
    this.changeBCPEffectiveDateFG = this.fb.group({
      changeBCPEffectiveDateEffectiveDate: [this.dataService.changeBCPEffectiveDateEffectiveDate, [Validators.required]],
    });
    this.changeBCPCancelDateFG = this.fb.group({
      changeBCPCancelDateCancelDate: [this.dataService.changeBCPCancelDateCancelDate, [Validators.required]],
    });
    this.changeAdminInfoFG = this.fb.group({
      firstName: [this.dataService.changeAdminInfoFirstName, [Validators.required]],
      lastName: [this.dataService.changeAdminInfoLastName, [Validators.required]],
      mspPracNumber: [this.dataService.changeAdminInfoMSPPracNumber, [Validators.required]],
      email: [this.dataService.changeAdminInfoEmail, []],
      phoneNumber: [this.dataService.changeAdminInfoPhoneNumber, [Validators.required]],
      phoneNumberExt: [this.dataService.changeAdminInfoPhoneNumberExt, []],
      changeAdminInfoEffectiveDate: [this.dataService.changeAdminInfoEffectiveDate, [Validators.required]],
    });
    this.cancelFacilityNumberFG = this.fb.group({
      cancelFacilityNumberCancelDate: [this.dataService.cancelFacilityNumberCancelDate, [Validators.required]],
    });
  }

  get containsMissingInfoError() {
    if ( this.formGroup.touched &&
      (  !this.dataService.checkChangeFacilityAddress
      && !this.dataService.checkChangeMailingAddress
      && !this.dataService.checkChangeAppliesFees
      && !this.dataService.checkCancelBCP
      && !this.dataService.checkChangeBCPEffectiveDate
      && !this.dataService.checkChangeBCPCancelDate
      && !this.dataService.checkChangeAdminInfo
      && !this.dataService.checkCancelFacilityNumber
      && (!this.dataService.otherChangeRequests || this.dataService.otherChangeRequests === ''))
      ) {
      return true;
    } else {
      return false;
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    // Update data service values
    this.formGroup.valueChanges.subscribe( value => {
      this.dataService.checkChangeFacilityAddress = value.checkChangeFacilityAddress;
      this.dataService.checkChangeMailingAddress = value.checkChangeMailingAddress;
      this.dataService.checkChangeAppliesFees = value.checkChangeAppliesFees;
      this.dataService.checkCancelBCP = value.checkCancelBCP;
      this.dataService.checkChangeBCPEffectiveDate = value.checkChangeBCPEffectiveDate;
      this.dataService.checkChangeBCPCancelDate = value.checkChangeBCPCancelDate;
      this.dataService.checkChangeAdminInfo = value.checkChangeAdminInfo;
      this.dataService.checkCancelFacilityNumber = value.checkCancelFacilityNumber;
      this.dataService.otherChangeRequests = value.otherChangeRequests;

      // Reset values.
      if (!this.dataService.checkChangeFacilityAddress) {
        this.changeFacilityAddressFG.patchValue({
          changeFacilityAddressPreviousAddress: null,
          changeFacilityAddressPreviousCity: null,
          changeFacilityAddressPreviousPostalCode: null,
          changeFacilityAddressPreviousFax: null,
          changeFacilityAddressNewAddress: null,
          changeFacilityAddressNewCity: null,
          changeFacilityAddressNewPostalCode: null,
          changeFacilityAddressNewFax: null,
          changeFacilityAddressEffectiveDate: null,
        });
      }
      if (!this.dataService.checkChangeMailingAddress) {
        this.changeMailingAddressFG.patchValue({
          changeMailingAddressPreviousAddress: null,
          changeMailingAddressPreviousCity: null,
          changeMailingAddressPreviousPostalCode: null,
          changeMailingAddressPreviousFax: null,
          changeMailingAddressNewAddress: null,
          changeMailingAddressNewCity: null,
          changeMailingAddressNewPostalCode: null,
          changeMailingAddressNewFax: null,
          changeMailingAddressEffectiveDate: null,
        });
      }
      if (!this.dataService.checkChangeAppliesFees) {
        this.changeAppliesFeesFG.patchValue({
          changeAppliesFeesEffectiveDate: null,
        });
      }
      if (!this.dataService.checkCancelBCP) {
        this.cancelBCPFG.patchValue({
          cancelBCPEffectiveDate: null,
        });
      }
      if (!this.dataService.checkChangeBCPEffectiveDate) {
        this.changeBCPEffectiveDateFG.patchValue({
          changeBCPEffectiveDateEffectiveDate: null,
        });
      }
      if (!this.dataService.checkChangeBCPCancelDate) {
        this.changeBCPCancelDateFG.patchValue({
          changeBCPCancelDateCancelDate: null,
        });
      }
      if (!this.dataService.checkChangeAdminInfo) {
        this.changeAdminInfoFG.patchValue({
          firstName: null,
          lastName: null,
          mspPracNumber: null,
          email: null,
          phoneNumber: null,
          phoneNumberExt: null,
          changeAdminInfoEffectiveDate: null,
        });
      }
      if (!this.dataService.checkCancelFacilityNumber) {
        this.cancelFacilityNumberFG.patchValue({
          cancelFacilityNumberCancelDate: null
        });
      }
    });
    this.changeFacilityAddressFG.valueChanges.subscribe( value => {
      this.dataService.changeFacilityAddressPreviousAddress = value.changeFacilityAddressPreviousAddress;
      this.dataService.changeFacilityAddressPreviousCity = value.changeFacilityAddressPreviousCity;
      this.dataService.changeFacilityAddressPreviousPostalCode = value.changeFacilityAddressPreviousPostalCode;
      this.dataService.changeFacilityAddressPreviousFax = value.changeFacilityAddressPreviousFax;
      this.dataService.changeFacilityAddressNewAddress = value.changeFacilityAddressNewAddress;
      this.dataService.changeFacilityAddressNewCity = value.changeFacilityAddressNewCity;
      this.dataService.changeFacilityAddressNewPostalCode = value.changeFacilityAddressNewPostalCode;
      this.dataService.changeFacilityAddressNewFax = value.changeFacilityAddressNewFax;
      this.dataService.changeFacilityAddressEffectiveDate = value.changeFacilityAddressEffectiveDate;
    });
    this.changeMailingAddressFG.valueChanges.subscribe( value => {
      this.dataService.changeMailingAddressPreviousAddress = value.changeMailingAddressPreviousAddress;
      this.dataService.changeMailingAddressPreviousCity = value.changeMailingAddressPreviousCity;
      this.dataService.changeMailingAddressPreviousPostalCode = value.changeMailingAddressPreviousPostalCode;
      this.dataService.changeMailingAddressNewAddress = value.changeMailingAddressNewAddress;
      this.dataService.changeMailingAddressNewCity = value.changeMailingAddressNewCity;
      this.dataService.changeMailingAddressNewPostalCode = value.changeMailingAddressNewPostalCode;
      this.dataService.changeMailingAddressEffectiveDate = value.changeMailingAddressEffectiveDate;
    });
    this.changeAppliesFeesFG.valueChanges.subscribe( value => {
      this.dataService.changeAppliesFeesEffectiveDate = value.changeAppliesFeesEffectiveDate;
    });
    this.cancelBCPFG.valueChanges.subscribe( value => {
      this.dataService.cancelBCPEffectiveDate = value.cancelBCPEffectiveDate;
    });
    this.changeBCPEffectiveDateFG.valueChanges.subscribe( value => {
      this.dataService.changeBCPEffectiveDateEffectiveDate = value.changeBCPEffectiveDateEffectiveDate;
    });
    this.changeBCPCancelDateFG.valueChanges.subscribe( value => {
      this.dataService.changeBCPCancelDateCancelDate = value.changeBCPCancelDateCancelDate;
    });
    this.changeAdminInfoFG.valueChanges.subscribe( value => {
      this.dataService.changeAdminInfoFirstName = value.firstName;
      this.dataService.changeAdminInfoLastName = value.lastName;
      this.dataService.changeAdminInfoMSPPracNumber = value.mspPracNumber;
      this.dataService.changeAdminInfoEmail = value.email;
      this.dataService.changeAdminInfoPhoneNumber = value.phoneNumber;
      this.dataService.changeAdminInfoPhoneNumberExt = value.phoneNumberExt;
      this.dataService.changeAdminInfoEffectiveDate = value.changeAdminInfoEffectiveDate;
    });
    this.cancelFacilityNumberFG.valueChanges.subscribe( value => {
      this.dataService.cancelFacilityNumberCancelDate = value.cancelFacilityNumberCancelDate;
    });
  }

  continue() {
    this.formGroup.patchValue({});

    const forms = [this.formGroup];

    if (this.dataService.checkChangeFacilityAddress) {
      forms.push(this.changeFacilityAddressFG);
    }
    if (this.dataService.checkChangeMailingAddress) {
      forms.push(this.changeMailingAddressFG);
    }
    if (this.dataService.checkChangeAppliesFees) {
      forms.push(this.changeAppliesFeesFG);
    }
    if (this.dataService.checkCancelBCP) {
      forms.push(this.cancelBCPFG);
    }
    if (this.dataService.checkChangeBCPEffectiveDate) {
      forms.push(this.changeBCPEffectiveDateFG);
    }
    if (this.dataService.checkChangeBCPCancelDate) {
      forms.push(this.changeBCPCancelDateFG);
    }
    if (this.dataService.checkChangeAdminInfo) {
      forms.push(this.changeAdminInfoFG);
    }
    if (this.dataService.checkCancelFacilityNumber) {
      forms.push(this.cancelFacilityNumberFG);
    }
    this.markAllInputsTouched(forms);

    if (!this.containsMissingInfoError
      && forms.every( (x) => x.valid === true )) {
      if (this.dataService.checkChangeAdminInfo && this.canContinue()) {
        this.containerService.setIsLoading();

        this.apiService.validatePractitioner({
          firstName: this.dataService.changeAdminInfoFirstName,
          lastName: this.dataService.changeAdminInfoLastName,
          number: this.dataService.changeAdminInfoMSPPracNumber,
          doctor: false
        }, this.dataService.applicationUUID).subscribe((res: ValidationResponse) => {
          this.dataService.jsonApplicantValidation.response = res;

          this.splunkLoggerService.log(
            this.dataService.getSubmissionLogObject<ValidationResponse>(
              'Validate Pracitioner',
              this.dataService.jsonApplicantValidation.response
            )
          );

          if (res.returnCode === ReturnCodes.SUCCESS) {
            this.handleValidation(true);
            this.navigate(UPDATE_FACILITY_PAGES.REVIEW.fullpath);
          } else if (res.returnCode === ReturnCodes.FAILURE) { // Note: Warning is never returned by this request
            this.handleValidation(false);
            this.scrollToError();
          } else { // Negative response codes
            // fall-through case, likely an error
            this.handleError();
            this.scrollToError();
          }
        }, error => {
          this.handleError();
          this.scrollToError();
        });
      } else {
        this.handleValidation(true);
        this.navigate(UPDATE_FACILITY_PAGES.REVIEW.fullpath);
      }
    }
  }

  private handleError(): void {
    this.systemDownError = true;
    this.containerService.setIsLoading(false);
  }

  private handleValidation(isValid: boolean): void {
    this.showValidationError = !isValid;
    this.containerService.setIsLoading(false);
    this.systemDownError = false;
  }

  scrollToError() {
    setTimeout(() => {
      scrollToError();
    }, 50);
  }

  changeFacilityAddressPreviousAddressSelected(address: Address) {
    if (!address.addressLine1
      && !address.city
      && !address.postal) {
      return;
    }
    if (address.province !== BRITISH_COLUMBIA) {
      this.changeFacilityAddressFG.patchValue({
        changeFacilityAddressPreviousAddress: '',
      });
      alert('Please select a valid BC address.');
      return;
    }
    this.changeFacilityAddressFG.patchValue({
      changeFacilityAddressPreviousAddress: address.addressLine1,
      changeFacilityAddressPreviousCity: address.city,
      changeFacilityAddressPreviousPostalCode: address.postal
    });
    this.dataService.changeFacilityAddressPreviousAddress = address.addressLine1;
    this.dataService.changeFacilityAddressPreviousCity = address.city;
    this.dataService.changeFacilityAddressPreviousPostalCode = address.postal;
  }

  changeFacilityAddressNewAddressSelected(address: Address) {
    if (!address.addressLine1
      && !address.city
      && !address.postal) {
      return;
    }
    if (address.province !== BRITISH_COLUMBIA) {
      this.changeFacilityAddressFG.patchValue({
        changeFacilityAddressNewAddress: '',
      });
      alert('Please select a valid BC address.');
      return;
    }
    this.changeFacilityAddressFG.patchValue({
      changeFacilityAddressNewAddress: address.addressLine1,
      changeFacilityAddressNewCity: address.city,
      changeFacilityAddressNewPostalCode: address.postal
    });
    this.dataService.changeFacilityAddressNewAddress = address.addressLine1;
    this.dataService.changeFacilityAddressNewCity = address.city;
    this.dataService.changeFacilityAddressNewPostalCode = address.postal;
  }

  changeMailingAddressPreviousAddressSelected(address: Address) {
    if (!address.addressLine1
      && !address.city
      && !address.postal) {
      return;
    }
    if (address.province !== BRITISH_COLUMBIA) {
      this.changeMailingAddressFG.patchValue({
        changeMailingAddressPreviousAddress: '',
      });
      alert('Please select a valid BC address.');
      return;
    }
    this.changeMailingAddressFG.patchValue({
      changeMailingAddressPreviousAddress: address.addressLine1,
      changeMailingAddressPreviousCity: address.city,
      changeMailingAddressPreviousPostalCode: address.postal
    });
    this.dataService.changeMailingAddressPreviousAddress = address.addressLine1;
    this.dataService.changeMailingAddressPreviousCity = address.city;
    this.dataService.changeMailingAddressPreviousPostalCode = address.postal;
  }

  changeMailingAddressNewAddressSelected(address: Address) {
    if (!address.addressLine1
      && !address.city
      && !address.postal) {
      return;
    }
    if (address.province !== BRITISH_COLUMBIA) {
      this.changeMailingAddressFG.patchValue({
        changeMailingAddressNewAddress: '',
      });
      alert('Please select a valid BC address.');
      return;
    }
    this.changeMailingAddressFG.patchValue({
      changeMailingAddressNewAddress: address.addressLine1,
      changeMailingAddressNewCity: address.city,
      changeMailingAddressNewPostalCode: address.postal
    });
    this.dataService.changeMailingAddressNewAddress = address.addressLine1;
    this.dataService.changeMailingAddressNewCity = address.city;
    this.dataService.changeMailingAddressNewPostalCode = address.postal;
  }

  get dateErrorMessage(): ErrorMessage {
    return {
      invalidRange: `${LabelReplacementTag} must be after ${formatDateForDisplay(this.bcpStartDate)}.`
    };
  }

  get retroActiveStartDateErrorMessage(): ErrorMessage {
    return {
      invalidRange: `${LabelReplacementTag} must be after ${formatDateForDisplay(this.retroActiveStartDate)}.`
    };
  }
}
