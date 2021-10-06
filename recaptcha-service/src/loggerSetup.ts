const winston = require('winston');
const { HOSTNAME, LOG_LEVEL, WINSTON_HOST, WINSTON_PORT, } = require('./envConfig');

/*
 * Script for setting up application logging
 */
winston.level = LOG_LEVEL
winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, {
  'timestamp': true
})
if (WINSTON_PORT) {
  winston.add(winston.transports.Syslog, {
    host: WINSTON_HOST,
    port: WINSTON_PORT,
    protocol: 'udp4',
    localhost: HOSTNAME
  })
}

module.exports = () => {
  return winston;
}