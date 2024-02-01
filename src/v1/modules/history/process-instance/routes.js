const express = require('express');

const controller = require('./controller');

const router = express.Router();

router.route('/').get(controller.getProcessInstanceList);

router.route('/count').get(controller.getProcessInstanceListCount);

module.exports = router;