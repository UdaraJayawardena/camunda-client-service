const fs = require('fs');

const path = require('path');

const FormData = require('form-data');

const Service = require('./service');

const { Config } = require('../../../../../config');

const { IS_PROD } = Config.APPLICATION;

const { to } = require('../../../../helper');

const pathDiagrams = '../../../diagrams/BPMN';

let results = { errLog: [], ok: 0 };

const _getDirPath = (tenantId) => path.resolve(__dirname, pathDiagrams, tenantId);

const _getDeploymentSource = ({ tenantId }) => {
  switch (tenantId) {
    case 'LI': return 'LI_WORKFLOW';
    case 'CRM': return 'CRM_WORKFLOW';
    case 'LM': return 'LM_WORKFLOW';
    default: return '';
  }
};

const createFlow = async (results, dirPath, fileName, formData, auth) => {

  const { tenantId } = formData;

  const file = fs.createReadStream(`${dirPath}/${fileName}`);

  const deploymentName = fileName.split('.')[0];

  if (!deploymentName) {
    results.errLog.push(`Invalid file name, fileName=${fileName}`);
    return;
  }

  const form = new FormData();
  form.append('deployment-name', deploymentName);
  if (tenantId !== 'LI') form.append('tenant-id', tenantId);
  form.append('deployment-source', _getDeploymentSource(tenantId));
  form.append('file', file, fileName);

  const [err, result] = await to(Service.create(form, auth));

  if (err) results.errLog.push(err);

  if (!result) results.errLog.push('Result not found');

  if (result) results.ok++;
};

const create = async (dirPath, formData, auth) => {

  const { pathList, tenantId } = formData;

  if (!dirPath) dirPath = _getDirPath(tenantId);

  results = { errLog: [], ok: 0 };

  for (let i = 0; i < pathList.length; i++) {

    const { filePath, fileName } = pathList[i];

    if (filePath) {

      const subDirPath = `${dirPath}/${filePath}`;

      if (!IS_PROD && filePath === 'schedulers') {
        results.errLog.push('Schedulers only permission to production');
        continue;
      }

      await createFlow(results, subDirPath, fileName, formData, auth);

      continue;
    }

    await createFlow(results, dirPath, fileName, formData, auth);

  }

  return results;
};

const createList = async (dirPath, formData, auth) => {

  const { tenantId } = formData;

  if (!dirPath) dirPath = _getDirPath(tenantId);

  const files = fs.readdirSync(dirPath);

  results = { errLog: [], ok: 0 };

  for (let i = 0; i < files.length; i++) {

    const fileName = files[i];

    const subDirPath = `${dirPath}/${fileName}`;

    const isDirectory = fs.lstatSync(subDirPath).isDirectory();

    if (isDirectory) {

      const subFiles = fs.readdirSync(subDirPath);

      // if (IS_PROD && fileName === 'simulations') continue;

      if (!IS_PROD && fileName === 'schedulers') continue;

      for (let i = 0; i < subFiles.length; i++) {

        const subFile = subFiles[i];

        await createFlow(results, subDirPath, subFile, formData, auth);
      }

      continue;
    }

    await createFlow(results, dirPath, fileName, formData, auth);
  }

  return results;
};

module.exports = {

  create: create,

  createList: createList,
};