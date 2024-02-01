const express = require('express');

const Controller = require('./controller');

const router = express.Router();

router
  .route('/')
  .get(Controller.getList);

router
  .route('/:id/modification')
  .post(Controller.modify);

router
  .route('/:id/variables')
  .post(Controller.modifyVariable);

module.exports = router;