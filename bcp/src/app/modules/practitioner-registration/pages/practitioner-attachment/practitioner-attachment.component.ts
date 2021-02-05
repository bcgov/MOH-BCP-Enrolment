import { Component, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { PRACTITIONER_REGISTRATION_PAGES } from '../../practitioner-registration-route-constants';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContainerService, ErrorMessage, PageStateService, LabelReplacementTag } from 'moh-common-lib';
import { isBefore, isAfter, addDays, subDays, compareAsc } from 'date-fns';
import { BcpBaseForm } from '../../../core-bcp/models/bcp-base-form';
import { PRACTITIONER_ATTACHMENT, PRAC_ATTACHMENT_TYPE } from '../../models/practitioner-attachment';
import { IRadioItems } from 'moh-common-lib/lib/components/radio/radio.component';
import { RegisterPractitionerDataService } from '../../services/register-practitioner-data.service';
import { formatDateForDisplay } from '../../../core-bcp/models/helperFunc';

@Component({
  selector: 'bcp-practitioner-attachment',
  templateUrl: './practitioner-attachment.component.html',
  styleUrls: ['./practitioner-attachment.component.scss']
})
export class PractitionerAttachmentComponent extends BcpBaseForm implements OnInit, AfterViewInit, DoCheck {

  constructor( protected containerService: ContainerService,
               protected router: Router,
               protected pageStateService: PageStateService,
               private fb: FormBuilder,
               public dataService: RegisterPractitionerDataService ) {
    super(router, containerService, pageStateService);
  }

  pageTitle: string = 'Practitioner Attachment';

  // Radio buttons
  radioItems: Array<IRadioItems> = [
    {
      label: PRACTITIONER_ATTACHMENT.NEW.label,
      value: PRACTITIONER_ATTACHMENT.NEW.value,
    },
    {
      label: PRACTITIONER_ATTACHMENT.CANCEL.label,
      value: PRACTITIONER_ATTACHMENT.CANCEL.value,
    },
    {
      label: PRACTITIONER_ATTACHMENT.CHANGE.label,
      value: PRACTITIONER_ATTACHMENT.CHANGE.value,
    },
  ];
  changeAttachmentHasValue: boolean = false;

  facilityEffectiveDateErrMsg: ErrorMessage;
  facilityCancelDateErrMsg: ErrorMessage;


  // Forms for different attachment types
  newAttachmentForm: FormGroup;
  cancelAttachmentForm: FormGroup;
  changeAttachmentForm: FormGroup;

  private _effectiveDateEndRange: Date;
  private _cancelDateStartRange: Date;

  get shouldShowNewSection() {
    return this.dataService.pracAttachmentType === PRAC_ATTACHMENT_TYPE.NEW;
  }

  get shouldShowCancelSection() {
    return this.dataService.pracAttachmentType === PRAC_ATTACHMENT_TYPE.CANCEL;
  }

  get shouldShowChangeSection() {
    return this.dataService.pracAttachmentType === PRAC_ATTACHMENT_TYPE.CHANGE;
  }

  // Dates set by the facility information component
  get effectiveDateStartRange(): Date {
    return this.dataService.facEffectiveDate;
  }

  get effectiveDateEndRange(): Date {
    return this._effectiveDateEndRange;
  }

  get cancelDateStartRange(): Date {
    return this._cancelDateStartRange;
  }

  get cancelDateEndRange(): Date {
    return this.dataService.facCancelDate;
  }

  private setFacilityEffectiveDateErrMsg(): void {

    if ( this.effectiveDateStartRange && this.effectiveDateEndRange ) {
      // Displays effective end range as the day before the cancel date
      this.facilityEffectiveDateErrMsg = {
        invalidRange: `${LabelReplacementTag} must be between ${formatDateForDisplay(this.effectiveDateStartRange)} and ${formatDateForDisplay(this.effectiveDateEndRange)}.`
      };
    } else {
      this.facilityEffectiveDateErrMsg = {
        invalidRange: `${LabelReplacementTag} must be on or after ${formatDateForDisplay(this.effectiveDateStartRange)}.`
      };
    }
  }

  setfacilityCancelDateErrMsg(): void {

    if ( this.cancelDateStartRange && this.cancelDateEndRange ) {

      // Displays cancel start range as the day after the effective date
      this.facilityCancelDateErrMsg = {
        invalidRange: `${LabelReplacementTag} must be between ${formatDateForDisplay(this.cancelDateStartRange)} and ${formatDateForDisplay(this.cancelDateEndRange)}.`
      };
    } else {
      this.facilityCancelDateErrMsg = {
        invalidRange: `${LabelReplacementTag} must be on or after ${formatDateForDisplay(this.cancelDateStartRange)}.`
      };
    }
  }

