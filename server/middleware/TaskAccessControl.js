import { Solution, Task } from '../models/models.js'
import ApiError from '../error/ApiError.js';

export default async function (req, res, next) {
    const { task_id } = req.params;
    const userId = req.user.id;

    let isAuthor = await Task.findOne({ where: { id: task_id, userId } })

    if (isAuthor.userId != userId) {
        return next(ApiError.forbidden(`Редактирование задачи №${task_id} запрещено, т.к. Вы не являетесь ее автором`));
    }
    next();
};