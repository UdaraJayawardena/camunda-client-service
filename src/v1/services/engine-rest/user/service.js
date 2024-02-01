const axios = require('../axios');

const { Config } = require('../../../../../config');

const _auth = Config.CAMUNDA.auth;

const { baseUrl } = Config.CAMUNDA;

const userBaseURL = `${baseUrl}/user`;

const getList = async (params, auth) => {

  if (!auth) auth = _auth;

  const result = await axios
    .get(`${userBaseURL}`, { params: params, auth });

  return result;
};

const getListCount = async (params, auth) => {

  if (!auth) auth = _auth;

  const result = await axios
    .get(`${userBaseURL}/count`, { params: params, auth });

  return result;
};

const getProfile = async (id, auth) => {

  if (!auth) auth = _auth;

  const result = await axios
    .get(`${userBaseURL}/${id}/profile`, { auth });

  return result;
};

const create = async (data, auth) => {

  if (!auth) auth = _auth;

  const result = await axios
    .post(`${userBaseURL}/create`, data, { auth });

  return result;
};

const updateProfile = async (id, data, auth) => {

  if (!auth) auth = _auth;

  const result = await axios
    .put(`${userBaseURL}/${id}/profile`, {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
    }, { auth });

  return result;
};

const updateCredentials = async (id, data, auth) => {

  if (!auth) auth = _auth;

  const result = await axios
    .put(`${userBaseURL}/${id}/credentials`, {
      password: data.password,
      authenticatedUserPassword: data.authenticatedUserPassword
    }, { auth });

  return result;
};

const del = async (id, auth) => {

  if (!auth) auth = _auth;

  const result = await axios
    .del(`${userBaseURL}/${id}`, { auth });

  return result;
};

// const unlock = async (id) => {

//   const result = await axios
//     .post(`${userBaseURL}/${id}/unlock`, _auth);

//   return result;
// };

module.exports = {

  getList,

  getListCount,

  getProfile,

  create,

  updateProfile,

  updateCredentials,

  del,

  // unlock
};
