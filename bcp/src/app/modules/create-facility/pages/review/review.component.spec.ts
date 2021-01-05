import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ReactiveFormsModule } from '@angular/forms';

import { ReviewApplicantComponent } from '../../components/review-applicant/review-applicant.component';
import { ReviewFacilityComponent } from '../../components/review-facility/review-facility.component';
import { ReviewFacilityMailingInfoComponent } from '../../components/review-facility-mailing-info/review-facility-mailing-info.component';
import { ReviewFacilityBcpComponent } from '../../components/review-facility-bcp/review-facility-bcp.component';
import { SignatureComponent } from '../../../core-bcp/components/signature/signature.component';
import { ReviewContainerComponent } from '../../../core-bcp/components/review-container/review-container.component';

import { ReviewComponent } from './review.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreBCPModule,
        FormsModule,
        HttpClientTestingModule,
        ModalModule,
        RouterTestingModule,
        SharedCoreModule,
        SignaturePadModule,
        ReactiveFormsModule
      ],
      declarations: [
        ReviewComponent,
        ReviewFacilityComponent,
        ReviewFacilityMailingInfoComponent,
        ReviewFacilityBcpComponent,
        ReviewApplicantComponent,
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
