import UsersController from '../controllers/usersController.js';
const usersController = new UsersController();
import express from 'express';
const usersRouter = new express.Router();
usersRouter.route('/')
    .get(usersController.getAll.bind(usersController)); //+
usersRouter.route('/:id')
    .get(usersController.getOne.bind(usersController));
usersRouter.route('/image/:id')
    .get(usersController.getAvatar.bind(usersController));
export default usersRouter;