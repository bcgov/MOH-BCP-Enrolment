import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerInfoComponent } from './practitioner-info.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('PractitionerInfoComponent', () => {
  let component: PractitionerInfoComponent;
  let fixture: ComponentFixture<PractitionerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule ],
      declarations: [ PractitionerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PractitionerInfoComponent);
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
