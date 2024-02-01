const axios = require('axios');
jest.mock('axios');

const isAuthorized = async () => {

  axios.default.post.mockImplementationOnce(
    () => Promise.resolve(
      {
        data: {
          data: {
            hasAuthorize: true
          }
        }
      }));
};

module.exports = {
  isAuthorized
};