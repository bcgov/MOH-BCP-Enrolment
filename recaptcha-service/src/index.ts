import { Request, Response } from "express"

const express = require('express');
const app = express();
const { NODE_ENV, SECRET, CORS_ALLOW_ALL, SERVICE_PORT, LISTEN_IP, LOG_LEVEL } = require('./envConfig');
const winston = require('./loggerSetup')();
const routes = require('./routes');

// Prevent default keys going into production
if (NODE_ENV == 'production') {
  if (SECRET == 'defaultSecret') {
    winston.info("You MUST change SECRET before running in a production environment.")
    process.exit(1)
  }
}

// Configure CORS access.
if (NODE_ENV != 'production' ||
  CORS_ALLOW_ALL == 'true') {
  winston.info("CORS Access Allowed.");
  app.use(function (req: Request, res: Response, next: Function) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
  })
}

////////////////////////////////////////////////////////
/*
 * App Startup
 */
////////////////////////////////////////////////////////
app.use(express.json())
app.use("/", routes());

var args = process.argv
if (args.length == 3 && args[2] == 'server') {
  var server = app.listen(SERVICE_PORT, LISTEN_IP, function () {
    var host = server.address().address
    var port = server.address().port
    winston.info(`MyGov Captcha Service listening at http://${host}:${port}`)
    winston.info(`Log level is at: ${LOG_LEVEL}`)
  })
}