import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFacilityAdminComponent } from './review-facility-admin.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewFacilityAdminComponent', () => {
  let component: ReviewFacilityAdminComponent;
  let fixture: ComponentFixture<ReviewFacilityAdminComponent>;

  beforeEach(waitForAsync(() => {
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

  it('should display phone formatted from raw digits with extension', () => {
    component.dataService.phone = '5555555555';
    component.dataService.phoneExt = '123';
    fixture.detectChanges();
    expect(component.review.sectionItems[0][3].value).toEqual('(555) 555-5555 Ext. 123');
  });

  it('should display phone formatted from raw digits without extension', () => {
    component.dataService.phone = '5555555555';
    component.dataService.phoneExt = null;
    fixture.detectChanges();
    expect(component.review.sectionItems[0][3].value).toEqual('(555) 555-5555');
  });
});
