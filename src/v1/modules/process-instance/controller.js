const { ERROR, SUCCESS } = require('@src/helper');

const { CustomCodes } = require('./constants');

const { ProcessInstance } = require('../../services').EngineRest;

const getList = async (req, res) => {

  try {

    const response = await ProcessInstance.getList(req.query, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const modify = async (req, res) => {

  try {

    const { id } = req.params;

    const response = await ProcessInstance.modify(id, req.body, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const modifyVariable = async (req, res) => {

  try {

    const { id } = req.params;

    const response = await ProcessInstance.modifyVariable(id, req.body, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

module.exports = {
  getList,
  modify,
  modifyVariable
};