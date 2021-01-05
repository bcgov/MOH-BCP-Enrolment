import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateFacilityRoutingModule } from './update-facility-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { FacilityAdminComponent } from './pages/facility-admin/facility-admin.component';
import { CancelChangeComponent } from './pages/cancel-change/cancel-change.component';
import { ReviewComponent } from './pages/review/review.component';
import { SubmissionComponent } from './pages/submission/submission.component';
import { FacilityContainerComponent } from './components/facility-container/facility-container.component';
import { RestrictedTextareaComponent } from './components/restricted-textarea/restricted-textarea.component';
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
import { UPDATE_FACILITY_PAGES } from './update-facility-route-constants';
import { ReviewBCPComponent } from './components/review-bcp/review-bcp.component';
import { ReviewCancelFacilityComponent } from './components/review-cancel-facility/review-cancel-facility.component';
import { ReviewChangeAdminComponent } from './components/review-change-admin/review-change-admin.component';
import { ReviewFacilityAdminComponent } from './components/review-facility-admin/review-facility-admin.component';
import { ReviewFacilityInfoComponent } from './components/review-facility-info/review-facility-info.component';
import { ReviewMailingAddressComponent } from './components/review-mailing-address/review-mailing-address.component';
import { ReviewOtherRequestComponent } from './components/review-other-request/review-other-request.component';
import { ReviewPhysicalAddressComponent } from './components/review-physical-address/review-physical-address.component';
import { SubheadingReviewContainerComponent } from './components/subheading-review-container/subheading-review-container.component';
import { environment } from '../../../environments/environment';

@NgModule({
  declarations: [
    HomeComponent,
    FacilityAdminComponent,
    CancelChangeComponent,
    ReviewComponent,
    SubmissionComponent,
    FacilityContainerComponent,
    RestrictedTextareaComponent,
    ReviewBCPComponent,
    ReviewCancelFacilityComponent,
    ReviewChangeAdminComponent,
    ReviewFacilityAdminComponent,
    ReviewFacilityInfoComponent,
    ReviewMailingAddressComponent,
    ReviewOtherRequestComponent,
    ReviewPhysicalAddressComponent,
    SubheadingReviewContainerComponent,
  ],
  imports: [
    CommonModule,
    CoreBCPModule,
    FormsModule,
    UpdateFacilityRoutingModule,
    ReactiveFormsModule,
    SharedCoreModule,
  ],
  providers: [
    { provide: BYPASS_GUARDS, useValue: environment.bypassGuards },
    { provide: START_PAGE_URL, useValue: UPDATE_FACILITY_PAGES.HOME.fullpath },
    DefaultPageGuardService,
    { provide: AbstractPageGuardService, useExisting: DefaultPageGuardService },
    LoadPageGuardService,
  ]
})
export class UpdateFacilityModule { }
