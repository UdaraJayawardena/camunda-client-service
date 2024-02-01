const express = require('express');

const { Auth } = require('./services/auth');

const { AuthRoutes } = require('./modules/authorization');

const { ProcessDefinitionRoutes } = require('./modules/process-definitions');

const { DeploymentRoutes } = require('./modules/deployment');

const { GroupRoutes } = require('./modules/group');

const { TaskRoutes } = require('./modules/task');

const { UserRoutes } = require('./modules/user');

const { MigrationRoutes } = require('./modules/migration');

const { ProcessInstanceRoutes } = require('./modules/process-instance');

const { HistoryTaskRoutes } = require('./modules/history/task');

const { HistoryActivityInstanceRoutes } = require('./modules/history/activity-instance');

const { HistoryProcessInstanceRoutes } = require('./modules/history/process-instance');

const { HistoryVariableInstanceRoutes } = require('./modules/history/variable-instance');

const { JobRoutes } = require('./modules/job');

const router = express.Router();

const { initRoute } = require('../init');

const init = initRoute('Awesome :-), Camunda Rest API v1 is working properly');

router.get('/', init);

// Check is valid end point
router.use(Auth.isAuthorized);

router.use('/authorization', AuthRoutes);

router.use('/process-definitions', ProcessDefinitionRoutes);

router.use('/deployments', DeploymentRoutes);

router.use('/groups', GroupRoutes);

router.use('/tasks', TaskRoutes);

router.use('/users', UserRoutes);

router.use('/migrations', MigrationRoutes);

router.use('/process-instances', ProcessInstanceRoutes);

router.use('/history/tasks', HistoryTaskRoutes);

router.use('/history/activity-instances', HistoryActivityInstanceRoutes);

router.use('/history/process-instances', HistoryProcessInstanceRoutes);

router.use('/history/variable-instances', HistoryVariableInstanceRoutes);

router.use('/jobs', JobRoutes);

module.exports = router;
