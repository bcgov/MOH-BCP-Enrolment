// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  bypassModal: false,
  bypassGuards: true,
  bypassSplashPage: false,
  useDummyData: false, // For testing against real back-end
  useMockBackend: false,
  useMockBackendData: false,
  useRecaptcha: true,
  api: {
    base: '/bcp/api/bcpIntegration',
    captcha: '/bcp/api/captcha',
    recaptcha: '/bcp/api/recaptcha',
    splunk: '/bcp/api/logging',
    attachment: '/bcp/api/bcpAttachment',
    env: '/bcp/api/env',
    address: '/bcp/api/address',
  },
  links: {
    tbd: 'google.com',
    hibc: 'http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents-contact-us',
    practitionerAttachment: '/bcp/practitioner-registration/home',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
