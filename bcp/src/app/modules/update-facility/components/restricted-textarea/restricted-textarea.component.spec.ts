import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictedTextareaComponent } from './restricted-textarea.component';
import { SharedCoreModule } from 'moh-common-lib-angular';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: false,
  template: '<bcp-restricted-textarea label="Other" [formControl]="ctrl"></bcp-restricted-textarea>'
})
class TestHostComponent {
  ctrl = new FormControl('');
}

describe('RestrictedTextareaComponent', () => {
  let component: RestrictedTextareaComponent;
  let fixture: ComponentFixture<RestrictedTextareaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RestrictedTextareaComponent, TestHostComponent ],
      imports: [ SharedCoreModule, FormsModule, ReactiveFormsModule ]
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

  describe('character check', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let ctrl: FormControl;

    // Async on purpose: the character check is attached in a microtask
    // (registerValidation, moh-common-lib-angular.mjs:529), and Jasmine awaiting this
    // hook lets it run. With a synchronous hook the invalid-character tests fail.
    beforeEach(async () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();
      ctrl = hostFixture.componentInstance.ctrl;
    });

    it('allows plain keyboard text with line breaks', () => {
      ctrl.setValue('Line 1: fax #250-555-1234\nLine 2: ask for "Jane" & co.');
      expect(ctrl.errors).toBeNull();
    });

    it('lists each disallowed character once in the message', () => {
      ctrl.setValue('Dr. Smith\u2019s office \u2014 Ren\u00e9e\u2019s');
      ctrl.markAsTouched();
      hostFixture.detectChanges();
      expect(ctrl.errors).toEqual({ invalidCharacters: '\u2019, \u2014, \u00e9' });
      expect(hostFixture.nativeElement.textContent).toContain(
        'Remove or replace these characters: \u2019, \u2014, \u00e9. ' +
        'Only standard keyboard letters, numbers, symbols and line breaks are allowed.');
    });

    it('names invisible characters instead of showing them', () => {
      ctrl.setValue('a\tb\u00a0c\u200bd');
      expect(ctrl.errors).toEqual({ invalidCharacters: 'tab, hidden space' });
    });

    it('lists a decomposed accent as one letter and a variation selector as hidden', () => {
      ctrl.setValue('Rene\u0301e \u2764\ufe0f');
      expect(ctrl.errors).toEqual({ invalidCharacters: '\u00e9, \u2764, hidden space' });
    });
  });
});
