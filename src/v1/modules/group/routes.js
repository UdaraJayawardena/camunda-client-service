const express = require('express');

const Controller = require('./controller');

const { AuthMiddleware } = require('@src/v1/middleware');

const router = express.Router();

router.route('/')
  .post(Controller.createGroup);

router.route('/sync').post(
  AuthMiddleware.bindRoles,
  Controller.syncGroups);

router.route('/:id/members/:userId')
  .put(Controller.createGroupMember);

router.route('/members/sync')
  .put(
    AuthMiddleware.bindUsers,
    AuthMiddleware.bindRoles,
    Controller.syncGroupMembers);

module.exports = router;