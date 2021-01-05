import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFacilityMailingInfoComponent } from './review-facility-mailing-info.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewFacilityMailingInfoComponent', () => {
  let component: ReviewFacilityMailingInfoComponent;
  let fixture: ComponentFixture<ReviewFacilityMailingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule ],
      declarations: [ ReviewFacilityMailingInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFacilityMailingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
