import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFacilityBcpComponent } from './review-facility-bcp.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewFacilityBcpComponent', () => {
  let component: ReviewFacilityBcpComponent;
  let fixture: ComponentFixture<ReviewFacilityBcpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule ],
      declarations: [ ReviewFacilityBcpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFacilityBcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
