const dotEnv = require('dotenv');

const chalk = require('chalk');

const termination = chalk.bold.magenta;

dotEnv.config();

const terminateServer = () => {
  console.log(
    termination('Application terminate due to mismatch environment\n')
  );

  process.exit(0);
};

const ENV_CONFIGURATION = () => {
  try {
    const path = `${APPLICATION.ENV_FILE_PATH}/${APPLICATION.ENV}.json`;

    return require(path);
  } catch (err) {
    console.log(err);

    console.log(`\n********** ENVIRONMENT NOT FOUND **********
      \nPlease follow below step
      \n01. Create development.json, production,json and test.json in /config/env/ 
      \n02. Copy sample content below created all files.
      \n03. Change content
      \n\nNote:- Do you want to run/build development environment, only create development.json\n`);

    terminateServer();
  }
};

const IS_TEST = process.env.NODE_ENV === 'test';

const IS_DEV = process.env.NODE_ENV === 'development'
  && process.env.APP_ENV === 'development';

const IS_STAGE = process.env.NODE_ENV === 'development'
  && process.env.APP_ENV === 'stage';

const IS_PROD = process.env.NODE_ENV === 'production';

const IS_NOT_PROD = process.env.NODE_ENV !== 'production';

const API_VERSIONS = process.env.API_VERSIONS.split(' ');

const APPLICATION = {

  VERSION: process.env.VERSION,
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  HOST: process.env.HOST,

  APP_NAME: process.env.APP_NAME,
  APP_KEY: process.env.APP_KEY,
  APP_CLUSTER: process.env.APP_CLUSTER,
  APP_ENV: process.env.APP_ENV,
  APP_URL: process.env.APP_URL,
  API_VERSIONS: API_VERSIONS,
  APP_HOST: process.env.APP_HOST,
  APP_VERSION: process.env.APP_VERSION,

  ENV_FILE_PATH: process.env.ENV_FILE_PATH,
  CAMUNDA_GRANT_NAME: process.env.CAMUNDA_GRANT_NAME,

  IS_TEST: IS_TEST,

  IS_DEV: IS_DEV,

  IS_STAGE: IS_STAGE,

  IS_PROD: IS_PROD,

  IS_NOT_PROD: IS_NOT_PROD,

  SENTRY_DSN: process.env.SENTRY_DSN,
  SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
  SENTRY_SAMPLERATE: process.env.SENTRY_SAMPLERATE,
};

const SWAGGER = {
  DEFINITION: version => ({
    swagger: '2.0',
    components: {},
    info: {
      title: `CAMUNDA REST API ${version}`,
      version: require('../package.json').version,
      description: 'Endpoints to test the camunda rest API routes'
    },
    host: APPLICATION.APP_URL,
    basePath: `/${version}`,
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'authorization',
        in: 'header',
      },
    },
    security: [{ bearerAuth: [] }],
  }),

  APIS: {
    V1: ['sme-loan-request', 'platform-parameters', 'contract', 'debt-at-third-party', 'debtor-creditor', 'sme-loan-request-alarm'],
    V2: []
  }
};

const BODY_PARSER = {
  JSON_PARSER: {
    limit: '50mb'
  },

  URLENCODED: {
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
  }
};

const ACCESS_HEADERS = {

  ALLOWED_DOMAINS: ENV_CONFIGURATION().ALLOWED_DOMAINS,

  ALLOW_METHODS: 'GET,PUT,POST,DELETE,OPTIONS',

  ALLOW_HEADERS: 'Content-Type, Authorization, Content-Length, X-Requested-With'
};

const CAMUNDA = {
  ...ENV_CONFIGURATION().camunda
};

const AUTHENTICATION = ENV_CONFIGURATION().authentication;

module.exports = {

  APPLICATION,

  BODY_PARSER,

  ACCESS_HEADERS,

  SWAGGER,

  CAMUNDA,

  AUTHENTICATION
};
