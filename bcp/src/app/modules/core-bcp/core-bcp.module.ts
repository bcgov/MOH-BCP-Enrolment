import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedCoreModule } from 'moh-common-lib-angular';
import { PractitionerNumberComponent } from './components/practitioner-number/practitioner-number.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReviewContainerComponent } from './components/review-container/review-container.component';
import { SignatureComponent } from './components/signature/signature.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CorePractitionerInfoComponent } from './components/core-practitioner-info/core-practitioner-info.component';
import { CoreFacilityInfoComponent } from './components/core-facility-info/core-facility-info.component';
import { CoreConsentModalComponent } from './components/core-consent-modal/core-consent-modal.component';
import { CaptchaModule } from 'moh-common-lib-angular/captcha';
import { FacilityNumberComponent } from './components/facility-number/facility-number.component';
import { PhoneExtensionComponent } from './components/phone-extension/phone-extension.component';

const exportables = [
  CoreFacilityInfoComponent,
  CorePractitionerInfoComponent,
  CoreConsentModalComponent,
  FacilityNumberComponent,
  PractitionerNumberComponent,
  ReviewContainerComponent,
  SignatureComponent,
  PhoneExtensionComponent
];

@NgModule({
  declarations: [...exportables],
  imports: [
    CaptchaModule,
    CommonModule,
    SharedCoreModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
  ],
  exports: [
    SharedCoreModule,
    ...exportables
  ]
})
export class CoreBCPModule { }
