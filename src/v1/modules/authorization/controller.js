const { ERROR, SUCCESS } = require('@src/helper');

const Tracer = require('@src/tracer');

const { CustomCodes } = require('./constants');

const { Authorization, Group } = require('../../services').EngineRest;

const COMPONENT = 'authorization/controller';

const _tCreateLog = (req, method, data) => {
  if (!data) data = {};
  Tracer.createLog(req.span, 'completed', {
    method: method,
    component: COMPONENT,
    ...data
  });
};

const _createAuthorization = async (groupPermission, camundaAuth) => {

  const auth = {
    groupId: groupPermission.groupId,
    type: groupPermission.cAuthTypeIntRepresentation,
    resourceType: groupPermission.cResourceIntRepresentation,
    permissions: [groupPermission.cPermissionKey],
    resourceId: groupPermission.resourceId
  };

  const existsAuthList = await Authorization.getList({
    type: auth.type,
    resourceType: auth.resourceType,
    resourceId: auth.resourceId,
    groupIdIn: auth.groupId
  }, camundaAuth);

  if (existsAuthList.length > 0) {
    const existsAuth = existsAuthList[0];
    auth.permissions.push(...existsAuth.permissions);
    auth.permissions = [...new Set(auth.permissions)];
    await Authorization.update(existsAuth.id, auth, camundaAuth);
  } else {
    await Authorization.create(auth, camundaAuth);
  }

  return auth;
};

const syncPermissions = async (req, res) => {

  try {

    const groupPermissions = req.groupPermissions;

    const newGroupPermissions = {};

    for (let i = 0; i < groupPermissions.length; i++) {

      const groupPermission = groupPermissions[i];

      const { groupId } = groupPermission;

      if (!newGroupPermissions[groupId]) {

        newGroupPermissions[groupId] = [];
      }

      const group = Group.getList({ id: groupId }, req.camundaAuth);

      if (!group) {

        newGroupPermissions[groupId].push(`Group not found '${groupId}'`);
        continue;
      }

      await _createAuthorization(groupPermission, req.camundaAuth);

      newGroupPermissions[groupId].push({
        resourceName: groupPermission.cResourceName,
        permissions: [groupPermission.cPermissionKey]
      });
    }

    _tCreateLog(req, 'syncGroupMembers');

    SUCCESS(res, CustomCodes.SUCCESS, newGroupPermissions, req.span);

  } catch (error) {
    ERROR(res, error, req.span);
  }
};

module.exports = {
  syncPermissions
};