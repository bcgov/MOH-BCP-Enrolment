import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateFacilityRoutingModule } from './create-facility-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ApplicantInfoComponent } from './pages/applicant-info/applicant-info.component';
import { FacilityInfoComponent } from './pages/facility-info/facility-info.component';
import { ReviewComponent } from './pages/review/review.component';
import { SubmissionComponent } from './pages/submission/submission.component';
import { CoreBCPModule } from '../core-bcp/core-bcp.module';
import { CreateFacilityContainerComponent } from './components/create-facility-container/create-facility-container.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DefaultPageGuardService,
  AbstractPageGuardService,
  LoadPageGuardService,
  BYPASS_GUARDS,
  START_PAGE_URL } from 'moh-common-lib';
import { CaptchaModule } from 'moh-common-lib/captcha';
import { ReviewApplicantComponent } from './components/review-applicant/review-applicant.component';
import { ReviewFacilityComponent } from './components/review-facility/review-facility.component';
import { ReviewFacilityMailingInfoComponent } from './components/review-facility-mailing-info/review-facility-mailing-info.component';
import { ReviewFacilityBcpComponent } from './components/review-facility-bcp/review-facility-bcp.component';
import { environment } from '../../../environments/environment';
import { CREATE_FACILITY_PAGES } from './create-facility-route-constants';



@NgModule({
  declarations: [
    HomeComponent,
    ApplicantInfoComponent,
    FacilityInfoComponent,
    ReviewComponent,
    SubmissionComponent,
    CreateFacilityContainerComponent,
    ReviewApplicantComponent,
    ReviewFacilityComponent,
    ReviewFacilityMailingInfoComponent,
    ReviewFacilityBcpComponent,
  ],
  imports: [
    CommonModule,
    CreateFacilityRoutingModule,
    CoreBCPModule,
    FormsModule,
    ReactiveFormsModule,
    CaptchaModule,
  ],
  providers: [
    { provide: BYPASS_GUARDS, useValue: environment.bypassGuards },
    { provide: START_PAGE_URL, useValue: CREATE_FACILITY_PAGES.HOME.fullpath },
    DefaultPageGuardService,
    { provide: AbstractPageGuardService, useExisting: DefaultPageGuardService },
    LoadPageGuardService,
  ]
})
export class CreateFacilityModule { }
