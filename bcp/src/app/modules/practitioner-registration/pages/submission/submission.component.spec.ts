import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';

import { SubmissionComponent } from './submission.component';
import { ReviewPractitionerInfoComponent } from '../../components/review-practitioner-info/review-practitioner-info.component';
import { ReviewPractitionerFacilityComponent } from '../../components/review-practitioner-facility/review-practitioner-facility.component';
import { ReviewPractitionerAttachmentComponent } from '../../components/review-practitioner-attachment/review-practitioner-attachment.component';

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
        ReviewPractitionerAttachmentComponent,
        ReviewPractitionerFacilityComponent,
        ReviewPractitionerInfoComponent,
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
