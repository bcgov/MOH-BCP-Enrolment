import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPractitionerFacilityComponent } from './review-practitioner-facility.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewPractitionerFacilityComponent', () => {
  let component: ReviewPractitionerFacilityComponent;
  let fixture: ComponentFixture<ReviewPractitionerFacilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule ],
      declarations: [ ReviewPractitionerFacilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewPractitionerFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
