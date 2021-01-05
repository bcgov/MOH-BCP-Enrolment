import { Component, OnInit, Input, Self, Optional } from '@angular/core';
import { AbstractFormControl, LabelReplacementTag, ErrorMessage } from 'moh-common-lib';
import { ControlValueAccessor, ValidationErrors, NgControl } from '@angular/forms';

@Component({
  selector: 'bcp-phone-extension',
  templateUrl: './phone-extension.component.html',
  styleUrls: ['./phone-extension.component.scss']
})
export class PhoneExtensionComponent  extends AbstractFormControl implements OnInit, ControlValueAccessor {

  labelforId: string = 'phoneExt_' + this.objectId;
  extNumber: string = 'null';

  @Input() label: string = 'Extension (optional)';
  @Input() maxlength: string = '4';

  _defaultErrMsg: ErrorMessage = {
    required: `${LabelReplacementTag} is required.`,
    invalid: `${LabelReplacementTag} must be numeric.`
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

  onValueChange(evt) {
    this.extNumber = evt;
    this._onChange(this.extNumber);
  }

  onBlur(evt) {
    this._onTouched(evt);
  }

  writeValue(value: any): void {
    this.extNumber = value;
  }

  private validateSelf(): ValidationErrors | null {

    if ( this.extNumber ) {
      const criteria: RegExp =  RegExp( '^[0-9]*$' );
      const result = criteria.test(this.extNumber);
      return result ? null : { invalid: true };
    }
    return null;
  }
}
