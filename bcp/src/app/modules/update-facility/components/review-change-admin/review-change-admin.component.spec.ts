import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewChangeAdminComponent } from './review-change-admin.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewChangeAdminComponent', () => {
  let component: ReviewChangeAdminComponent;
  let fixture: ComponentFixture<ReviewChangeAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule ],
      declarations: [ ReviewChangeAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewChangeAdminComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });
});
