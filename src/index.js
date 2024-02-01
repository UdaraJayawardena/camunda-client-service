const express = require('express');

const Sentry = require('@sentry/node');

const Tracing = require('@sentry/tracing');

const app = express();

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const router = require('./router');

const v1 = require('./v1');

const { setupProxies } = require('./proxy');

const { accessHeader } = require('./init');

const { Config } = require('../config');

const { JSON_PARSER, URLENCODED } = Config.BODY_PARSER;

Sentry.init({
  dsn: Config.APPLICATION.SENTRY_DSN,
  environment: Config.APPLICATION.SENTRY_ENVIRONMENT,
  tracesSampleRate: Config.APPLICATION.SENTRY_SAMPLERATE,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({
      // to trace all requests to the default router
      app,
      // alternatively, you can specify the routes you want to trace:
      // router: someRouter,
    }),
  ],
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(bodyParser.json(JSON_PARSER));

app.use(bodyParser.urlencoded(URLENCODED));

app.use(cookieParser());

app.use(accessHeader);

setupProxies(app);

v1(app);

app.use('/', router);

app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture all 404 and 500 errors
      console.log(error);
      if (error.status >= 400 && error.status <= 503) {
        return true;
      }
      return false;
    },
  })
);

module.exports = app;