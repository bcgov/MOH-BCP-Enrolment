import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityInfoComponent } from './facility-info.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedCoreModule } from 'moh-common-lib';


describe('FacilityInfoComponent', () => {
  let component: FacilityInfoComponent;
  let fixture: ComponentFixture<FacilityInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule, SharedCoreModule ],
      declarations: [ FacilityInfoComponent ],
      providers: [ FormBuilder ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
