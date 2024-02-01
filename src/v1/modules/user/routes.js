const express = require('express');

const Controller = require('./controller');

const { AuthMiddleware } = require('@src/v1/middleware');

const router = express.Router();

router.route('/')
  .post(Controller.createUser);

router.route('/sync').post(
  AuthMiddleware.bindUsers,
  Controller.syncUsers);

router.route('/:id')
  .delete(Controller.deleteUser);  

module.exports = router;