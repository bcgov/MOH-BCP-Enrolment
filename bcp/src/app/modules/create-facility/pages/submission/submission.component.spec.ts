import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionComponent } from './submission.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedCoreModule } from 'moh-common-lib';

import { ReviewApplicantComponent } from '../../components/review-applicant/review-applicant.component';
import { ReviewFacilityComponent } from '../../components/review-facility/review-facility.component';
import { ReviewFacilityMailingInfoComponent } from '../../components/review-facility-mailing-info/review-facility-mailing-info.component';
import { ReviewFacilityBcpComponent } from '../../components/review-facility-bcp/review-facility-bcp.component';

import { ReviewContainerComponent } from '../../../core-bcp/components/review-container/review-container.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';

describe('SubmissionComponent', () => {
  let component: SubmissionComponent;
  let fixture: ComponentFixture<SubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule, SharedCoreModule ],
      declarations: [
        ReviewApplicantComponent,
        ReviewFacilityBcpComponent,
        ReviewFacilityComponent,
        ReviewFacilityMailingInfoComponent,
        SubmissionComponent
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
