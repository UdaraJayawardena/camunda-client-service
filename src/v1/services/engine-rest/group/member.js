const axios = require('../axios');

const { Config } = require('../../../../../config');

const _auth = Config.CAMUNDA.auth;

const { baseUrl } = Config.CAMUNDA;

const taskBaseURL = `${baseUrl}/group`;

const create = async (id, userId, auth) => {

  if (!auth) auth = _auth;

  const result = await axios
    .put(`${taskBaseURL}/${id}/members/${userId}`, {}, { auth });

  return result;
};

const del = async (id, userId, auth) => {

  if (!auth) auth = _auth;

  const result = await axios
    .del(`${taskBaseURL}/${id}/members/${userId}`, { auth });

  return result;
};

module.exports = {

  create,

  del
};
