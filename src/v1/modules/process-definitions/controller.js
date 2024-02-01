const { ERROR, SUCCESS, TE } = require('@src/helper');

const { CustomCodes } = require('./constants');

const StatusList = require('./status-list');

const { ProcessDefinition } = require('../../services').EngineRest;

const fs = require('fs');

const path = require('path');

const convert = require('xml-js');

const _objConvertToArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

// const _isIgnoredSequence = (id) => {
//   // if the ignored task is the active task it will not be ignored
//   if (!id) return true;
//   return id.match(/ING0102/) ? true : false;
// };

const _getFilePath = (tenantId, resource) => {

  const dirPath = path.resolve(__dirname, `../../diagrams/BPMN/${tenantId}`);

  const files = fs.readdirSync(dirPath);

  const mainPath = `${dirPath}/${resource}`;

  const isExists = fs.existsSync(mainPath);

  if (isExists) return mainPath;

  let filePath = '';

  for (let i = 0; i < files.length; i++) {

    const fileName = files[i];

    const subDirPath = `${dirPath}/${fileName}`;

    const isDirectory = fs.lstatSync(subDirPath).isDirectory();

    const subPath = `${subDirPath}/${resource}`;

    const isExists = fs.existsSync(subPath);

    if (isDirectory && isExists) {
      filePath = subPath;
      break;
    }
  }

  return filePath;
};

const _readResource = ({ tenantId, resource }) => {

  if (!tenantId) tenantId = 'LI';

  const filePath = _getFilePath(tenantId, resource);

  if (!filePath) return {};

  const approveDD = fs.readFileSync(filePath, { encoding: 'utf8' });

  const result = convert.xml2json(approveDD, {
    compact: true,
    elementNameFn: function (val) {
      val = val.replace('bpmn:', '');
      return val;
    },
    attributeNameFn: function (val) {
      val = val.replace('camunda:', '');
      return val;
    }
  });

  const bpmnJson = JSON.parse(result);

  const resourceObj = bpmnJson['definitions']['process'];

  return resourceObj;
};

const _mapBoundarySequenceFlow = (sequenceFlow, boundaryEvent, boundaryEventList, allEventList) => {

  let lastElement = sequenceFlow
    .find(sequence => sequence.id === boundaryEvent._attributes.id);

  let finalSequenceFlowList = [lastElement];

  while (lastElement) {

    let nextElement = null;

    if (lastElement.outgoing) {

      nextElement = sequenceFlow
        .find(sequence => sequence.id === lastElement._attributes.id);

    } else {

      nextElement = sequenceFlow
        .find(sequence => sequence.id === lastElement.targetRef[0]);
    }

    if (nextElement) {
      finalSequenceFlowList.push(nextElement);
    } else {

      const foundBoundaryEve = boundaryEventList.find(be => be._attributes.attachedToRef === lastElement.targetRef[0]);

      if (foundBoundaryEve) {
        nextElement = sequenceFlow
          .find(sequence => sequence.id === foundBoundaryEve._attributes.id);

        finalSequenceFlowList.push(nextElement);
      }
    }

    lastElement = nextElement;
  }

  const finalEve = finalSequenceFlowList[finalSequenceFlowList.length - 1];

  const endEvent = allEventList
    .filter(eve => eve._attributes.id === finalEve.targetRef[0])
    .map(eve => {
      return {
        id: eve._attributes.id,
        name: eve._attributes.name,
        targetRef: []
      };
    }).find(eve => eve.id === finalEve.targetRef[0]);

  if (endEvent) {
    finalSequenceFlowList.push(endEvent);
  }

  finalSequenceFlowList = finalSequenceFlowList
    .map((flow, index) => {
      flow.index = index + 1;
      return Object.assign({}, flow);
    });

  return finalSequenceFlowList;
};

const _mapSequenceFlow = (sequenceFlow, finalSequenceFlowList, boundaryEvent, allEventList) => {

  console.log(boundaryEvent);

  const lengthOfFinalSeq = finalSequenceFlowList.length;

  let lastElement = finalSequenceFlowList[lengthOfFinalSeq - 1];

  while (lastElement) {

    let nextElement = null;

    if (lastElement.id.includes('Gateway')) {
      const nextElements = sequenceFlow
        .filter(sequence => sequence.id === lastElement.id);

      if (nextElements.length > 1) {
        const subSequenceFlowList = [];
        for (let i = 0; i < nextElements.length; i++) {
          nextElement = nextElements[i];
          let isDo = nextElement.id.includes('Gateway');

          while (isDo) {
            nextElement = sequenceFlow
              .find(sequence => sequence.id === nextElement.targetRef[0]);
            if (nextElement) {
              isDo = !nextElement.id.includes('Gateway');
              if (isDo) subSequenceFlowList.push(nextElement);
            } else {
              isDo = false;
            }
          }
        }

        nextElements.map(ele => {
          if (!lastElement.targetRef.includes(ele.targetRef[0])) {
            lastElement.targetRef.push(ele.targetRef[0]);
          }
        });

        finalSequenceFlowList.push(...subSequenceFlowList);
      } else {

        nextElement = sequenceFlow
          .find(sequence => sequence.id === lastElement.targetRef[0]);
      }

    } else {

      nextElement = sequenceFlow
        .find(sequence => sequence.id === lastElement.targetRef[0]);
    }

    if (nextElement) {
      const foundBoundaryEveList = boundaryEvent.filter(be => be._attributes.attachedToRef === nextElement.id);

      for (let i = 0; i < foundBoundaryEveList.length; i++) {
        const foundBoundaryEve = foundBoundaryEveList[i];
        if (foundBoundaryEve) {
          nextElement.targetRef.push(foundBoundaryEve._attributes.id);
          const boundaryFlow = _mapBoundarySequenceFlow(sequenceFlow, foundBoundaryEve, boundaryEvent, allEventList);
          nextElement.boundaryFlows.push(boundaryFlow);
        }
      }

      finalSequenceFlowList.push(nextElement);
    } else {

      const endEvent = allEventList
        .find(event => event._attributes.id === lastElement.targetRef[0]);

      const endSequence = {
        boundaryFlows: [],
        id: endEvent._attributes.id,
        name: endEvent._attributes.name,
        targetRef: []
      };

      finalSequenceFlowList.push(endSequence);

      sequenceFlow.push(endSequence);
    }

    lastElement = nextElement;
  }

  finalSequenceFlowList = finalSequenceFlowList
    .map((flow, index) => {
      flow.index = index + 1;

      flow.targetRef = Object.assign([], flow.targetRef
        .map(refId => {
          const refSeq = sequenceFlow.find(sequence => sequence.id === refId);
          if (refSeq) {
            return {
              boundaryEvent: [],
              id: refSeq.id,
              name: refSeq.name,
              targetRef: [],
            };
          }
          return undefined;
        })
        .filter(sequence => sequence != undefined));
      return flow;
    });

  return finalSequenceFlowList;
};

