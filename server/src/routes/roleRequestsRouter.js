import express from 'express';

import RoleRequestsController from "../controllers/roleRequestsController.js";
import CheckAdminMiddleware from "../middleware/CheckAdminMiddleware.js";

const roleRequestsRouter = new express.Router();
const roleRequestsController = new RoleRequestsController();

roleRequestsRouter.route('')
    .get(roleRequestsController.getAllRequests.bind(roleRequestsController))
    .post(roleRequestsController.addRequest.bind(roleRequestsController))
    .patch(CheckAdminMiddleware, roleRequestsController.addRole.bind(roleRequestsController));

export default roleRequestsRouter;