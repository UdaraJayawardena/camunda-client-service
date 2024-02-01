const { ERROR, SUCCESS, TE } = require('@src/helper');

const { CustomCodes } = require('./constants');

const { Job } = require('../../services').EngineRest;

const getJobList = async (req, res) => {

  try {

    const response = await Job.getList(req.query, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);

  }
  catch (error) {

    ERROR(res, error, req.requestId);
  }
};

const execute = async (req, res) => {

  try {

    if (!req.params.jobId) TE(CustomCodes.ERR_JOB_ID_NOT_FOUND);

    const response = await Job.execute(req.params.jobId, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);

  }
  catch (error) {

    ERROR(res, error, req.requestId);
  }
};

const updateDueDate = async (req, res) => {

  try {

    if (!req.params.jobId) TE(CustomCodes.ERR_JOB_ID_NOT_FOUND);
    if (!req.body.duedate) TE(CustomCodes.ERR_DUEDATE_NOT_FOUND);

    const dataObj = { duedate: req.body.duedate };

    const response = await Job.updateDueDate(req.params.jobId, dataObj, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);

  }
  catch (error) {

    ERROR(res, error, req.requestId);
  }
};


module.exports = {
  getJobList,
  execute,
  updateDueDate

};
