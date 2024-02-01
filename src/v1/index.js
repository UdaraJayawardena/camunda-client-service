const swaggerJSDoc = require('swagger-jsdoc');

const swaggerUi = require('swagger-ui-express');

const { Config } = require('../../config');

const { DEFINITION } = Config.SWAGGER;

const options = {
  swaggerDefinition: DEFINITION('v1'),
  apis: [
    './src/v1/modules/**/**/swagger/*.yaml',
    './src/v1/swagger/*.yaml'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

const getAPIJson = (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  res.send(swaggerSpec);
};

module.exports = (app) => {

  app.get('/v1/swagger.json', getAPIJson);

  app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};