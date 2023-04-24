import {consoleMessage} from '../customMessageConsole.js'
import ApiError from '../error/ApiError.js';
import {User} from '../models/models.js';

export default class UsersController {

    async getAll(req, res, next) {

        try {
            //const { limit, offset } = req.pagination;
            consoleMessage(`ПОЛУЧИТЬ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ`)
            const users = await User.findAll({ /*limit, offset,*/
                attributes: {exclude: ['password', 'email', 'role']}
            });
            return users.length ? res.json(users) : next(ApiError.notFound('Пользователи не найдены'));
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params;
            consoleMessage(`ПОЛУЧИТЬ ПОЛЬЗОВАТЕЛЯ С id=${id}`)

            if (!/^[1-9]\d*$/.test(id)) {
                return next(ApiError.badRequest(`Некорректное значение id: ${id}`));
            }
            const user = await User.findOne({where: {id}, attributes: {exclude: ['password', 'email', 'role']}});

            return user ? res.json(user) : next(ApiError.notFound(`Пользователь с id=${id} не найден`))
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }
}