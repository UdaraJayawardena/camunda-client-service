const { ERROR, TE, to } = require('@src/helper');

const Tracer = require('@src/tracer');

const AuthService = require('@src/v1/services/auth/service');

const bindUsers = async (req, res, next) => {

  try {

    const [err, users] = await to(AuthService.getCamundaUsers(req.headers));

    if (err) TE(err);

    if (!users) TE('Auth users not found in jump-cloud');

    req.users = users.users;

    Tracer.createLog(req.span, 'completed', {
      method: 'bindUsers',
      component: 'middleware/auth-middleware'
    });

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

    Tracer.createLog(req.span, 'completed', {
      method: 'bindRoles',
      component: 'middleware/auth-middleware'
    });

    next();

  } catch (error) {

    ERROR(res, error);

  }
};

const bindPermissions = async (req, res, next) => {

  try {

    const [err, groupPermissions] = await to(AuthService
      .getGroupPermissions(req.headers));

    if (err) TE(err);

    if (!groupPermissions) TE('Auth users not found in jump-cloud');

    req.groupPermissions = groupPermissions;

    Tracer.createLog(req.span, 'completed', {
      method: 'bindPermissions',
      component: 'middleware/auth-middleware'
    });

    next();

  } catch (error) {

    ERROR(res, error);

  }
};

module.exports = {
  bindUsers,
  bindRoles,
  bindPermissions
};