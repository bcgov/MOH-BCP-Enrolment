import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCancelFacilityComponent } from './review-cancel-facility.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewCancelFacilityComponent', () => {
  let component: ReviewCancelFacilityComponent;
  let fixture: ComponentFixture<ReviewCancelFacilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule ],
      declarations: [ ReviewCancelFacilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCancelFacilityComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });
});
