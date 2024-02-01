const { CAMUNDA } = require('../../config').Config;

const baseUrl = CAMUNDA.baseUrl.replace('/engine-rest', '');

const ROUTES = [
  {
    url: '/swagger-ui',
    proxy: {
      target: baseUrl,
      changeOrigin: true,
      pathRewrite: {
        ['^/swagger-ui']: 'swaggerui'
      },
    }
  },
  {
    url: '/engine-rest',
    proxy: {
      target: baseUrl,
      changeOrigin: true
    }
  }
];

module.exports = { ROUTES };
