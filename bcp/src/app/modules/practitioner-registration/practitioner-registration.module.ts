import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PractitionerAssignmentRoutingModule } from './practitioner-registration-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { PractitionerInfoComponent } from './pages/practitioner-info/practitioner-info.component';
import { FacilityInfoComponent } from './pages/facility-info/facility-info.component';
import { ReviewComponent } from './pages/review/review.component';
import { SubmissionComponent } from './pages/submission/submission.component';
import { RegistrationContainerComponent } from './components/registration-container/registration-container.component';
import { PractitionerAttachmentComponent } from './pages/practitioner-attachment/practitioner-attachment.component';
import { CoreBCPModule } from '../core-bcp/core-bcp.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SharedCoreModule,
  DefaultPageGuardService,
  AbstractPageGuardService,
  LoadPageGuardService,
  BYPASS_GUARDS,
  START_PAGE_URL
} from 'moh-common-lib';
import { PRACTITIONER_REGISTRATION_PAGES } from './practitioner-registration-route-constants';
import {
  ReviewPractitionerAttachmentComponent
} from './components/review-practitioner-attachment/review-practitioner-attachment.component';
import { ReviewPractitionerFacilityComponent } from './components/review-practitioner-facility/review-practitioner-facility.component';
import { ReviewPractitionerInfoComponent } from './components/review-practitioner-info/review-practitioner-info.component';
import { environment } from '../../../environments/environment';

@NgModule({
  declarations: [
    HomeComponent,
    PractitionerInfoComponent,
    FacilityInfoComponent,
    PractitionerAttachmentComponent,
    ReviewComponent,
    SubmissionComponent,
    RegistrationContainerComponent,
    ReviewPractitionerAttachmentComponent,
    ReviewPractitionerFacilityComponent,
    ReviewPractitionerInfoComponent
  ],
  imports: [
    CommonModule,
    CoreBCPModule,
    FormsModule,
    PractitionerAssignmentRoutingModule,
    ReactiveFormsModule,
    SharedCoreModule,
  ],
  providers: [
    { provide: BYPASS_GUARDS, useValue: environment.bypassGuards },
    { provide: START_PAGE_URL, useValue: PRACTITIONER_REGISTRATION_PAGES.HOME.fullpath },
    DefaultPageGuardService,
    { provide: AbstractPageGuardService, useExisting: DefaultPageGuardService },
    LoadPageGuardService,
  ]
})
export class PractitionerRegistrationModule { }
