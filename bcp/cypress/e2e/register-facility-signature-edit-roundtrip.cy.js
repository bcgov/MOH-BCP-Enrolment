// Regression spec for the SignatureComponent writeValue/ngAfterViewInit race
// (signature.component.ts). writeValue runs from the parent form's
// setUpControl during change detection, before the child's ngAfterViewInit
// constructs signaturePad. All three review pages seed
// `signature: [this.dataService.signature, ...]` (see review.component.ts
// ngOnInit) and CreateFacilityDataService is providedIn:'root', so a
// signature drawn once survives navigating away and back. Every
// forward-only happy path (this flow's own register-facility-happy-path.cy.js
// included) has dataService.signature undefined on first arrival at Review,
// so it never exercises this path - only a RETURN visit with a signature
// already stored does.
//
// What the pre-fix defect did, confirmed by reverting the fix locally and
// running this spec in a real Electron browser (not inferred from the
// source alone): writeValue called this.signaturePad.fromDataURL(val)
// unconditionally, so returning to Review threw
// "TypeError: Cannot read properties of undefined (reading 'fromDataURL')"
// synchronously out of SignatureComponent.writeValue, via Angular's
// setUpControl -> FormGroupDirective.addControl ->
// FormControlName._setUpControl -> FormControlName.ngOnChanges ->
// callHookInternal -> callHooks -> executeInitAndCheckHooks. In this build
// (Angular 19 dev server), that error is caught by Angular's zone and only
// logged: Review still renders, the signature-display card's <img> still
// shows correctly (writeValue sets `this.image = val` before the pad
// call), and the form still submits, because open() independently redraws
// the pad from `this.image` every time the Sign modal is opened, and the
// FormControl's own value was never touched by writeValue failing. The one
// thing that reliably differs pre/post-fix in this repro is the uncaught
// TypeError itself - this spec asserts zero console.error calls right after
// the round trip for that reason, in addition to the rendering/resubmission
// checks that document the surrounding behaviour is otherwise unchanged.
//
// The shipped fix removes the throwing path rather than guarding it:
// writeValue is now `if (val) { this.image = val; }` and does not reference
// signaturePad at all, so reverting it to reproduce the red state means
// restoring the fromDataURL call to writeValue, not deleting a guard.
//
// Setup mirrors register-facility-happy-path.cy.js (same stubs, same
// fixture); see that spec's header comment for the stub rationale.

const { stubCaptcha, solveCaptcha } = require('../support/pages/captcha-helpers');
const {
  fillLabeledField,
  fillDate,
  chooseRadioByOptionText,
  clickActionBarButton,
  acceptConsentModal,
  drawSignature,
} = require('../support/pages/common-controls');

