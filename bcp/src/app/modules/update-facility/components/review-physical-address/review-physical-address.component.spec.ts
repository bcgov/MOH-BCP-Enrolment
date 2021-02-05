import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPhysicalAddressComponent } from './review-physical-address.component';
import { SubheadingReviewContainerComponent } from '../subheading-review-container/subheading-review-container.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewPhysicalAddressComponent', () => {
  let component: ReviewPhysicalAddressComponent;
  let fixture: ComponentFixture<ReviewPhysicalAddressComponent>;

  beforeEach(async(() => {
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
});
