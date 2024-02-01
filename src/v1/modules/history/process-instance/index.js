const service = require('./service');

const controller = require('./controller');

const routes = require('./routes');

module.exports = {

  HistoryProcessInstanceService: service,

  HistoryProcessInstanceController: controller,

  HistoryProcessInstanceRoutes: routes,
};
