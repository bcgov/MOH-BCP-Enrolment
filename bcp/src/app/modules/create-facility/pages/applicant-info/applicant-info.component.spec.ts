import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantInfoComponent } from './applicant-info.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { ReactiveFormsModule } from '@angular/forms';


describe('ApplicantInfoComponent', () => {
  let component: ApplicantInfoComponent;
  let fixture: ComponentFixture<ApplicantInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule, HttpClientTestingModule, CoreBCPModule, ReactiveFormsModule ],
      declarations: [ ApplicantInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('contact phone validation', () => {
    const typePhone = (value: string) => {
      const input: HTMLInputElement = fixture.nativeElement.querySelector('common-phone-number input');
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };

    beforeEach(async () => {
      // every other required field is valid, so only the phone decides canContinue()
      component.formGroup.patchValue({
        facAdminFirstName: 'Jane',
        facAdminLastName: 'Doe',
        pracNumber: 'A1234',
      });
      fixture.detectChanges();
    });

    it('should block continue and show the error for an incomplete phone number', () => {
      typePhone('555555');
      expect(component.formGroup.get('phoneNumber').value).toEqual('555555');
      expect(component.formGroup.get('phoneNumber').errors).toEqual({ incompleteValue: true });
      expect(component.canContinue()).toBe(false);

      component.continue();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Contact phone number does not appear to be valid.');
      TestBed.inject(HttpTestingController).expectNone(() => true);
    });

    it('should allow continue for a complete phone number', () => {
      typePhone('2505551234');
      expect(component.formGroup.get('phoneNumber').value).toEqual('2505551234');
      expect(component.formGroup.get('phoneNumber').errors).toBeNull();
      expect(component.canContinue()).toBe(true);
    });
  });
});