describe('Register facility - signature survives a Review edit round trip', () => {
  let consoleErrors;

  beforeEach(() => {
    consoleErrors = [];
    cy.on('window:before:load', (win) => {
      cy.stub(win.console, 'error').callsFake((...args) => {
        consoleErrors.push(args.join(' '));
      });
    });

    cy.intercept('POST', '**/bcp/api/env', {
      statusCode: 200,
      body: {
        SPA_ENV_BCP_MAINTENANCE_FLAG: 'false',
        SPA_ENV_BCP_MAINTENANCE_START: '',
        SPA_ENV_BCP_MAINTENANCE_END: '',
        SPA_ENV_BCP_MAINTENANCE_MESSAGE: '',
        SPA_ENV_ENABLE_ADDRESS_VALIDATOR: 'false',
        SPA_ENV_ENABLE_RECAPTCHA: 'false',
      },
    }).as('checkEnv');

    cy.intercept('POST', '**/bcp/api/logging', { statusCode: 200, body: 'OK' });

    stubCaptcha('/bcp/api/captcha');

    cy.intercept('GET', 'https://geocoder.api.gov.bc.ca/**', {
      statusCode: 200,
      body: { features: [] },
    });

    cy.intercept('POST', '**/bcp/api/bcpIntegration/validatePractitioner', {
      statusCode: 200,
      body: { returnCode: '0', requestUUID: 'stub', applicationUUID: 'stub', message: '' },
    }).as('validatePractitioner');

    cy.intercept('POST', '**/bcp/api/bcpIntegration/validateFacility', {
      statusCode: 200,
      body: { returnCode: '0', requestUUID: 'stub', applicationUUID: 'stub', message: '' },
    }).as('validateFacility');

    cy.intercept('POST', '**/bcp/api/bcpAttachment/**', {
      statusCode: 200,
      body: { returnCode: '0' },
    }).as('uploadSignature');

    cy.intercept('POST', '**/bcp/api/bcpIntegration/createFacility', {
      statusCode: 200,
      body: {
        returnCode: '0',
        requestUUID: 'stub',
        applicationUUID: 'stub',
        referenceNumber: '999999',
        facilityNumber: 'OA999',
      },
    }).as('createFacility');

    cy.visit('register-facility/home');
    cy.wait('@checkEnv');
  });

  afterEach(() => {
    expect(consoleErrors, 'browser console.error calls').to.have.length(0);
  });

  it('restores a drawn signature and stays submittable after Edit sends the user back to Review', () => {
    cy.fixture('register-facility').then(({ admin, facility }) => {
      // --- Walk forward to Review, same as the happy path ---
      cy.get('h1').should('contain.text', 'Home');
      solveCaptcha();
      acceptConsentModal('I have read and understand this information');
      clickActionBarButton();

      cy.location('pathname').should('include', '/register-facility/administrator-information');
      fillLabeledField('common-name', 'First name', admin.firstName);
      fillLabeledField('common-name', 'Last name', admin.lastName);
      fillLabeledField('bcp-practitioner-number', 'Medical Services Plan Practitioner Number', admin.pracNumber);
      fillLabeledField('common-email', 'Contact email (optional)', admin.email);
      fillLabeledField('common-phone-number', 'Contact phone number', admin.phone);
      fillLabeledField('bcp-phone-extension', 'Extension (optional)', admin.extension);
      clickActionBarButton();
      cy.wait('@validatePractitioner');

      cy.location('pathname').should('include', '/register-facility/facility-information');
      cy.get('input#facilityName').clear().type(facility.name);
      fillLabeledField('common-street', 'Physical address', facility.address);
      fillLabeledField('common-city', 'City', facility.city);
      fillLabeledField('common-postal-code', 'Postal code', facility.postal);
      fillLabeledField('common-phone-number', 'Contact fax number (optional)', facility.fax);
      fillDate('Facility effective date', facility.effectiveDate);
      chooseRadioByOptionText('Yes');
      cy.contains('label', 'The applicant requests that the Business Cost Premium be applied').click();
      clickActionBarButton();
      cy.wait('@validateFacility');

      // --- First arrival at Review: sign, then capture the rendered proof ---
      cy.location('pathname').should('include', '/register-facility/review');
      cy.get('h1').should('contain.text', 'Review Application');
      drawSignature();

      // The signature card (signature.component.html) renders
      // `<img [src]='image.fileContent'> *ngIf='image'` outside the modal.
      // Its data URL is captured now so the post-round-trip render can be
      // compared against the exact value, not merely checked for presence.
      let originalSrc;
      cy.get('.signature-display img[alt="Signature"]')
        .should('be.visible')
        .then(($img) => {
          originalSrc = $img.attr('src');
          expect(originalSrc, 'captured signature data URL').to.match(/^data:image\//);
        })
        .then(() => {
          // --- Edit round trip: Facility Information section's Edit button
          // sends the user back to facility-information (review-facility
          // .component.ts sets redirectPath to CREATE_FACILITY_PAGES
          // .FACILITY_INFO.fullpath); its Continue button revalidates and
          // returns to Review, recreating ReviewComponent and re-running
          // writeValue on the signature control from dataService.signature,
          // which this drawSignature() call has already populated. ---
          cy.contains('.review--header', 'Facility Information')
            .find('button.btn-edit')
            .click();

          cy.location('pathname').should('include', '/register-facility/facility-information');
          clickActionBarButton();
          cy.wait('@validateFacility');

          // --- Back on Review: page renders, and the writeValue call this
          // navigation triggers on the recreated SignatureComponent throws
          // no uncaught error. This is the one assertion in this spec that
          // is false pre-fix and true post-fix for this exact repro: every
          // other assertion here (image match, resubmission) already passed
          // against the reverted code, confirmed while proving red below. ---
          cy.location('pathname').should('include', '/register-facility/review');
          cy.get('h1').should('contain.text', 'Review Application');
          cy.then(() => {
            expect(consoleErrors, 'console.error calls after the Edit round trip').to.have.length(0);
          });

          // --- The signature card still shows the same restored image. ---
          cy.get('.signature-display img[alt="Signature"]')
            .should('be.visible')
            .and('have.attr', 'src')
            .and('equal', originalSrc);

          // --- The form remains submittable without redrawing. ---
          clickActionBarButton();
          cy.wait('@uploadSignature');
          cy.wait('@createFacility');

          cy.location('pathname', { timeout: 10000 }).should('include', '/register-facility/submission');
          cy.get('h1').should('contain.text', 'Confirmation of Submission');
          cy.contains('999999').should('be.visible');
          cy.contains('OA999').should('be.visible');
        });
    });
  });
});
