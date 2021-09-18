require('dotenv').config();
//Load all environment variables for the recaptcha service
module.exports = {
  AUTHORIZED_RESOURCE_SERVER_IP_RANGE_LIST: process.env.AUTHORIZED_RESOURCE_SERVER_IP_RANGE_LIST || '127.0.0.1',
  LISTEN_IP: process.env.LISTEN_IP || '0.0.0.0',
  HOSTNAME: require('os').hostname(),
  JWT_SIGN_EXPIRY: process.env.JWT_SIGN_EXPIRY || "30",// in minutes
  SECRET: process.env.SECRET || "defaultSecret",
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  SERVICE_PORT: process.env.SERVICE_PORT || 8080,
  WINSTON_HOST: process.env.WINSTON_HOST,
  WINSTON_PORT: process.env.WINSTON_PORT,
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  NODE_ENV: process.env.NODE_ENV,
  CORS_ALLOW_ALL: process.env.CORS_ALLOW_ALL,
  BYPASS_ANSWER: process.env.BYPASS_ANSWER
}