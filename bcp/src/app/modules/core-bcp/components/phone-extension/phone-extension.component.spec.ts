import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneExtensionComponent } from './phone-extension.component';
import { SharedCoreModule } from 'moh-common-lib';

describe('PhoneExtensionComponent', () => {
  let component: PhoneExtensionComponent;
  let fixture: ComponentFixture<PhoneExtensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneExtensionComponent ],
      imports: [ SharedCoreModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
