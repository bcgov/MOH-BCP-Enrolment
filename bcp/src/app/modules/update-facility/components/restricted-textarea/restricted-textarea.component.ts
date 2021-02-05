import { Component, OnInit, Input, Self, Optional } from '@angular/core';
import { AbstractFormControl, LabelReplacementTag, ErrorMessage } from 'moh-common-lib';
import { ControlValueAccessor, ValidationErrors, NgControl } from '@angular/forms';

@Component({
  selector: 'restricted-textarea',
  templateUrl: './restricted-textarea.component.html',
  styleUrls: ['./restricted-textarea.component.scss']
})
export class RestrictedTextareaComponent  extends AbstractFormControl implements OnInit, ControlValueAccessor {

  labelforId: string = 'textarea_' + this.objectId;
  text: string = '';

  @Input() label: string = '';
  @Input() maxlength: number = 1000;
  @Input() rows: number = 7;

  _defaultErrMsg: ErrorMessage = {
    required: `${LabelReplacementTag} is required.`,
    overLimit: `This field is over the maximum character limit.`
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
    this.text = evt;
    this._onChange(this.text);
  }

  onBlur(evt) {
    this._onTouched(evt);
  }

  writeValue(value: any): void {
    this.text = value;
  }

  private validateSelf(): ValidationErrors | null {
    if (this.text && this.text.length > this.maxlength) {
      return {overLimit: true};
    }
    return null;
  }
}
