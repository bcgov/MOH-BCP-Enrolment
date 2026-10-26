import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelChangeComponent } from './cancel-change.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RestrictedTextareaComponent } from '../../components/restricted-textarea/restricted-textarea.component';
import { UPDATE_FACILITY_PAGES } from '../../update-facility-route-constants';

describe('CancelChangeComponent', () => {
  let component: CancelChangeComponent;
  let fixture: ComponentFixture<CancelChangeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, FormsModule, ReactiveFormsModule, RouterTestingModule ],
      declarations: [ CancelChangeComponent, RestrictedTextareaComponent ]
    })
    .compileComponents();
  }));

  // Async on purpose: the textarea attaches its character check in a microtask
  // (registerValidation, moh-common-lib-angular.mjs:529), and Jasmine awaiting this
  // hook lets it run. With a synchronous hook the invalid-character test fails.
  beforeEach(async () => {
    fixture = TestBed.createComponent(CancelChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('otherChangeRequests validation', () => {
    const other = () => component.formGroup.get('otherChangeRequests');

    it('accepts multi-line text', () => {
      other().setValue('First line\nSecond line');
      expect(other().valid).toBe(true);
    });

    it('rejects a non-ASCII character and names it', () => {
      other().setValue('It\u2019s here');
      expect(other().errors).toEqual(jasmine.objectContaining({ invalidCharacters: '\u2019' }));
    });

    it('continue() navigates to review for multi-line text', () => {
      const navigateSpy = spyOn<any>(component, 'navigate');
      other().setValue('First line\nSecond line');
      component.continue();
      expect(navigateSpy).toHaveBeenCalledOnceWith(UPDATE_FACILITY_PAGES.REVIEW.fullpath);
    });
  });
});
