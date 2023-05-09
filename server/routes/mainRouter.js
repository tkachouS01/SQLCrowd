import authMiddleware from '../middleware/authMiddleware.js';
import usersRouter from './usersRouter.js'
import tasksRouter from './tasksRouter.js'
import authRouter from './authRouter.js'

import Router from 'express'
const router = new Router()

router.use('/', authRouter)
router.use('/users', authMiddleware, usersRouter)
router.use('/tasks', authMiddleware, tasksRouter)
export default router;