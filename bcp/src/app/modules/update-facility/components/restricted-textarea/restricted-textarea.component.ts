import { Component, OnInit, Input, Self, Optional } from '@angular/core';
import { AbstractFormControl, LabelReplacementTag, ErrorMessage } from 'moh-common-lib-angular';
import { ControlValueAccessor, ValidationErrors, NgControl } from '@angular/forms';

// Printable ASCII plus line breaks.
const ALLOWED_CHAR = /[ -~\n]/;
// Whitespace, invisible formatting characters and stray combining marks, which would be
// unreadable in the message.
const HIDDEN_CHAR = /[\s\p{C}\p{M}]/u;

@Component({
  standalone: false,
  selector: 'bcp-restricted-textarea',
  templateUrl: './restricted-textarea.component.html',
  styleUrls: ['./restricted-textarea.component.scss']
})
export class RestrictedTextareaComponent  extends AbstractFormControl implements OnInit, ControlValueAccessor {

  labelforId: string = 'textarea_' + this.objectId;
  text = '';

  @Input() label = '';
  @Input() maxlength = 1000;
  @Input() rows = 7;

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
    if (!this.text) {
      return null;
    }
    const errors: ValidationErrors = {};
    if (this.text.length > this.maxlength) {
      errors.overLimit = true;
    }
    // NFC joins a letter typed as letter + accent mark, so it is listed as one character.
    const invalidChars = new Set(Array.from(this.text.normalize('NFC'))
      .filter(c => !ALLOWED_CHAR.test(c))
      .map(c => c === '\t' ? 'tab' : HIDDEN_CHAR.test(c) ? 'hidden space' : c));
    if (invalidChars.size) {
      errors.invalidCharacters = [...invalidChars].join(', ');
    }
    return Object.keys(errors).length ? errors : null;
  }
}
