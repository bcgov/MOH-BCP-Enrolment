import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPractitionerInfoComponent } from './review-practitioner-info.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewPractitionerInfoComponent', () => {
  let component: ReviewPractitionerInfoComponent;
  let fixture: ComponentFixture<ReviewPractitionerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule ],
      declarations: [ ReviewPractitionerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewPractitionerInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  it('should not show \'Ext\' on phone number if one doesn\'t exists', () => {
    component.dataService.pracInfoPhoneNumber = 'phonenumber';
    component.dataService.pracInfoPhoneNumberExt = null;
    fixture.detectChanges();
    expect(component.review.sectionItems[0][4].value).toEqual('phonenumber');
  });

  it('should set \'Ext\' on phone number if one exists', () => {
    component.dataService.pracInfoPhoneNumber = 'phonenumber';
    component.dataService.pracInfoPhoneNumberExt = 'extension';
    fixture.detectChanges();
    expect(component.review.sectionItems[0][4].value).toEqual('phonenumber Ext. extension');
  });
});
