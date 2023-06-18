import express from "express";
import ThemesController from "../../controllers/themesController.js";
import checkFullnessThemeMiddleware from "../../middleware/checkFullnessThemeMiddleware.js";
import checkModuleExists from "../../middleware/checkModuleExists.js";
import checkThemeExists from "../../middleware/checkThemeExists.js";
import testRouter from "./testRouter.js";
import tasksRouter from "./tasksRouter.js";

const themesRouter = new express.Router({mergeParams: true});
const themesController = new ThemesController();

themesRouter.param('themeId', checkThemeExists);

themesRouter.route('')
    .get(themesController.getAllThemes.bind(themesController))
    .post(checkModuleExists, themesController.addTheme.bind(themesController))

themesRouter.route('/:themeId')
    .get(themesController.getOneTheme.bind(themesController))
    .patch(themesController.updateTheme.bind(themesController));

themesRouter.route('/:themeId/make-available')
    .patch(checkFullnessThemeMiddleware, themesController.makeAvailableTheme.bind(themesController));

themesRouter.use('/:themeId/test', testRouter)
themesRouter.use('/:themeId/tasks', tasksRouter)

export default themesRouter;