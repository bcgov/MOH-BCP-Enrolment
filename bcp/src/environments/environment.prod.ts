export const environment = {
  production: true,
  bypassModal: false,
  bypassSplashPage: false,

  // TODO: REVERT THIS! ENABLED ONLY FOR EASY UX REVIEW FOR JEFF
  bypassGuards: false,
  useDummyData: false,


  useMockBackend: false,
  useMockBackendData: false,
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
