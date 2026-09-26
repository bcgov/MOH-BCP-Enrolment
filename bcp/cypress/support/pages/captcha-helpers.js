// The BC gov common-captcha widget (moh-common-lib-angular, captcha entry
// point) fetches an image challenge and verifies the typed answer against a
// real backend. There is no local server for either call in this dev setup,
// the same reason /bcp/api/env is stubbed elsewhere. Both endpoints are read
// out of CaptchaDataService in
// node_modules/moh-common-lib-angular/fesm2022/moh-common-lib-angular-captcha.mjs:15-19:
//   fetchData     -> POST {apiBaseUrl}/captcha         body { nonce }
//   verifyCaptcha -> POST {apiBaseUrl}/verify/captcha  body { nonce, answer, validation }
//
// CaptchaComponent.answerChanged() (same file, ~line 143) calls
// this._onChange(event) the instant the answer reaches 6 characters, and
// verifyCaptcha() is fired at the same point. The stubbed /verify/captcha
// response only has to come back with valid:true for handleVerify()
// (~line 176) to set state to SUCCESS_VERIFY_ANSWER_CORRECT and emit
// onValidToken(payload.jwt).
//
// Confirmed by running this suite in a real browser (see spec files) -
// solveCaptcha() below reaches CoreConsentModalComponent.handleToken() and
// unblocks the "I have read and understand" checkbox path.

/** Intercepts both captcha network calls so the widget can be driven
 * offline. apiBaseUrl must match the app's captchaApiBaseUrl constant
 * (src/environments/environment.ts, '/bcp/api/captcha'). */
function stubCaptcha(apiBaseUrl) {
  cy.intercept('POST', `**${apiBaseUrl}/captcha`, {
    statusCode: 200,
    body: { captcha: '<div>stub captcha challenge</div>', validation: 'stub-validation-token' },
  }).as('captchaFetch');

  cy.intercept('POST', `**${apiBaseUrl}/verify/captcha`, {
    statusCode: 200,
    body: { valid: true, jwt: 'stub-jwt-token' },
  }).as('captchaVerify');
}

/** Waits for the stubbed challenge, types a 6-character answer (the
 * component only calls verify once the field reaches 6 characters, see
 * name="answer" maxlength="6" in the compiled captcha template), and waits
 * for the stubbed verify response. */
function solveCaptcha() {
  cy.wait('@captchaFetch');
  cy.get('input#answer').type('123456');
  cy.wait('@captchaVerify');
}

module.exports = {
  stubCaptcha,
  solveCaptcha,
};
