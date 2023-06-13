import UsersController from '../controllers/usersController.js';
const usersController = new UsersController();
import express from 'express';
const usersRouter = new express.Router();

import multer from 'multer';
const upload = multer({ dest: 'src/staticImages' });
usersRouter.route('/image/:id')
    .get(usersController.getAvatar.bind(usersController))
    .post(upload.single('profilePicture'), usersController.addAvatar.bind(usersController));

usersRouter.route('/')
    .get(usersController.getAll.bind(usersController));
usersRouter.route('/:id')
    .get(usersController.getOne.bind(usersController));

export default usersRouter;