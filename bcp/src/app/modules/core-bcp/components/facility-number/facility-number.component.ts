import { Component, Optional, Self, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NgControl, ValidationErrors } from '@angular/forms';
import { ErrorMessage, LabelReplacementTag, AbstractFormControl } from 'moh-common-lib';


// TODO: Convert to use the abstract form control class - figure out where this is used
@Component({
  selector: 'bcp-facility-number',
  templateUrl: './facility-number.component.html',
  styleUrls: ['./facility-number.component.scss'],
})
export class FacilityNumberComponent extends AbstractFormControl implements OnInit, ControlValueAccessor {

  public facNumber: string;

  @Input() label: string = 'Medical Services Plan Facility Number';
  @Input() maxlength: string = '9';

  _defaultErrMsg: ErrorMessage = {
    required: `${LabelReplacementTag} is required.`,
    invalidFormat: LabelReplacementTag + ' is invalid format.  Please make sure it is alphanumeric and does not contain special characters or spaces.',
    invalidLength: LabelReplacementTag + ' must be 5 characters long.'
  };

  constructor(@Optional() @Self() public controlDir: NgControl) {
    super();
    if (controlDir) {
      controlDir.valueAccessor = this;
    }
  }

  ngOnInit() {
    super.ngOnInit();

    this.registerValidation( this.controlDir, this.validateSelf );
  }

  inputChange(evt) {
    if (evt.target) {
      this.facNumber = evt.target.value;
      this._onChange(this.facNumber);
    }
  }

  onBlur(evt) {
    if (evt.target) {
      this._onTouched(evt.target.value);
    }
  }

  writeValue(value: any): void {
    this.facNumber = value;
  }

  private validateSelf(): ValidationErrors | null {
    if ( this.facNumber ) {
      const criteria: RegExp = /^\w*$/;
      const result = criteria.test(this.facNumber);
      if (!result) {
        return { invalidFormat: true };
      }
      const minLengthCriteria: RegExp = /^\w{5,9}$/; // Restrict length to 5-9 characters long.
      const minLengthResult = minLengthCriteria.test(this.facNumber);
      if (!minLengthResult) {
        return { invalidLength: true };
      }
    }
    return null;
  }
}
