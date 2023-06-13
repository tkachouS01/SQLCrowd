import authMiddleware from '../middleware/authMiddleware.js';
import usersRouter from './usersRouter.js'
import authRouter from './authRouter.js'
import roleRequestsRouter from "./roleRequestsRouter.js";
import modulesRouter from "./Modules/modulesRouter.js";
import ratingRouter from "./ratingRouter.js";
import Router from 'express'


const router = new Router()

router.use("/", authRouter)
router.use('/users', authMiddleware, usersRouter)
router.use('/rating', authMiddleware, ratingRouter)
router.use('/modules', authMiddleware, modulesRouter)

router.use('/role-requests', authMiddleware, roleRequestsRouter)

export default router;

