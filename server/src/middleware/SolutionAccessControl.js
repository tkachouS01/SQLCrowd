import { Solution, Task } from '../models/models.js'
import ApiError from '../error/ApiError.js';

export default async function (req, res, next) {
    const taskId = req.params.taskId;
    const userId = req.user._id;

    let task = await Task.findOne({ where: { _id: taskId } })
    const userSolution = await Solution.findOne({where:{taskId, userId}});

    let solution = (task.userId===userId) || (await Solution.findOne({ where: { taskId: taskId, userId } })&&(task.verified && userSolution.verified===true)) || req.user.role==='ADMIN';

    if (!solution) {
        return next(ApiError.forbidden(`Вам не разрешено просматривать решения задачи №${taskId}`));
    }
    next();
};