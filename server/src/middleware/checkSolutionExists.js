import {Solution} from '../models/models.js'
import ApiError from '../error/ApiError.js';

export default async function (req, res, next) {
    const solutionId = req.params.solutionId;

    if (!/^[1-9]\d*$/.test(solutionId)) {
        return next(ApiError.badRequest(`Некорректное значение параметра solutionId: ${solutionId}`));
    }

    let task = await Solution.findOne({where: {_id: solutionId}});

    if (task) {
        next();
    } else {
        return next(ApiError.notFound(`Решение №${solutionId} не найдено`));
    }
};