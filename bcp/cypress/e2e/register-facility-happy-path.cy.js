// Happy-path walk of the register-facility flow (BCP_ROUTES.CREATE_FACILITY,
// src/app/modules/core-bcp/models/bcp-route-constanst.ts), replacing the
// deleted Protractor suite (bcp/e2e/register-facility/**, see
// bcp-reg-facility-happy-path.ts and bcp-reg-facility.po.ts for field order
// and sample values - this spec's fixture data comes from
// bcprf-data.json[0], the index the old happy path used).
//
// Every backend endpoint is stubbed with cy.intercept (see
// src/environments/environment.ts for the api paths); this spec does not
// depend on the OpenShift dev cluster proxy.target in proxy.conf.json being
// reachable. The BC gov external geocoder
// (GeocoderService.BASE_URL, moh-common-lib-angular.mjs ~line 2126) is
// stubbed too, since common-street's typeahead (useGeoCoder=true, see
// facility-info.component.html) fires a real network request 500ms after
// the third keystroke.

const { stubCaptcha, solveCaptcha } = require('../support/pages/captcha-helpers');
const {
  fillLabeledField,
  fillDate,
  chooseRadioByOptionText,
  clickActionBarButton,
  acceptConsentModal,
  drawSignature,
} = require('../support/pages/common-controls');

describe('Register facility - happy path', () => {
  let consoleErrors;

  beforeEach(() => {
    consoleErrors = [];
    cy.on('window:before:load', (win) => {
      cy.stub(win.console, 'error').callsFake((...args) => {
        consoleErrors.push(args.join(' '));
      });
    });

    // SpaEnvService.loadEnvs() (src/app/services/spa-env.service.ts) POSTs
    // here on first injection, which happens as soon as the consent modal
    // (present on this flow's home page) constructs.
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

    // SplunkLoggerService (src/app/services/splunk-logger.service.ts) posts
    // here on several page transitions.
    cy.intercept('POST', '**/bcp/api/logging', { statusCode: 200, body: 'OK' });

    stubCaptcha('/bcp/api/captcha');

    // common-street's GeocoderService (moh-common-lib-angular.mjs, class
    // GeocoderService) calls this real external host directly, not through
    // the app's own /bcp/api/address proxy - stubbed here so typing an
    // address never reaches the network.
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

  it('walks home, administrator info, facility info and review to submission', () => {
    cy.fixture('register-facility').then(({ admin, facility }) => {
      // --- Home page: consent modal gates the rest of the flow ---
      cy.get('h1').should('contain.text', 'Home');
      solveCaptcha();
      acceptConsentModal('I have read and understand this information');
      clickActionBarButton();

      // --- Administrator information ---
      cy.location('pathname').should('include', '/register-facility/administrator-information');
      fillLabeledField('common-name', 'First name', admin.firstName);
      fillLabeledField('common-name', 'Last name', admin.lastName);
      fillLabeledField('bcp-practitioner-number', 'Medical Services Plan Practitioner Number', admin.pracNumber);
      fillLabeledField('common-email', 'Contact email (optional)', admin.email);
      fillLabeledField('common-phone-number', 'Contact phone number', admin.phone);
      fillLabeledField('bcp-phone-extension', 'Extension (optional)', admin.extension);
      clickActionBarButton();
      cy.wait('@validatePractitioner');

      // --- Facility information ---
      cy.location('pathname').should('include', '/register-facility/facility-information');
      cy.get('input#facilityName').clear().type(facility.name);
      fillLabeledField('common-street', 'Physical address', facility.address);
      fillLabeledField('common-city', 'City', facility.city);
      fillLabeledField('common-postal-code', 'Postal code', facility.postal);
      fillLabeledField('common-phone-number', 'Contact fax number (optional)', facility.fax);
      fillDate('Facility effective date', facility.effectiveDate);
      // "Is the mailing address the same as the physical facility address?"
      // common-radio - answer Yes to skip the mailing-address fields.
      chooseRadioByOptionText('Yes');
      // isQualifyForBCP common-radio binds no `label` input, so its legend
      // is blank - scoped by the option's own (unique) text instead.
      cy.contains('label', 'The applicant requests that the Business Cost Premium be applied').click();
      clickActionBarButton();
      cy.wait('@validateFacility');

      // --- Review and submit ---
      cy.location('pathname').should('include', '/register-facility/review');
      cy.get('h1').should('contain.text', 'Review Application');
      drawSignature();
      clickActionBarButton();
      cy.wait('@uploadSignature');
      cy.wait('@createFacility');

      // --- Submission / confirmation ---
      cy.location('pathname', { timeout: 10000 }).should('include', '/register-facility/submission');
      cy.get('h1').should('contain.text', 'Confirmation of Submission');
      cy.contains('Your application has been submitted').should('be.visible');
      cy.contains('999999').should('be.visible');
      cy.contains('OA999').should('be.visible');
    });
  });
});
