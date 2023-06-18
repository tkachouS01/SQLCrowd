import UsersController from '../controllers/usersController.js';

const usersController = new UsersController();
import express from 'express';

const usersRouter = new express.Router();

import multer from 'multer';

const upload = multer({dest: 'src/staticImages'});
usersRouter.route('/image/:id')
    .get(usersController.getImage.bind(usersController))
    .post(upload.single('profilePicture'), usersController.addImage.bind(usersController));
usersRouter.route('/')
    .get(usersController.getAllUsers.bind(usersController));
usersRouter.route('/:id')
    .get(usersController.getOneUser.bind(usersController));

export default usersRouter;