const Constants = require('../../../constants');

const MODULE_CODE = Constants.ModuleCodes.PROCESS_DEFINITIONS;

const _setCode = Constants.setCode('')(MODULE_CODE);

const CustomCodes = {
  SUCCESS: { ..._setCode(1, 200), message: 'ok' },
  // ERR_PROCESS_DEF_KEY_NOT_FOUND: { ..._setCode(1, 400), message: 'Process definition key not found!' },
};

module.exports = {
  CustomCodes,
  CoreConstants: Constants
};