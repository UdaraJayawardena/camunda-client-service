const axios = require('../../axios');

const { Config } = require('../../../../../../config');

const { baseUrl } = Config.CAMUNDA;

const taskBaseURL = `${baseUrl}/history/task`;

const getList = async (params, auth) => {

  const url = `${taskBaseURL}`;

  const result = await axios.get(url, {
    params: params,
    auth
  });

  return result;
};

const getListCount = async (params, auth) => {

  const url = `${taskBaseURL}/count`;

  const result = await axios.get(url, {
    params: params,
    auth
  });

  return result;
};

module.exports = {

  getList,
  getListCount,
};
