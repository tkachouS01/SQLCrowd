import {Task} from '../models/models.js'
import ApiError from '../error/ApiError.js';

export default async function (req, res, next) {
    const taskId = req.params.taskId;
    const userId = req.user._id;

    let isAuthor = await Task.findOne({where: {_id: taskId, userId}})

    if (isAuthor.userId !== userId) {
        return next(ApiError.forbidden(`Редактирование задачи №${taskId} запрещено, т.к. Вы не являетесь ее автором`));
    }
    next();
};