import { Tasks } from '../models/models.js'
import ApiError from '../error/ApiError.js';

export default async function checkTaskExists(req, res, next) {
    const { task_id } = req.params;

    if (!/^[1-9]\d*$/.test(task_id)) {
        return next(ApiError.badRequest(`Некорректное значение параметра taskid: ${task_id}`));
    }

    let task = await Tasks.findOne({ where: { _id: task_id } });

    if (task) {
        next();
    } else {
        return next(ApiError.notFound(`Задание №${task_id} не найдено`));
    }
};
