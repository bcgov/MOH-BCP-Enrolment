// Happy-path walk of the practitioner-registration flow
// (BCP_ROUTES.PRACTITIONER_REGISTRATION,
// src/app/modules/core-bcp/models/bcp-route-constanst.ts), replacing the
// deleted Protractor suite (bcp/e2e/practitioner-assignment/**). The old
// happy path (bcp-pa-happy-path.ts) only asserted as far as
// practitioner-attachment and had its submission assertion commented out;
// this spec goes all the way to the submission page, which the app
// (RegisterPractitionerApiService.maintainPractitioner ->
// RegisterPractitionerApiService/pages/review/review.component.ts submit())
// does reach once the signature and stubbed backend responses are in place.
//
// This spec picks "Cancel existing attachment" on the practitioner-attachment
// page rather than the old happy path's "new attachment" branch: it needs
// only the attachmentType radio and one common-date field
// (practitioner-attachment.component.html, shouldShowCancelSection), instead
// of a second radio and a second conditional date field, and it exercises a
// branch the old suite's happy path (index 2, changeAttach: "new") did not
// cover at all.
//
// Every backend endpoint is stubbed with cy.intercept - see
// register-facility-happy-path.cy.js's header comment for the shared
// captcha/geocoder/env rationale, identical in this flow.

const { stubCaptcha, solveCaptcha } = require('../support/pages/captcha-helpers');
const {
  fillLabeledField,
  fillDate,
  chooseRadioByOptionText,
  clickActionBarButton,
  acceptConsentModal,
  drawSignature,
} = require('../support/pages/common-controls');

describe('Practitioner assignment - happy path', () => {
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

    cy.intercept('POST', '**/bcp/api/bcpIntegration/maintainPractitioner', {
      statusCode: 200,
      body: {
        returnCode: '0',
        requestUUID: 'stub',
        applicationUUID: 'stub',
        referenceNumber: '888888',
      },
    }).as('maintainPractitioner');

    cy.visit('/practitioner-registration/home');
    cy.wait('@checkEnv');
  });

  afterEach(() => {
    expect(consoleErrors, 'browser console.error calls').to.have.length(0);
  });

  it('walks home, practitioner info, facility info and practitioner attachment to review and submission', () => {
    cy.fixture('practitioner-assignment').then(({ practitioner, facility, cancellationDate }) => {
      // --- Home page: consent modal gates the rest of the flow ---
      cy.get('h1').should('contain.text', 'Home');
      solveCaptcha();
      acceptConsentModal('I have read and understand this information');
      clickActionBarButton();

      // --- Practitioner information ---
      cy.location('pathname').should('include', '/practitioner-registration/practitioner-information');
      fillLabeledField('common-name', 'First name', practitioner.firstName);
      fillLabeledField('common-name', 'Last name', practitioner.lastName);
      fillLabeledField('bcp-practitioner-number', 'Medical Services Plan Practitioner Number', practitioner.pracNumber);
      fillLabeledField('common-email', 'Email address (optional)', practitioner.email);
      fillLabeledField('common-phone-number', 'Phone number', practitioner.phone);
      fillLabeledField('bcp-phone-extension', 'Extension', practitioner.extension);
      clickActionBarButton();
      cy.wait('@validatePractitioner');

      // --- Facility information ---
      cy.location('pathname').should('include', '/practitioner-registration/facility-information');
      cy.get('input#facilityName').clear().type(facility.name);
      fillLabeledField('bcp-facility-number', 'Medical Services Plan Facility Number', facility.facilityNumber);
      fillLabeledField('common-street', 'Physical address', facility.address);
      fillLabeledField('common-city', 'City', facility.city);
      fillLabeledField('common-postal-code', 'Postal code', facility.postal);
      fillLabeledField('common-phone-number', 'Fax number (optional)', facility.fax);
      clickActionBarButton();
      cy.wait('@validateFacility');

      // --- Practitioner attachment ---
      cy.location('pathname').should('include', '/practitioner-registration/practitioner-attachment');
      chooseRadioByOptionText('Cancel existing attachment');
      fillDate('Cancellation date for existing attachment', cancellationDate);
      clickActionBarButton();

      // --- Review and submit ---
      cy.location('pathname').should('include', '/practitioner-registration/review');
      // review.component.ts hardcodes its own pageTitle ('Review Request'),
      // distinct from PRACTITIONER_REGISTRATION_PAGES.REVIEW.title
      // ('Review Pracitioner Attachment') used for route/breadcrumb purposes.
      cy.get('h1').should('contain.text', 'Review Request');
      drawSignature();
      clickActionBarButton();
      cy.wait('@uploadSignature');
      cy.wait('@maintainPractitioner');

      // --- Submission / confirmation ---
      cy.location('pathname', { timeout: 10000 }).should('include', '/practitioner-registration/submission');
      cy.get('h1').should('contain.text', 'Confirmation of Submission');
      cy.contains('Your application has been successfully processed').should('be.visible');
      cy.contains('888888').should('be.visible');
    });
  });
});
