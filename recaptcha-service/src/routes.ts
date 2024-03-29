const express = require('express');
import { Request, Response } from "express"
const router = express.Router();
const ipRangeCheck = require("ip-range-check")
const { verifyCaptcha, verifyJWT } = require('./helper');
const { AUTHORIZED_RESOURCE_SERVER_IP_RANGE_LIST } = require('./envConfig');
const winston = require('./loggerSetup')();

module.exports = function () {
  /**
   * Route: /verify/captcha
   * Purpose: validates a Google reCAPTCHA token and
   *  returns a Maximus token.
   */
  router.post('/verify/captcha', async function (req: Request, res: Response) {
    let ret = await verifyCaptcha(req.body)
    return res.send(ret)
  })

  /**
   * Route: /verify/jwt
   * Purpose: Duplicate jwt verification route from captcha-service.
   */
  router.post('/verify/jwt', async function (req: Request, res: Response) {
    let ipRangeArr = AUTHORIZED_RESOURCE_SERVER_IP_RANGE_LIST.split(',')
    let allowed = false
    for (let ipRange of ipRangeArr) {
      if (ipRangeCheck(req.ip, ipRange.trim())) {
        allowed = true
        break
      }
    }
    if (!allowed) {
      winston.debug(`Unauthorized access to /verify/jwt from ip ${req.ip}.`)
      res.status(403).end()
      return
    }
    let ret = await verifyJWT(req.body.token, req.body.nonce)
    res.send(ret)
  })

  /**
   * Route: /hello
   * Purpose: verifies that the service is alive on openshift.
   */
  router.get('/hello', function (req: Request, res: Response) {
    res.status(200).end();
    //winston.debug('ready')
  })

  return router;
};
