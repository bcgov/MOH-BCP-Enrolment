import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewOtherRequestComponent } from './review-other-request.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewOtherRequestComponent', () => {
  let component: ReviewOtherRequestComponent;
  let fixture: ComponentFixture<ReviewOtherRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule ],
      declarations: [ ReviewOtherRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewOtherRequestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });
});
