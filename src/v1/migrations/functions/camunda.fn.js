const { ProcessInstance } = require('../../services').EngineRest;

const { CAMUNDA } = require('../../../../config').Config;

const updateVariables = async ({
  searchDefinitionKey,
  searchVariableKey,
  searchVariableValue }, updateFunction) => {

  const procesListBv = await ProcessInstance.getList({
    processDefinitionKey: searchDefinitionKey,
    variables: `${searchVariableKey}_eq_${searchVariableValue}`,
  }, CAMUNDA.auth);

  console.log(`********** ${searchDefinitionKey}:START **********`);
  console.log(`Start to convert ${searchVariableKey}: ${searchVariableValue} to real value`);
  console.log('Process List Count: ' + procesListBv.length);

  for (let i = 0; i < procesListBv.length; i++) {
    const procesObj = procesListBv[i];
    await updateFunction(procesObj, {
      searchDefinitionKey,
      searchVariableKey,
      searchVariableValue
    }, procesListBv.length, i);
  }

  console.log(`********** ${searchDefinitionKey}:END **********`);
};

module.exports = {
  updateVariables
};