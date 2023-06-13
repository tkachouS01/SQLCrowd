import { Solution, Task } from '../models/models.js'
import ApiError from '../error/ApiError.js';

export default async function (req, res, next) {
    const taskId = req.params.taskId;
    const userId = req.user._id;

    let task = await Task.findOne({ where: { _id: taskId } })
    const userSolution = await Solution.findOne({where:{taskId, userId}});
if(!userSolution && req.user.role==='USER') {
    return next(ApiError.forbidden(`Вам не разрешено просматривать решения задачи №${taskId}`));
}
    let solution = task.userId===userId || req.user.role==='ADMIN' || userSolution.verified || userSolution.finished;

    if (!solution) {
        return next(ApiError.forbidden(`Вам не разрешено просматривать решения задачи №${taskId}`));
    }
    next();
};