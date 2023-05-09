import {consoleError, consoleMessage} from '../customMessageConsole.js'
import ApiError from '../error/ApiError.js';
import {Users} from '../models/models.js';
import fs from "fs";
import path from "path";

export default class UsersController {

    async getAll(req, res, next) {

        try {
            //const { limit, offset } = req.pagination;
            consoleMessage(`ПОЛУЧИТЬ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ`)
            const users = await Users.findAll({ /*limit, offset,*/
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
            const user = await Users.findOne({where: {_id: id}, attributes: {exclude: ['password', 'email', 'role']}});

            return user ? res.json(user) : next(ApiError.notFound(`Пользователь с id=${id} не найден`))
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async getAvatar(req, res, next) {

        const {id} = req.params;
        consoleMessage(`ПОЛУЧИТЬ АВАТАР С id=${id}`)

        // формируем путь к файлу картинки
        const imagePath = path.resolve('staticImages', `${id}.png`);

        // проверяем, существует ли файл картинки
        fs.exists(imagePath, exists => {
            if (exists) {
                // отправляем запрошенную картинку на клиент
                res.sendFile(imagePath);
            } else {
                // отправляем картинку по умолчанию на клиент
                const defaultImagePath = path.resolve('staticImages', 'default', 'default_1.png');
                res.sendFile(defaultImagePath);
            }
        });
    }
}