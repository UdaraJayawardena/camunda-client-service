const axios = require('../axios');

const { Config } = require('../../../../../config');

const { baseUrl } = Config.CAMUNDA;

const taskBaseURL = `${baseUrl}/job`;

const getList = async (params, auth) => {

  const url = `${taskBaseURL}`;

  const result = await axios.get(url, {
    params: params,
    auth: auth
  });

  return result;
};

const execute = async (jobId, auth) => {

  const result = await axios.post(`${taskBaseURL}/${jobId}/execute`, {}, { auth });

  return result;
};

const updateDueDate = async (jobId, data, auth) => {

  const result = await axios.put(`${taskBaseURL}/${jobId}/duedate`, data, { auth });

  return result;
};


module.exports = {

  getList,

  execute,

  updateDueDate

};
