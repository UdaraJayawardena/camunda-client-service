const axios = require('../axios');

const { Config } = require('../../../../../config');

const _auth = Config.CAMUNDA.auth;

const { baseUrl } = Config.CAMUNDA;

const taskBaseURL = `${baseUrl}/authorization`;

const get = async (id, auth) => {

  if (!auth) auth = _auth;

  const result = await axios
    .get(`${taskBaseURL}/${id}`, { auth });

  return result;
};

const getList = async (params, auth) => {

  if (!auth) auth = _auth;

  const result = await axios
    .get(`${taskBaseURL}`, {
      params: params,
      auth
    });

  return result;
};

const create = async (data, auth) => {

  if (!auth) auth = _auth;

  const result = await axios
    .post(`${taskBaseURL}/create`, data, { auth });

  return result;
};

const update = async (id, data, auth) => {

  if (!auth) auth = _auth;

  const result = await axios
    .put(`${taskBaseURL}/${id}`, data, { auth });

  return result;
};

const del = async (id, auth) => {

  if (!auth) auth = _auth;

  const result = await axios
    .del(`${taskBaseURL}/${id}`, { auth });

  return result;
};

module.exports = {

  get,

  getList,

  create,

  update,

  del
};
