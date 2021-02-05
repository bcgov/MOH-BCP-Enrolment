import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCoreModule } from 'moh-common-lib';

import { PractitionerNumberComponent } from './practitioner-number.component';
import { NgControl } from '@angular/forms';

describe('PractitionerNumberComponent', () => {
  let component: PractitionerNumberComponent;
  let fixture: ComponentFixture<PractitionerNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedCoreModule ],
      declarations: [ PractitionerNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PractitionerNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error for invalid entries', () => {
    component.pracNumber = 'ab c';
    fixture.detectChanges();
    const errorContainerEl = fixture.debugElement.nativeElement.querySelector('common-error-container');
    expect(errorContainerEl).toBeTruthy();
  });
});
