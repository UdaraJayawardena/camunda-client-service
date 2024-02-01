const { APPLICATION } = require('../config').Config;

const { FORMAT_HTTP_HEADERS, TRACER } = require('../config').Jeager;

const { CustomError } = require('./constants');

const injectSpan = (headers, span) => {

  if (!headers) headers = {};

  if (span) {

    TRACER.inject(span, FORMAT_HTTP_HEADERS, headers);
  }

  return headers;
};

/**
 * Creates the Span object using the request object
 * @param {object} req Request object
 * @returns Span
 */
const createSpan = req => {

  if (APPLICATION.ENV === 'test') return;

  if (!req) throw CustomError.ERR_SPAN_REQUEST_NOT_FOUND;

  const parentContext = TRACER.extract(FORMAT_HTTP_HEADERS, req.headers);

  const name = `${req.method} ${req.baseUrl}${req.path}`;

  const options = {
    tags: {
      'span.kind': 'server',
      'component': 'crm-management',
      'http.method': req.method,
      'http.url': req.url
    }
  };

  if (parentContext) {
    options.childOf = parentContext;
  }

  return TRACER.startSpan(name, options);
};

/**
 * Creates a log trace using `Jaeger OpenTrace`
 * @param {Span} span - Jaeger Span Object
 * @param {string} methodName - Name of the function
 * @param {string} layer - [`Controller`, `Service`, `Database`]
 * @param {string} description - Description of the function
 */
const createLog = (span, event, data) => {

  if (APPLICATION.ENV === 'test') return;

  const { method, component } = data;

  if (event === 'error')
    throw 'Please use createErrorLog';

  if (!span || !method || !component)
    throw CustomError.ERR_CREATE_LOG_PARAMS_MISSING;

  span.log({
    'event': event,
    ...data
  });
};

/**
 * Creates an error log in the trace using `Jaeger OpenTrace`
 * @param {Span} span Jaeger Span Object
 * @param {number} code Erro code
 * @param {string} message Error Message
 * @param {any} error Error data object
 */
const createErrorLog = (span, error, stack) => {

  if (APPLICATION.ENV === 'test') return;

  const { code, message } = error;

  if (!span || !code || !message)
    throw CustomError.ERR_CREATE_LOG_PARAMS_MISSING;

  span.setTag('error', true);
  span.setTag('http.status_code', code);
  span.log({
    'event': 'error',
    'error.object': error,
    'message': message,
    'stack': stack
  });
};

module.exports = {

  injectSpan,

  createSpan,

  createLog,

  createErrorLog
};
