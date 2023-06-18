import {Module} from '../models/models.js'
import ApiError from '../error/ApiError.js';

export default async function checkModuleExists(req, res, next) {
    const {moduleId} = req.params;

    if (!/^[1-9]\d*$/.test(moduleId)) {
        return next(ApiError.badRequest(`Некорректное значение параметра moduleId: ${moduleId}`));
    }

    let module = await Module.findByPk(moduleId);

    if (module) {
        next();
    } else {
        return next(ApiError.notFound(`Модуль №${module} не найден`));
    }
};
