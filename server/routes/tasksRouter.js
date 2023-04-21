import express from 'express';
const tasksRouter = new express.Router();
import TasksController from '../controllers/tasksController.js';
import checkTaskExists from '../middleware/checkTaskExists.js'
import solutionsRouter from './solutionsRouter.js'
import taskAccessControl from '../middleware/TaskAccessControl.js'

const tasksController = new TasksController();

tasksRouter.param('task_id', checkTaskExists);

tasksRouter.use('/:task_id/solutions', solutionsRouter)
tasksRouter.route('/')
    //получение всех задач
    .get(tasksController.getAllTasks.bind(tasksController)) //+
    //создание новой задачи
    .post(tasksController.createTask.bind(tasksController)); //+

tasksRouter.route('/:task_id')
    //получение конкретной задачи
    .get(tasksController.getOneTask.bind(tasksController)) //+
    //обновление конкретной задачи
    .patch(taskAccessControl, tasksController.updateTask.bind(tasksController)); //+


export default tasksRouter;