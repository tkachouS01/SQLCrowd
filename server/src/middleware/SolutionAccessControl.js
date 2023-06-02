import { Solution, Task } from '../models/models.js'
import ApiError from '../error/ApiError.js';

export default async function (req, res, next) {
    const { task_id } = req.params;
    const userId = req.user._id;

    let task = await Task.findOne({ where: { _id: task_id } })
    let solution = (task.userId===userId) || (await Solution.findOne({ where: { taskId: task_id, userId } })&&(task.verified));

    if (!solution) {
        return next(ApiError.forbidden(`Вам не разрешено просматривать решения задачи №${task_id}`));
    }
    next();
};