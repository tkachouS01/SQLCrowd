import {Theme} from '../models/models.js'
import ApiError from '../error/ApiError.js';

export default async function checkThemeExists(req, res, next) {
    const {themeId} = req.params;

    if (!/^[1-9]\d*$/.test(themeId)) {
        return next(ApiError.badRequest(`Некорректное значение параметра themeId: ${themeId}`));
    }

    let theme = await Theme.findByPk(themeId);

    if (theme) {
        next();
    } else {
        return next(ApiError.notFound(`Тема №${theme} не найдена`));
    }
};
