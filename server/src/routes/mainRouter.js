import authMiddleware from '../middleware/authMiddleware.js';
import usersRouter from './usersRouter.js'
import tasksRouter from './Modules/tasksRouter.js'
import authRouter from './authRouter.js'
import roleRequestsRouter from "./roleRequestsRouter.js";

import Router from 'express'
import modulesRouter from "./Modules/modulesRouter.js";
import themesRouter from "./Modules/themesRouter.js";

const router = new Router()

router.use("/", authRouter)
router.use('/users', authMiddleware, usersRouter)


router.use('/modules', authMiddleware, modulesRouter)



router.use('/role-requests', authMiddleware, roleRequestsRouter)

export default router;

