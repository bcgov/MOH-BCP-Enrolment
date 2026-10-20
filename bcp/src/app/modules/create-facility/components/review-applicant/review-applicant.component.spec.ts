import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewApplicantComponent } from './review-applicant.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewApplicantComponent', () => {
  let component: ReviewApplicantComponent;
  let fixture: ComponentFixture<ReviewApplicantComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule ],
      declarations: [ ReviewApplicantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display contact phone formatted from raw digits', () => {
    component.dataService.facAdminPhoneNumber = '5555555555';
    component.dataService.facAdminExtension = null;
    component.reviewItems();
    expect(component.review.sectionItems[0][4].value).toEqual('(555) 555-5555');
  });

  it('should append the extension to the formatted contact phone', () => {
    component.dataService.facAdminPhoneNumber = '5555555555';
    component.dataService.facAdminExtension = '123';
    component.reviewItems();
    expect(component.review.sectionItems[0][4].value).toEqual('(555) 555-5555 Ext. 123');
  });
});