const getDefinitionsList = async (req, res) => {

  try {

    const response = await ProcessDefinition.getList(req.query, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const getDefinitionsResourceStatistics = async (req, res) => {

  try {

    const processObj = _readResource(req.params);

    const mapResult = {
      ...processObj._attributes
    };

    Object.keys(processObj).forEach(key => {
      if (key !== '_attributes') {
        mapResult[key] = Array.isArray(processObj[key]) ? processObj[key] : [processObj[key]];
        mapResult[key] = mapResult[key].map(data => ({ ...data._attributes }));
      }
    });

    SUCCESS(res, CustomCodes.SUCCESS, mapResult, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const getDefinitionsResourceSequenceFlow = async (req, res) => {

  try {

    const processObj = _readResource(req.params);

    const isHaveProcessObj = Object.keys(processObj).length > 0;

    if (!isHaveProcessObj) {
      SUCCESS(res, CustomCodes.SUCCESS, [], req.requestId);
      return;
    }

    const allEventList = [
      ..._objConvertToArray(processObj.startEvent),
      ..._objConvertToArray(processObj.callActivity),
      ..._objConvertToArray(processObj.endEvent),
      ..._objConvertToArray(processObj.exclusiveGateway),
      ..._objConvertToArray(processObj.scriptTask),
      ..._objConvertToArray(processObj.serviceTask),
      ..._objConvertToArray(processObj.task),
      ..._objConvertToArray(processObj.userTask)
    ];

    const boundaryEvent = _objConvertToArray(processObj.boundaryEvent);

    const sequenceFlow = processObj.sequenceFlow.map((sequence) => {
      const attributes = sequence._attributes;
      const eventObj = allEventList
        .find(event => event._attributes.id === attributes.sourceRef);
      return {
        id: attributes.sourceRef,
        name: eventObj ? eventObj._attributes.name : '',
        targetRef: [attributes.targetRef],
        boundaryFlows: []
      };
    });

    let finalSequenceFlowList = [sequenceFlow[0]];

    finalSequenceFlowList = _mapSequenceFlow(
      sequenceFlow,
      finalSequenceFlowList,
      boundaryEvent,
      allEventList);

    SUCCESS(res, CustomCodes.SUCCESS, finalSequenceFlowList, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const getStatusList = async (req, res) => {

  try {

    SUCCESS(res, CustomCodes.SUCCESS, StatusList, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const startInstanceById = async (req, res) => {

  try {

    const { id } = req.params;

    if (!id) TE(CustomCodes.ERR_PROCESS_DEF_KEY_NOT_FOUND);
    if (!req.body.businessKey) TE(CustomCodes.ERR_PROCESS_DEF_KEY_NOT_FOUND);

    const response = await ProcessDefinition.StartInstants.startById(id, req.body, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const startInstanceByKey = async (req, res) => {

  try {

    const { key } = req.params;

    if (!key) TE(CustomCodes.ERR_PROCESS_DEF_KEY_NOT_FOUND);
    if (!req.body.businessKey) TE(CustomCodes.ERR_PROCESS_DEF_KEY_NOT_FOUND);

    const response = await ProcessDefinition.StartInstants.startByKey(key, req.body, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  }
  catch (error) {
    ERROR(res, error, req.requestId);
  }
};

const startInstanceByKeyForTenant = async (req, res) => {

  try {

    const { key, tenantId } = req.params;

    if (!key) TE(CustomCodes.ERR_PROCESS_DEF_KEY_NOT_FOUND);
    if (!req.body.tenantId) TE(CustomCodes.ERR_TENANT_ID_NOT_FOUND);

    const response = await ProcessDefinition.StartInstants.startByKeyForTenant(key, tenantId, req.body, req.camundaAuth);

    SUCCESS(res, CustomCodes.SUCCESS, response, req.requestId);
  } catch (error) {

    ERROR(res, error, req.requestId);
  }
};


module.exports = {
  getDefinitionsList,
  getDefinitionsResourceStatistics,
  getDefinitionsResourceSequenceFlow,
  getStatusList,
  startInstanceById,
  startInstanceByKey,
  startInstanceByKeyForTenant,
};