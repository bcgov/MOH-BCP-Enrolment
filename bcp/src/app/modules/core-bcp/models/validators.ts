import { FormGroup } from '@angular/forms';
import { commonValidatePostalcode } from 'moh-common-lib';

export function validMultiFormControl(fg: FormGroup, name: string) {
  if (fg.controls[name].pristine && fg.controls[name].untouched ) {
    return false;
  }
  return fg.controls[name].invalid;
}

export const validatePostalCode = commonValidatePostalcode( true, true ); // Must be BC Postal Code.
