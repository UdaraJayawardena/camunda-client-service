const axios = require('../axios');

const { Config } = require('../../../../../config');

const { baseUrl } = Config.CAMUNDA;

const pIBaseUrl = `${baseUrl}/process-instance`;

const get = () => {
  //
};

const getList = async (params, auth) => {

  const url = `${pIBaseUrl}`;

  const result = await axios.get(url, {
    params: params,
    auth
  });

  return result;
};

const modify = async (id, body, auth) => {

  const result = await axios
    .post(`${pIBaseUrl}/${id}/modification`, body, {
      auth
    });

  return result;
};

module.exports = {
  get,
  getList,
  modify
};
