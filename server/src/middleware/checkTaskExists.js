import {Task} from '../models/models.js'
import ApiError from '../error/ApiError.js';

export default async function checkTaskExists(req, res, next) {
    const {taskId} = req.params;

    if (!/^[1-9]\d*$/.test(taskId)) {
        return next(ApiError.badRequest(`Некорректное значение параметра taskId: ${taskId}`));
    }

    let task = await Task.findOne({where: {_id: taskId}});

    if (task) {
        next();
    } else {
        return next(ApiError.notFound(`Задание №${taskId} не найдено`));
    }
};
