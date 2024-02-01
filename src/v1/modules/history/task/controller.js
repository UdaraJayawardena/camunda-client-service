const { ERROR, SUCCESS } = require('@src/helper');

const { CustomCodes } = require('./constants');

const { History } = require('../../../services').EngineRest;

const _convertBoolean = (val) => val === 'true';

const getTaskList = async (req, res) => {

  try {

    if (!_convertBoolean(req.query.finished)) delete req.query.finished;
    if (!_convertBoolean(req.query.unfinished)) delete req.query.unfinished;
    if (!_convertBoolean(req.query.processFinished)) delete req.query.processFinished;
    if (!_convertBoolean(req.query.processUnfinished)) delete req.query.processUnfinished;

    const response = await History.Task.getList(req.query, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const getTaskListCount = async (req, res) => {

  try {

    if (!_convertBoolean(req.query.finished)) delete req.query.finished;
    if (!_convertBoolean(req.query.unfinished)) delete req.query.unfinished;
    if (!_convertBoolean(req.query.processFinished)) delete req.query.processFinished;
    if (!_convertBoolean(req.query.processUnfinished)) delete req.query.processUnfinished;

    const response = await History.Task.getListCount(req.query, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

module.exports = {
  getTaskList,
  getTaskListCount,
};