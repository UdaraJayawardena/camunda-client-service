const axios = require('../axios');

const { Config } = require('../../../../../config');

const { baseUrl } = Config.CAMUNDA;

const taskBaseURL = `${baseUrl}/process-definition`;

const getList = async (params, auth) => {

  const result = await axios
    .get(`${taskBaseURL}`, {
      params: params,
      auth
    });

  return result;
};

const getListCount = async (params, auth) => {

  const result = await axios
    .get(`${taskBaseURL}/count`, {
      params: params,
      auth
    });

  return result;
};

module.exports = {

  getList,

  getListCount
};
