const { ERROR, SUCCESS } = require('@src/helper');

const { CustomCodes } = require('./constants');

const { History } = require('../../../services').EngineRest;

const getActivityInstanceList = async (req, res) => {

  try {

    const response = await History.ActivityInstance.getList(req.query, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

module.exports = {
  getActivityInstanceList,
};