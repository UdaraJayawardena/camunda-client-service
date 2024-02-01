const { ERROR, SUCCESS } = require('@src/helper');

const Tracer = require('@src/tracer');

const { CustomCodes } = require('./constants');

const { Group } = require('../../services').EngineRest;

const COMPONENT = 'group/controller';

const _tCreateLog = (req, method, data) => {
  if (!data) data = {};
  Tracer.createLog(req.span, 'completed', {
    method: method,
    component: COMPONENT,
    ...data
  });
};

const createGroup = async (req, res) => {

  try {

    const response = await Group.create(req.body, req.camundaAuth);

    _tCreateLog(req, 'createGroup');

    SUCCESS(res, CustomCodes.SUCCESS, response.data, req.span);
  }
  catch (error) {
    ERROR(res, error, req.span);
  }
};

const syncGroups = async (req, res) => {
  try {

    const roles = req.roles;

    const newRoles = [];

    for (let i = 0; i < roles.length; i++) {

      const role = roles[i];

      const group = {
        id: role.id,
        name: role.name,
        type: 'USER'
      };

      const existsGroups = await Group
        .getList({ id: group.id }, req.camundaAuth);

      if (existsGroups && existsGroups.length > 0) {

        await Group.update(group.id, group, req.camundaAuth);
      } else {

        await Group.create(group, req.camundaAuth);
      }

      newRoles.push(group);
    }

    _tCreateLog(req, 'syncGroups');

    SUCCESS(res, CustomCodes.SUCCESS, newRoles, req.span);
  }
  catch (error) {
    ERROR(res, error, req.span);
  }
};

const createGroupMember = async (req, res) => {

  try {

    const { id, userId } = req.params;

    const response = await Group.Member.create(id, userId, req.camundaAuth);

    _tCreateLog(req, 'createGroupMember');

    SUCCESS(res, CustomCodes.SUCCESS, response.data, req.span);
  }
  catch (error) {
    ERROR(res, error, req.span);
  }
};

const syncGroupMembers = async (req, res) => {

  try {

    const users = req.users;

    const groups = req.roles;

    const newGroupUsers = {};

    for (let i = 0; i < users.length; i++) {

      const user = users[i];

      const group = groups.find(group => group.name === user.role);

      if (!newGroupUsers[user.role]) {

        newGroupUsers[user.role] = [];
      }

      if (!group) {

        newGroupUsers[user.role].push(`Group not found '${user.username}'`);
        continue;
      }

      await Group.Member.del(group.id, user.username, req.camundaAuth);

      await Group.Member.create(group.id, user.username, req.camundaAuth);

      newGroupUsers[user.role].push(user.username);
    }

    _tCreateLog(req, 'syncGroupMembers');

    SUCCESS(res, CustomCodes.SUCCESS, newGroupUsers, req.span);

  } catch (error) {
    ERROR(res, error, req.span);
  }
};

module.exports = {
  createGroup,
  syncGroups,
  createGroupMember,
  syncGroupMembers
};