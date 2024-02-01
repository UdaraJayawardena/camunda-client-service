const express = require('express');

const controller = require('./controller');

const router = express.Router();

router.route('/claim').post(controller.claimTask);

router.route('/complete').post(controller.completeTask);

router.route('/claim-and-complete').post(controller.claimAndCompleteTask);

router.route('/').get(controller.getTaskList);

router.route('/:taskId/variables').get(controller.getTaskVariableList);

module.exports = router;