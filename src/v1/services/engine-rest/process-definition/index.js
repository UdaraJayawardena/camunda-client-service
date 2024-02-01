const service = require('./service');

const start = require('./start');

module.exports = {

  ...service,

  StartInstants: start
};