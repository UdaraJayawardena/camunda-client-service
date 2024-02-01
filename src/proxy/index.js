const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const { ROUTES } = require('./routes');

const setupProxies = (app) => {
  ROUTES.forEach(r => {
    app.use(r.url, createProxyMiddleware({ ...r.proxy, onProxyReq: fixRequestBody }));
  });
};

module.exports = {
  setupProxies
};
