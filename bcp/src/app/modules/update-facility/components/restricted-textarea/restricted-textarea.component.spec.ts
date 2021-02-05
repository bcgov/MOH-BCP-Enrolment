import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictedTextareaComponent } from './restricted-textarea.component';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';

describe('RestrictedTextareaComponent', () => {
  let component: RestrictedTextareaComponent;
  let fixture: ComponentFixture<RestrictedTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestrictedTextareaComponent ],
      imports: [ SharedCoreModule, FormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictedTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
