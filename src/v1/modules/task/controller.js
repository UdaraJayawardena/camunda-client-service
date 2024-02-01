const { ERROR, SUCCESS, TE } = require('@src/helper');

const { CustomCodes } = require('./constants');

const { Task } = require('../../services').EngineRest;

const getTaskList = async (req, res) => {

  try {

    const response = await Task.getList(req.query, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const getTaskVariableList = async (req, res) => {

  try {

    const { taskId } = req.params;

    const response = await Task.Variables.getList(taskId, req.query, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const claimTask = async (req, res) => {

  try {

    if (!req.body.id) TE(CustomCodes.ERR_TASK_ID_NOT_FOUND);

    const response = await Task.claim(req.body, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response.data, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const completeTask = async (req, res) => {

  try {

    if (!req.body.id) TE(CustomCodes.ERR_TASK_ID_NOT_FOUND);

    const response = await Task.complete(req.body, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response.data, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const claimAndCompleteTask = async (req, res) => {

  try {

    if (!req.body.id) TE(CustomCodes.ERR_TASK_ID_NOT_FOUND);

    await Task.claim(req.body, req.camundaAuth);

    const response = await Task.complete(req.body, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response.data, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

module.exports = {
  getTaskList,
  getTaskVariableList,
  claimTask,
  completeTask,
  claimAndCompleteTask,
};