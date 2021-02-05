import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityAdminComponent } from './facility-admin.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('FacilityAdminComponent', () => {
  let component: FacilityAdminComponent;
  let fixture: ComponentFixture<FacilityAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, ReactiveFormsModule, RouterTestingModule ],
      declarations: [ FacilityAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
