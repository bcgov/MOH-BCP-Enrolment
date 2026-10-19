import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFacilityInfoComponent } from './review-facility-info.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewFacilityInfoComponent', () => {
  let component: ReviewFacilityInfoComponent;
  let fixture: ComponentFixture<ReviewFacilityInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule ],
      declarations: [ ReviewFacilityInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFacilityInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  it('should display fax formatted from raw digits', () => {
    component.dataService.facilityFax = '0958029359';
    fixture.detectChanges();
    expect(component.review.sectionItems[0][2].value).toEqual('(095) 802-9359');
  });
});
