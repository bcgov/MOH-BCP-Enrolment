import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPhysicalAddressComponent } from './review-physical-address.component';
import { SubheadingReviewContainerComponent } from '../subheading-review-container/subheading-review-container.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewPhysicalAddressComponent', () => {
  let component: ReviewPhysicalAddressComponent;
  let fixture: ComponentFixture<ReviewPhysicalAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule ],
      declarations: [ ReviewPhysicalAddressComponent, SubheadingReviewContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewPhysicalAddressComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  it('should display previous and new fax formatted from raw digits', () => {
    component.dataService.checkChangeFacilityAddress = true;
    component.dataService.changeFacilityAddressPreviousFax = '0958029359';
    component.dataService.changeFacilityAddressNewFax = '5555555555';
    fixture.detectChanges();
    expect(component.review.sections[0].items[4].value).toEqual('(095) 802-9359');
    expect(component.review.sections[1].items[4].value).toEqual('(555) 555-5555');
  });
});
