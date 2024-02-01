const service = require('./service');

const controller = require('./controller');

const routes = require('./routes');

module.exports = {

  HistoryActivityInstanceService: service,

  HistoryActivityInstanceController: controller,

  HistoryActivityInstanceRoutes: routes,
};