  ngOnInit() {
    super.ngOnInit();

    // Effective date cannot be the same as the cancel date for the facility.
    this._effectiveDateEndRange = this._getEffectiveDateEndRange();

    // Cancel date cannot be the same as the effective date for the facility.
    this._cancelDateStartRange = this._getCancelDateStartRange();

    this.formGroup = this.fb.group({
      attachmentType: [this.dataService.pracAttachmentType, Validators.required]
    });

    this.newAttachmentForm = this.fb.group({
      newAttachmentType: [this.dataService.pracNewAttachmentType, Validators.required],
      attachmentEffectiveDate: [this.dataService.attachmentEffectiveDate, Validators.required],
      attachmentCancelDate: [this.dataService.attachmentCancelDate]
    });

    this.cancelAttachmentForm = this.fb.group ({
      attachmentCancelDate: [this.dataService.attachmentCancelDate, Validators.required]
    });

    this.changeAttachmentForm = this.fb.group({
      attachmentEffectiveDate: [this.dataService.attachmentEffectiveDate],
      attachmentCancelDate: [this.dataService.attachmentCancelDate],
    });

    this.setFacilityEffectiveDateErrMsg();
    this.setfacilityCancelDateErrMsg();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // Listens for the attachment type, initializes dates to null.
    this.formGroup.valueChanges.subscribe( value => {

      // Set the Attachment Type for practi
      this.dataService.pracAttachmentType = value.attachmentType;

      // Clear data - new selection made
      this.dataService.pracNewAttachmentType = null;
      this.dataService.attachmentEffectiveDate = null;
      this.dataService.attachmentCancelDate = null;

      // Reset values
      this._effectiveDateEndRange = this._getEffectiveDateEndRange();
      this.setFacilityEffectiveDateErrMsg();
      this._cancelDateStartRange = this._getCancelDateStartRange();
      this.setfacilityCancelDateErrMsg();

      // Reset forms on change
      this.newAttachmentForm.reset();
      this.cancelAttachmentForm.reset();
      this.changeAttachmentForm.reset();
    });

    this.newAttachmentForm.valueChanges.subscribe( value => {

      this.dataService.attachmentEffectiveDate = value.attachmentEffectiveDate;
      // new temporary attachment
      if ( value.newAttachmentType === true ) {
        this.dataService.attachmentCancelDate = value.attachmentCancelDate;
      }
    });

    // Catch change on this field as it willl determine which dates are required.
    this.newAttachmentForm.controls.newAttachmentType.valueChanges.subscribe ( value => {
      this._updateNewAttachmentType( value );
    });

    this.cancelAttachmentForm.valueChanges.subscribe( value => {

      this.dataService.attachmentCancelDate = value.attachmentCancelDate;
    });

    this.changeAttachmentForm.valueChanges.subscribe( value => {
      this.dataService.attachmentEffectiveDate = value.attachmentEffectiveDate;
      this.dataService.attachmentCancelDate = value.attachmentCancelDate;

      this.changeAttachmentHasValue = !!(value.attachmentEffectiveDate || value.attachmentCancelDate);
    });
  }

  ngDoCheck() {
    // console.log( 'ngDoCheck: ' );
    this._effectiveDateEndRange = this._getEffectiveDateEndRange();
    this.setFacilityEffectiveDateErrMsg();

    this._cancelDateStartRange = this._getCancelDateStartRange();
    this.setfacilityCancelDateErrMsg();
  }

  continue() {
    const forms = [ this.formGroup ];
    let continueFlag = true;

    if ( this.dataService.pracAttachmentType ===  PRAC_ATTACHMENT_TYPE.NEW ) {
      forms.push( this.newAttachmentForm);
    } else if (this.dataService.pracAttachmentType ===  PRAC_ATTACHMENT_TYPE.CANCEL ) {
      forms.push( this.cancelAttachmentForm );
    } else if (this.dataService.pracAttachmentType ===  PRAC_ATTACHMENT_TYPE.CHANGE ) {
      forms.push( this.changeAttachmentForm );
      continueFlag = this.changeAttachmentHasValue;
    }

    this.markAllInputsTouched(forms);

    if ( forms.every( (x) => x.valid === true ) && continueFlag ) {
      this.navigate(PRACTITIONER_REGISTRATION_PAGES.REVIEW.fullpath);
    }
  }

  // Update validator on cancel date field based on new attachment type
  private _updateNewAttachmentType( tempAttachment: boolean | null ) {

    if (tempAttachment !== null && tempAttachment !== undefined ) {
      if ( tempAttachment === true ) {

        // Set the required validator on field
        this.newAttachmentForm.controls.attachmentCancelDate.setValidators( Validators.required );
        this.newAttachmentForm.controls.attachmentCancelDate.reset();

      } else {
        // Clear validator on field
        this.newAttachmentForm.controls.attachmentCancelDate.clearValidators();
        this.newAttachmentForm.controls.attachmentCancelDate.reset();
        this.dataService.attachmentCancelDate = null;
      }

      this.dataService.pracNewAttachmentType = tempAttachment;
      this.newAttachmentForm.controls.attachmentCancelDate.updateValueAndValidity();
      this.newAttachmentForm.updateValueAndValidity({ onlySelf: false });
    }
  }

  private _getEffectiveDateEndRange() {
    let _facilityCancelDate = this.dataService.facCancelDate;

    if ( this.dataService.attachmentEffectiveDate && this.dataService.facEffectiveDate ) {
      // Is after or same as date
      if ( compareAsc( this.dataService.attachmentCancelDate, _facilityCancelDate ) < 0 ) {
        _facilityCancelDate = this.dataService.attachmentCancelDate;
      }
    }

    if ( this.dataService.pracAttachmentType === PRAC_ATTACHMENT_TYPE.NEW && _facilityCancelDate ) {
      // Business rules state that new Attachments cannot end the same date at Facility Cancel date
      _facilityCancelDate = subDays(_facilityCancelDate, 1);
    }

    return _facilityCancelDate;
  }

  private _getCancelDateStartRange() {

    let _facilityEffectiveDate = this.dataService.facEffectiveDate;

    if ( this.dataService.attachmentEffectiveDate && this.dataService.facEffectiveDate ) {
      // Is Before or same as date
      if ( compareAsc( this.dataService.attachmentEffectiveDate, _facilityEffectiveDate ) > 0 ) {
        _facilityEffectiveDate = this.dataService.attachmentEffectiveDate;
      }
    }

    if ( this.dataService.pracAttachmentType === PRAC_ATTACHMENT_TYPE.NEW && _facilityEffectiveDate ) {
      // Business rules state that new Attachments cannot end the same date at Facility Cancel date
      _facilityEffectiveDate = addDays(_facilityEffectiveDate, 1);
    }

    return _facilityEffectiveDate;
  }
}
