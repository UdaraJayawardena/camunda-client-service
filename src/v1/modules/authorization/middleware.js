const excelToJson = require('convert-excel-to-json');

const { ERROR, SUCCESS, TE, to } = require('@src/helper');

const { CustomCodes } = require('./constants');

const AuthService = require('../../services/auth/service');

const { Group, Authorization, User, Tenant } = require('../../services').EngineRest;

const AUTH_TYPES = {
  GLOBAL: 0,
  ALLOW: 1,
  DENY: 2
};

const RESOURCE_TYPES = {
  Application: 0,
  User: 1,
  Group: 2,
  'Group Membership': 3,
  Authorization: 4,
  Filter: 5,
  'Process Definition': 6,
  Task: 7,
  'Process Instance': 8,
  Deployment: 9,
  'Decision Definition': 10,
  Tenant: 11,
  'Tenant Membership': 12,
  Batch: 13,
  'Decision Requirements Definition': 14,
  'Operation Log': 17,
  'Historic Task Instance': 19,
  'Historic Process Instance': 20,
};

const _getGroupId = (sheet, roles) => {
  const roleObj = roles.find(role => role.name === sheet);
  if (roleObj) return roleObj.id;
  return '';
};

const _createGroup = async (sheet, roles) => {

  const groupId = _getGroupId(sheet, roles);

  if (groupId) {

    const group = {
      id: groupId,
      name: sheet,
      type: 'USER'
    };

    await Group.create(group);

    return group;
  }

  return null;
};



const _deleteAuthorizations = async (groupId) => {

  const authList = await Authorization.getList({
    groupIdIn: groupId
  });

  for (let i = 0; i < authList.length; i++) {

    const auth = authList[i];

    await Authorization.del(auth.id);
  }
};

const _createAuthorization = async (sheetRow, group) => {

  // const groupList = Group.getList({ id: 'G0001' });

  // if (groupList && groupList.length > 0) return;

  for (let j = 0; j < sheetRow.length; j++) {

    const row = sheetRow[j];

    if (j === 0) continue;

    if (row.C === 'NONE') continue;

    const auth = {
      groupId: group.id,
      type: AUTH_TYPES[row.A],
      resourceType: RESOURCE_TYPES[row.B],
      permissions: [row.C],
      resourceId: row.D
    };

    await Authorization.create(auth);
  }
};

const validateAccessMatrixFile = async (req, res, next) => {

  try {

    const file = req.file;

    if (!file) TE({ code: 400, message: 'Matrix file not found.' });

    if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      TE({ code: 400, message: 'Matrix file type not supported, please use .xlsx.' });
    }

    console.log('ACCESS MATRIX: Validated file');

    next();

  } catch (error) {
    ERROR(res, error);
  }
};

const convertAccessFileToJson = async (req, res, next) => {

  try {

    const result = excelToJson({
      sourceFile: req.file.path,
    });

    // save converted file to request.
    req.jsonDoc = result;

    console.log('ACCESS MATRIX: Converted to JSON');

    next();

  } catch (error) {
    ERROR(res, error);
  }
};

const deleteAccessRights = async (req, res, next) => {

  try {

    const jsonDoc = req.jsonDoc;

    const sheetNames = Object.keys(jsonDoc);

    for (let i = 0; i < sheetNames.length; i++) {

      let sheetName = sheetNames[i];

      sheetName = sheetName.replace('&amp;', '&');

      // const groupId = _getGroupId(sheetName, req.roles);

      // if (groupId === 'camunda-admin') continue;

      // if (!groupId) continue;

      const groupList = await Group.getList({ name: sheetName });

      if (!groupList || groupList.length <= 0) continue;

      const group = groupList[0];

      if (!group || !group.id) continue;

      await Group.del(group.id);

      await _deleteAuthorizations(group.id);
    }

    console.log('ACCESS MATRIX: Deleted all access');

    next();

  } catch (error) {
    ERROR(res, error);
  }
};

const createAccessRights = async (req, res, next) => {

  try {

    const jsonDoc = req.jsonDoc;

    const sheetNames = Object.keys(jsonDoc);

    const groups = [];

    for (let i = 0; i < sheetNames.length; i++) {

      const sheetName = sheetNames[i];

      const roleName = sheetName.replace('&amp;', '&');

      if (sheetName === 'Tenants') {
        req.tenantSheetRow = jsonDoc[sheetName];
        continue;
      }

      const group = await _createGroup(roleName, req.roles);

      if (!group) continue;

      groups.push(group);

      const sheetRow = jsonDoc[sheetName];

      await _createAuthorization(sheetRow, group);
    }

    req.groups = groups;

    console.log('ACCESS MATRIX: Created all access');

    next();

  } catch (error) {
    ERROR(res, error);
  }
};

