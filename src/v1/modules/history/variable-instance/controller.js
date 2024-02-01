const { ERROR, SUCCESS } = require('@src/helper');

const { CustomCodes } = require('./constants');

const { History } = require('../../../services').EngineRest;

const getVariableInstanceList = async (req, res) => {

  try {

    const response = await History.VariableInstance.getList(req.query, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

module.exports = {
  getVariableInstanceList,
};