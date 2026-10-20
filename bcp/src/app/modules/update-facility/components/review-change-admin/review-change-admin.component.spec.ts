import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewChangeAdminComponent } from './review-change-admin.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewChangeAdminComponent', () => {
  let component: ReviewChangeAdminComponent;
  let fixture: ComponentFixture<ReviewChangeAdminComponent>;

  beforeEach(waitForAsync(() => {
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

  it('should display phone formatted from raw digits with extension', () => {
    component.dataService.checkChangeAdminInfo = true;
    component.dataService.changeAdminInfoPhoneNumber = '5555555555';
    component.dataService.changeAdminInfoPhoneNumberExt = '123';
    fixture.detectChanges();
    expect(component.review.sectionItems[0][4].value).toEqual('(555) 555-5555 Ext. 123');
  });
});
