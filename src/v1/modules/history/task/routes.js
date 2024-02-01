const express = require('express');

const controller = require('./controller');

const router = express.Router();

router.route('/').get(controller.getTaskList);

router.route('/count').get(controller.getTaskListCount);

module.exports = router;