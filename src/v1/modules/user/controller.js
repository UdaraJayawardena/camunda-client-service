const { ERROR, SUCCESS } = require('@src/helper');

const Tracer = require('@src/tracer');

const { CustomCodes } = require('./constants');

const { User } = require('../../services').EngineRest;

const _getProfile = (data) => ({
  id: data.username || data.id,
  firstName: data.firstName || data.firstname,
  lastName: data.lastName || data.lastname,
  email: data.email
});

const createUser = async (req, res) => {

  try {

    const body = req.body;

    const userData = {
      profile: _getProfile(body),
      credentials: { password: body.password }
    };
    const response = await User.create(userData, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.span);
  }
  catch (error) {
    ERROR(res, error, req.span);
  }
};

const syncUsers = async (req, res) => {

  try {

    const users = req.users;

    const newUsers = [];

    for (let i = 0; i < users.length; i++) {

      const user = users[i];

      const profile = _getProfile(user);

      const newUser = {
        profile: profile,
        credentials: { password: user.camundaPassword }
      };

      const existsUsers = await User
        .getList({ id: user.username }, req.camundaAuth);

      if (existsUsers && existsUsers.length > 0) {

        await User.updateProfile(profile.id, profile, req.camundaAuth);
      } else {
        await User.create(newUser, req.camundaAuth);
      }

      newUsers.push(newUser.profile);
    }

    Tracer.createLog(req.span, 'completed', {
      method: 'syncUsers',
      component: 'user/controller'
    });

    SUCCESS(res, CustomCodes.SUCCESS, users, req.span);

  } catch (error) {
    ERROR(res, error, req.span);
  }
};

const deleteUser = async (req, res) => {
  
  try {

    const { id } = req.params;
    
    const response = await User.del(id, req.camundaAuth);
    
    SUCCESS(res, CustomCodes.SUCCESS, response, req.span);
  }
  catch (error) {
    ERROR(res, error, req.span);
  }
};

module.exports = {
  createUser,
  syncUsers,
  deleteUser
};