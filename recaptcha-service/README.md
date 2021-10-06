# Recaptcha Service

The Recaptcha service processes requests to validate Google Recaptcha tokens.

### Routes:
* GET: /hello
    Behavior: Returns 200 OK to verify that the service is operational.

* POST: /verify/captcha
    Payload: { nonce, token }
    Behavior: Sends the RECAPTCHA_SECTRET_KEY and token to Google to validate the token.  Evaluates the response, and generates a token for use in form submission if the Recaptcha token is valid.

* POST:  /verify/jwt  (currently not utilized - duplicated from Captcha Service)
    Payload: { nonce, token }
    Behavior: verifies that a token is a valid token previously created by the /verify/captcha route.

### Environment Variables:
* LOG_LEVEL  The level of logging output used.
* SERVICE_PORT  The port where the service will listen for requests.
* SECRET  The secret key for the final JWT returned when a Recaptcha token is found to be valid.
* BYPASS_ANSWER  The value passed instead of a Recaptcha token to trigger an automatic valid response. 
* CORS_ALLOW_ALL  true = cors requests accepted, false = cors requests denied.
* JWT_SIGN_EXPIRY  The time(in minutes) that a returned token will remain valid after a Recaptcha token is found to be valid.
* RECAPTCHA_SECRET_KEY  The secret key provided by Google for validation of Recaptcha tokens.  Must match the public key used by the Recaptcha UI component.

### Repository: 
https://github.com/bcgov/MOH-BCP-Enrolment/tree/main/recaptcha-service