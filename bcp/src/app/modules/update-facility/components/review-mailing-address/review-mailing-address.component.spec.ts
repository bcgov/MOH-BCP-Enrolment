import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewMailingAddressComponent } from './review-mailing-address.component';
import { SubheadingReviewContainerComponent } from '../subheading-review-container/subheading-review-container.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewMailingAddressComponent', () => {
  let component: ReviewMailingAddressComponent;
  let fixture: ComponentFixture<ReviewMailingAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule ],
      declarations: [ ReviewMailingAddressComponent, SubheadingReviewContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewMailingAddressComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });
});
