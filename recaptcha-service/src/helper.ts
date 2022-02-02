const axios = require('axios');
const jwt = require('jsonwebtoken');
const winston = require('./loggerSetup')();
const { SECRET, JWT_SIGN_EXPIRY, RECAPTCHA_SECRET_KEY, BYPASS_ANSWER } = require('./envConfig');

export interface VerifyJWTResponse {
  valid: boolean
}

interface VerifyCaptchaRequest {
  nonce: string,
  token: string,
}

export interface VerifyCaptchaValidResponse {
  valid: boolean,
  jwt: string
}

export interface VerifyCaptchaInvalidResponse {
  valid: boolean
}

/**
 * verifyCaptcha - validates a reCAPTCHA token and returns a
 *  Maximus token that allows form submission.
 * @param payload - a Google reCAPTCHA token to be validated
 * @returns 
 */
var verifyCaptcha = async function (payload: VerifyCaptchaRequest): Promise<VerifyCaptchaInvalidResponse | VerifyCaptchaValidResponse> {
  var gToken = payload.token;
  var nonce = payload.nonce;

  // A bypass is provided to allow circumvention
  //of the reCAPTCHA system. This duplicates the
  //behaviour of the old Captcha system.
  if (BYPASS_ANSWER &&
    BYPASS_ANSWER.length > 0 &&
    BYPASS_ANSWER === gToken) {

    winston.debug(`Captcha bypassed! Creating JWT.`)

    var token = jwt.sign(
      { data: { nonce: nonce } },
      SECRET,
      { expiresIn: JWT_SIGN_EXPIRY + 'm' });

    return {
      valid: true,
      jwt: token
    }
  }

  return axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${gToken}`,
    {},
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
      },
    },
  )
    .then((res:any) => {
      let data = res.data;
      //the following line can be uncommented when debugging data is needed
      //please re-comment it when finished to prevent secure info from leaking into the logs
      //also don't forget to re-build the recaptcha service for the changes to take effect
      //winston.debug("received data: " + JSON.stringify(data));
      if ( data.success ) {
        //if the success property is true Google has
        //verified and accepted the token
        winston.debug(`Google token verified`);
        var token = jwt.sign(
          { data: { nonce: nonce } },
          SECRET,
          { expiresIn: JWT_SIGN_EXPIRY + 'm' });
    
        return {
          valid: true,
          jwt: token
        }
      } else {
        //Google rejected the token
        winston.debug(`Google token verifiecation failed`);
        return {
          valid: false
        }
      }
    })
    .catch((e: Error) => {
      // catch communication errors
      winston.error( "Error connecting to google recaptcha verifiecation", e );
      return {
        valid: false
      }
    })
}

/**
 * verifyJWT - verfies a Maximus token that allows form submission.
 *  Note: this function is a duplication of the one in the previous
 *    captcha service, and has not yet been utilised(as of Sept. 2021).
 * @param token - a Maximus token
 * @param nonce 
 * @returns:boolean - true for valid token.
 */
var verifyJWT = async function (token: string, nonce: string): Promise<VerifyJWTResponse> {
  winston.debug(`verifying: ${token} against ${nonce}`)
  try {
    var decoded = jwt.verify(token, SECRET)
    winston.debug(`decoded: ` + JSON.stringify(decoded))
    if (decoded.data && decoded.data.nonce === nonce) {
      winston.debug(`Captcha Valid`)
      return {
        valid: true
      }
    } else {
      winston.debug(`Captcha Invalid!`)
      return {
        valid: false
      }
    }
  } catch (e) {
    winston.error(`Token/ResourceID Verification Failed: ` + JSON.stringify(e))
    return {
      valid: false
    }
  }
}
module.exports = { verifyCaptcha, verifyJWT };
