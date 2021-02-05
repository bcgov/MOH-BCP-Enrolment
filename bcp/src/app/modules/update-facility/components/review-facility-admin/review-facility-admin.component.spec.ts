import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFacilityAdminComponent } from './review-facility-admin.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewFacilityAdminComponent', () => {
  let component: ReviewFacilityAdminComponent;
  let fixture: ComponentFixture<ReviewFacilityAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule ],
      declarations: [ ReviewFacilityAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFacilityAdminComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });
});
