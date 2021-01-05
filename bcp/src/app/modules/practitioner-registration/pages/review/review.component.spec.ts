import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ReviewComponent } from './review.component';
import { ReviewPractitionerInfoComponent } from '../../components/review-practitioner-info/review-practitioner-info.component';
import { ReviewPractitionerFacilityComponent } from '../../components/review-practitioner-facility/review-practitioner-facility.component';
import { ReviewPractitionerAttachmentComponent } from '../../components/review-practitioner-attachment/review-practitioner-attachment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, ReactiveFormsModule, RouterTestingModule ],
      declarations: [
        ReviewComponent,
        ReviewPractitionerAttachmentComponent,
        ReviewPractitionerFacilityComponent,
        ReviewPractitionerInfoComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
