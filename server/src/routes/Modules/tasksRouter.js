import TasksController from '../../controllers/tasksController.js';
import checkTaskExists from '../../middleware/checkTaskExists.js'
import solutionsRouter from './solutionsRouter.js'
import taskAccessControl from '../../middleware/TaskAccessControl.js'
import express from 'express';
const tasksRouter = new express.Router({ mergeParams: true });
const tasksController = new TasksController();

tasksRouter.param('taskId', checkTaskExists);

tasksRouter.route('/update-in-bank')
    .patch(tasksController.updateInBankTasks.bind(tasksController));

tasksRouter.route('')
    .get(tasksController.getAllTasks.bind(tasksController))
    .post(tasksController.createTask.bind(tasksController));
tasksRouter.route('/:taskId')
    .get(tasksController.getOneTask.bind(tasksController))
    .patch(taskAccessControl, tasksController.updateTask.bind(tasksController));

tasksRouter.route('/:taskId/add-rating')
    .post(tasksController.addTaskRating.bind(tasksController));




tasksRouter.use('/:taskId/solutions', solutionsRouter)
export default tasksRouter;