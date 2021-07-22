import { Component, OnInit, Input, Optional, Self } from '@angular/core';
import { NgControl, ValidationErrors, ControlValueAccessor } from '@angular/forms';
import { ErrorMessage, LabelReplacementTag, AbstractFormControl } from 'moh-common-lib';

@Component({
  selector: 'bcp-practitioner-number',
  templateUrl: './practitioner-number.component.html',
  styleUrls: ['./practitioner-number.component.scss'],
})
export class PractitionerNumberComponent extends AbstractFormControl implements OnInit, ControlValueAccessor {
  pracNumber: string;

  @Input() label: string = 'Medical Services Plan Practitioner Number';

  _defaultErrMsg: ErrorMessage = {
    required: `${LabelReplacementTag} is required.`,
    invalidFormat: LabelReplacementTag + ' is invalid format. Please make sure it is alpha numeric and does not contain special characters or spaces.'
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
      this.pracNumber = evt.target.value;
      this._onChange(this.pracNumber);
    }
  }

  onBlur(evt) {
    if (evt.target) {
      this._onTouched(evt.target.value);
    }
  }

  writeValue(value: any): void {
    this.pracNumber = value;
  }

  private validateSelf(): ValidationErrors | null {
    if ( this.pracNumber ) {
      const criteria: RegExp = /^(([A-Z]{1}[0-9]{4})|([0-9]*))$/;
      const result = criteria.test(this.pracNumber);
      return result ? null : { invalidFormat: true };
    }
    return null;
  }
}
