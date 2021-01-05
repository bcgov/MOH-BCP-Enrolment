import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';

import { SubmissionComponent } from './submission.component';
import { ReviewBCPComponent } from '../../components/review-bcp/review-bcp.component';
import { ReviewCancelFacilityComponent } from '../../components/review-cancel-facility/review-cancel-facility.component';
import { ReviewChangeAdminComponent } from '../../components/review-change-admin/review-change-admin.component';
import { ReviewFacilityAdminComponent } from '../../components/review-facility-admin/review-facility-admin.component';
import { ReviewFacilityInfoComponent } from '../../components/review-facility-info/review-facility-info.component';
import { ReviewMailingAddressComponent } from '../../components/review-mailing-address/review-mailing-address.component';
import { ReviewOtherRequestComponent } from '../../components/review-other-request/review-other-request.component';
import { ReviewPhysicalAddressComponent } from '../../components/review-physical-address/review-physical-address.component';
import { SubheadingReviewContainerComponent } from '../../components/subheading-review-container/subheading-review-container.component';


describe('SubmissionComponent', () => {
  let component: SubmissionComponent;
  let fixture: ComponentFixture<SubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreBCPModule,
        RouterTestingModule,
        SharedCoreModule
      ],
      declarations: [
        ReviewBCPComponent,
        ReviewCancelFacilityComponent,
        ReviewChangeAdminComponent,
        ReviewFacilityAdminComponent,
        ReviewFacilityInfoComponent,
        ReviewMailingAddressComponent,
        ReviewOtherRequestComponent,
        ReviewPhysicalAddressComponent,
        SubheadingReviewContainerComponent,
        SubmissionComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
