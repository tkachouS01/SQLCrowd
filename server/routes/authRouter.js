import authMiddleware from '../middleware/authMiddleware.js';
import AuthController from '../controllers/authController.js';
const authController = new AuthController();

import express from 'express';
const authRouter = new express.Router();
authRouter.route('/signup')
    .post(authController.signUp.bind(authController)); //+
authRouter.route('/signin')
    .post(authController.signIn.bind(authController)); //+
authRouter.route('/auth')
    .get(authMiddleware, authController.check.bind(authController)); //+
export default authRouter;