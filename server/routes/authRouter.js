import express from 'express';
const authRouter = new express.Router();
import authMiddleware from '../middleware/authMiddleware.js';
import AuthController from '../controllers/authController.js';
const authController = new AuthController();


authRouter.route('/signup')
    //регистрация
    .post(authController.signUp.bind(authController)); //+

authRouter.route('/signin')
    //аутентификация
    .post(authController.signIn.bind(authController)); //+

authRouter.route('/auth')
    //полечение нового токена
    .get(authMiddleware, authController.check.bind(authController)); //+

export default authRouter;