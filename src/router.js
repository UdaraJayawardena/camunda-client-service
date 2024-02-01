const express = require('express');

const router = express.Router();

const V1Router = require('./v1/router');

const { initRoute, initSpan, _404, _500 } = require('./init');

const init = initRoute('Awesome :-), Camunda Rest API is working properly');

// Check route
router.route('/').get(init);

// create span
router.use(initSpan);

// /v1
router.use('/v1', V1Router);

// 404 - Route not found
router.use(_404);

// 500 - Any server error
router.use(_500);

module.exports = router;