const bindUsers = async (req, res, next) => {
  try {

    const [err, users] = await to(AuthService.getCamundaUsers({ needAnonymousUsers: 1 }, req.headers));

    if (err) TE(err);

    if (!users) TE('Auth users not found in jump-cloud');

    req.users = users.users;

    console.log('ACCESS MATRIX: Bind jump cloud user to request');

    next();

  } catch (error) {

    ERROR(res, error);

  }
};

const bindRoles = async (req, res, next) => {

  try {

    const [err, roles] = await to(AuthService.getRoles(req.headers));

    if (err) TE(err);

    if (!roles) TE('Auth users not found in jump-cloud');

    req.roles = roles;

    console.log('ACCESS MATRIX: Bind all user role data');

    next();

  } catch (error) {

    ERROR(res, error);

  }
};

const deleteUsers = async (req, res, next) => {

  try {

    const users = req.users;

    for (let i = 0; i < users.length; i++) {

      const user = users[i];

      const { username } = user;

      await User.del(username);
    }

    console.log('ACCESS MATRIX: Deleted all users');

    next();

  } catch (error) {
    ERROR(res, error);
  }
};

const deleteTenants = async (req, res, next) => {

  try {

    const tenants = await Tenant.getList({});

    for (let i = 0; i < tenants.length; i++) {

      const tenant = tenants[i];

      await Tenant.del(tenant.id);
    }

    console.log('ACCESS MATRIX: Deleted all tenants');

    next();

  } catch (error) {
    ERROR(res, error);
  }
};

const createTenants = async (req, res, next) => {

  try {

    const tenantSheetRow = req.tenantSheetRow;

    const groups = req.groups;

    // console.log(tenantSheetRow, groups);

    const roleList = Object.keys(tenantSheetRow[0]).map(key => ({ key: key, value: tenantSheetRow[0][key] }));

    for (let i = 1; i < tenantSheetRow.length; i++) {

      const row = tenantSheetRow[i];

      await Tenant.create({
        id: row.A,
        name: row.B
      });

      for (let j = 2; j < roleList.length; j++) {
        const role = roleList[j];
        const group = groups.find(group => group.name === role.value);
        if (group && row[role.key] === 'YES') {
          await Tenant.createGroup(row.A, group.id);
        }
      }
    }

    console.log('ACCESS MATRIX: Created all tenants and connected with group');

    next();

  } catch (error) {
    ERROR(res, error);
  }
};

const createUsers = async (req, res) => {

  try {

    const users = req.users;

    const groups = req.groups;

    const newUsers = [];

    for (let i = 0; i < users.length; i++) {

      const user = users[i];

      const group = groups.find(group => group.name === user.role);

      const newUser = {
        profile: {
          id: user.username,
          firstName: user.firstname,
          lastName: user.lastname,
          email: user.email
        },
        credentials:
          { password: user.camundaPassword }
      };

      if (!group) {
        newUsers.push({ ...newUser, error: 'Group not found' });
        continue;
      }

      await User.create(newUser);

      await Group.Member.create(group.id, user.username);

      newUser.groups = [group.id];

      newUsers.push(newUser);
    }

    console.log('ACCESS MATRIX: Created all access');

    SUCCESS(res, CustomCodes.SUCCESS, users, req.requestId);

  } catch (error) {
    ERROR(res, error);
  }
};

const createAdminUsers = async (req, res) => {

  try {

    const profile = {
      id: 'Administrator',
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@gmail.com'
    };

    const credentials = {
      password: 'FDji0wRb08'
    };

    const groupId = 'camunda-admin';

    const user = {
      profile: profile,
      credentials: credentials
    };

    await User.create(user);

    await Group.Member.create(groupId, profile.id);

    user.groups = [groupId];

    SUCCESS(res, CustomCodes.SUCCESS, {
      profile: profile
    }, req.requestId);

  } catch (error) {
    ERROR(res, error);
  }
};

module.exports = {
  validateAccessMatrixFile,
  convertAccessFileToJson,
  bindUsers,
  bindRoles,
  deleteUsers,
  deleteAccessRights,
  deleteTenants,
  createAccessRights,
  createTenants,
  createUsers,
  createAdminUsers
};