/*
GET / users: получение списка всех пользователей
GET / users /: id: получение информации об одном пользователе
GET / users /: id / tasks: получение списка задач, созданных пользователем
GET / users /: id / solutions: получение списка задач, решенных пользователем
*/
import express from 'express';
const usersRouter = new express.Router();
import UsersController from '../controllers/usersController.js';


const usersController = new UsersController();

usersRouter.route('/')
    .get(usersController.getAll.bind(usersController)); //+

usersRouter.route('/:id')
    .get(usersController.getOne.bind(usersController)); //-

export default usersRouter;