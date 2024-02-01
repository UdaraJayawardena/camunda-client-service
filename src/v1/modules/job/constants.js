const Constants = require('../../../constants');

const MODULE_CODE = Constants.ModuleCodes.PROCESS_DEFINITIONS;

const _setCode = Constants.setCode('')(MODULE_CODE);

const CustomCodes = {
  SUCCESS: { ..._setCode(1, 200), message: 'ok' },
  ERR_JOB_ID_NOT_FOUND: { ..._setCode(1, 400), message: 'Job ID not found!' },
  ERR_DUEDATE_NOT_FOUND: { ..._setCode(2, 400), message: 'Due date not found!' },

};

module.exports = {
  CustomCodes,
  CoreConstants: Constants
};