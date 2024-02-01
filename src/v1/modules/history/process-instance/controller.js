const { ERROR, SUCCESS } = require('@src/helper');

const { CustomCodes } = require('./constants');

const { History } = require('../../../services').EngineRest;

const getProcessInstanceList = async (req, res) => {

  try {

    const response = await History.ProcessInstance.getList(req.query, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const getProcessInstanceListCount = async (req, res) => {

  try {

    const response = await History.ProcessInstance.getListCount(req.query, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

module.exports = {
  getProcessInstanceList,
  getProcessInstanceListCount
};