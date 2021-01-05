import { Validators, FormGroup } from '@angular/forms';
import { commonValidatePostalcode, commonValidateCity } from 'moh-common-lib';


export function validMultiFormControl(fg: FormGroup, name: string) {
    if (fg.controls[name].pristine && fg.controls[name].untouched ) {
      return false;
    }
    return fg.controls[name].invalid;
}

export const cCreateFacilityValidators = {

    facilityDetail: {
        facilityName: [
            Validators.required,
            Validators.pattern(/^[ -~]+$/)
        ],
        // phoneNumber: [
        //     Validators.required
        // ],
        faxNumber: [
            Validators.required
        ],
        isQualifyForBCP: [
            Validators.required
        ],
        isSameMailingAddress: [
            Validators.required
        ],
        effectiveDate: [
            Validators.required
        ],
        services: [
            Validators.required
        ]
    },
    address: {
        streetAddress: [
            Validators.required,
            Validators.pattern(/^[ -~]+$/)
        ],
        city: [
            Validators.required,
            commonValidateCity
        ],
        postalCode: [
            Validators.required,
            commonValidatePostalcode( true, true ) // Must be BC Postal Code.
        ],
    }
};
