const express = require('express');

const controller = require('./controller');

const router = express.Router();

router.route('/').get(controller.getDefinitionsList);

router.route('/tenant-id/:tenantId/resource/:resource/statistics')
  .get(controller.getDefinitionsResourceStatistics);

router.route('/tenant-id/:tenantId/resource/:resource/sequence-flow')
  .get(controller.getDefinitionsResourceSequenceFlow);

router.route('/status')
  .get(controller.getStatusList);

router.route('/:id/start').post(controller.startInstanceById);

router.route('/key/:key/start').post(controller.startInstanceByKey);

router.route('/key/:key/tenant-id/:tenantId/start').post(controller.startInstanceByKeyForTenant);

module.exports = router;