const express = require('express');

const controller = require('./controller');

const router = express.Router();

router.route('/').get(
  controller.getJobList
);

router.route('/:jobId/execute').post(
  controller.execute
);

router.route('/:jobId/due-date').put(
  controller.updateDueDate
);

module.exports = router;