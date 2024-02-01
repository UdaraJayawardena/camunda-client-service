const { ERROR, SUCCESS, TE } = require('@src/helper');

const { CustomCodes } = require('./constants');

const { Deployment } = require('../../services').EngineRest;

const create = async (req, res) => {

  try {

    const response = await Deployment.create(null, req.body, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const createList = async (req, res) => {

  try {

    const { tenantId } = req.params;

    if (tenantId === 'ALL') TE('Blocked for security reason');

    const response = await Deployment.createList(null, {
      tenantId: tenantId
    }, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const redeploy = async (req, res) => {

  try {

    const { deploymentId } = req.params;

    const response = await Deployment.redeploy(deploymentId, req.body, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const del = async (req, res) => {

  try {

    const { idList } = req.body;

    const response = await Deployment.del(idList, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const deleteList = async (req, res) => {

  try {

    const { tenantId } = req.params;
    let tenantIdIn = '';
    if (tenantId !== 'ALL') tenantIdIn = tenantId;

    const response = await Deployment.deleteList({
      tenantIdIn: tenantIdIn
    }, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const getList = async (req, res) => {

  try {

    const response = await Deployment.getList(req.query, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const getListCount = async (req, res) => {

  try {

    const response = await Deployment.getListCount(req.query, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const getResourceList = async (req, res) => {

  try {

    const { deploymentId } = req.params;

    const response = await Deployment.getResources(deploymentId, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

module.exports = {
  create,
  createList,
  redeploy,
  del,
  deleteList,
  getList,
  getListCount,
  getResourceList
};