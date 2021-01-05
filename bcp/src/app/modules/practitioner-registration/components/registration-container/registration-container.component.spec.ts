import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationContainerComponent } from './registration-container.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedCoreModule } from 'moh-common-lib';

describe('RegistrationContainerComponent', () => {
  let component: RegistrationContainerComponent;
  let fixture: ComponentFixture<RegistrationContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, SharedCoreModule ],
      declarations: [ RegistrationContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
