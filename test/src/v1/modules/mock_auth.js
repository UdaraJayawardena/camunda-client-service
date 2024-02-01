/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
const request = require('supertest');

jest.mock('../../../../src/v1/auth/controller');

const { isAuthorized } = require('../../../../src/v1/auth/controller');

module.exports = mockAuth = () => {
  isAuthorized.mockImplementation((req, res, next) => next());
};