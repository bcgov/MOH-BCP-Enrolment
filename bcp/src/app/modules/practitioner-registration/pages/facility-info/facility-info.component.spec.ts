import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityInfoComponent } from './facility-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';

describe('FacilityInfoComponent', () => {
  let component: FacilityInfoComponent;
  let fixture: ComponentFixture<FacilityInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule ],
      declarations: [ FacilityInfoComponent ]
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

  it('should mark inputs as touched when attempting to continue', () => {
    const markAllInputsTouchedSpy = jasmine.createSpy('markAllInputsTouched');
    Object.defineProperty(component, 'markAllInputsTouched', {value: markAllInputsTouchedSpy});
    Object.defineProperty(component.formGroup, 'valid', {value: false});
    const setIsLoadingSpy = jasmine.createSpy('setIsLoading');
    Object.defineProperty(component, 'containerService', {value: {setIsLoading: setIsLoadingSpy}});
    component.continue();
    expect(markAllInputsTouchedSpy).toHaveBeenCalled();
    expect(setIsLoadingSpy).not.toHaveBeenCalled();
  });
});
