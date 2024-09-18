const express = require('express');
const superAdminController = require('../../controllers/superAdminController');
const superAdminRouter = express.Router();

superAdminRouter.post(
    '/login',
    superAdminController.superAdminLoginController
)

module.exports = superAdminRouter;