import express from "express";
import ModulesController from "../../controllers/modulesController.js";
import themesRouter from "./themesRouter.js";

const modulesRouter = new express.Router({mergeParams: true});
const modulesController = new ModulesController();

modulesRouter.route('')
    .get(modulesController.getAllModules.bind(modulesController))
    .post(modulesController.addModule.bind(modulesController))

modulesRouter.route('/:moduleId')
    .patch(modulesController.updateModule.bind(modulesController));

modulesRouter.route('/:moduleId/make-available')
    .patch(modulesController.makeAvailableModule.bind(modulesController));

modulesRouter.use('/:moduleId/themes', themesRouter)

export default modulesRouter;
