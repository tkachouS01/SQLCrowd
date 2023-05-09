import TasksController from '../controllers/tasksController.js';
import checkTaskExists from '../middleware/checkTaskExists.js'
import solutionsRouter from './solutionsRouter.js'
import taskAccessControl from '../middleware/TaskAccessControl.js'
import express from 'express';
const tasksRouter = new express.Router();
const tasksController = new TasksController();
tasksRouter.param('task_id', checkTaskExists);
tasksRouter.use('/:task_id/solutions', solutionsRouter)
tasksRouter.route('/')
    .get(tasksController.getAllTasks.bind(tasksController)) //+
    .post(tasksController.createTask.bind(tasksController)); //+
tasksRouter.route('/:task_id')
    .get(tasksController.getOneTask.bind(tasksController)) //+
    .patch(taskAccessControl, tasksController.updateTask.bind(tasksController)); //+
export default tasksRouter;