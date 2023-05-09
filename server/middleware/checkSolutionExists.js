import { Solutions } from '../models/models.js'
import ApiError from '../error/ApiError.js';

export default async function (req, res, next) {
    const { solution_id } = req.params;

    if (!/^[1-9]\d*$/.test(solution_id)) {
        return next(ApiError.badRequest(`Некорректное значение параметра solution_id: ${solution_id}`));
    }

    let task = await Solutions.findOne({ where: { _id: solution_id } });

    if (task) {
        next();
    } else {
        return next(ApiError.notFound(`Решение №${solution_id} не найдено`));
    }
};