const { ProcessInstance } = require('../../services').EngineRest;

const { CAMUNDA } = require('../../../../config').Config;

const { updateVariables } = require('../functions/camunda.fn');

const _auth = CAMUNDA.auth;

const _getLegalName = async (processId) => {

  const varSeachParams = {
    deserializeValue: false,
    id: processId,
    varName: 'updateCustomer'
  };

  const varible = await ProcessInstance.getVariable(varSeachParams, _auth);

  const updateCustomer = JSON.parse(varible.value);

  const legalName = updateCustomer.legalName;

  return legalName;
};

const _update = async (process, searchParams, processLength, procesIndex) => {

  const count = `(${procesIndex + 1}/${processLength})`;

  const { id, businessKey } = process;

  try {

    const { searchVariableValue } = searchParams;

    const processId = process.id;

    const legalName = await _getLegalName(id);

    const modificationData = {
      modifications: {
        customerLegalName: {
          value: legalName,
          type: 'String'
        }
      }
    };

    if (legalName) {
      await ProcessInstance.modifyVariable(processId, modificationData, _auth);

      console.log(`Updated | ${count} | ${businessKey} | customerLegalName | ${searchVariableValue} to ${legalName}`);
    } else {
      console.log(`Updated Error | ${count} | ${businessKey} | customerLegalName | ${searchVariableValue} to ${legalName}`);
    }
  } catch (error) {
    console.error(error);
    console.log(`Updated Error | ${count} | ${businessKey}`);
  }
};

module.exports.up = async function (name, fn) {

  try {

    const legalNameList = ['eenmanszaak', 'bv', 'vof'];

    for (let i = 0; i < legalNameList.length; i++) {

      const legalName = legalNameList[i];

      const searchData = {
        searchDefinitionKey: 'contract-management',
        searchVariableKey: 'customerLegalName',
        searchVariableValue: legalName
      };

      await updateVariables(searchData, _update);
    }

    console.info(`success migrate-up: ${name} `);

    fn();
  } catch (error) {
    console.error(`error migrate-up: ${name} `);
    console.log(error);
    fn();
  }
};

module.exports.down = async function (name, fn) {
  try {

    //

    console.info(`success migrate-down: ${name} `);
    fn();
  } catch (error) {
    console.error(`error migrate-down: ${name} `);
    console.log(error);
    fn();
  }
};
