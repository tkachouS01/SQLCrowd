import ApiError from '../error/ApiError.js';
import {User} from '../models/models.js';
import fs from "fs";
import path from "path";

export default class UsersController {

    async getAll(req, res, next) {

        try {
            const users = await User.findAll({ /*limit, offset,*/
                attributes: {exclude: ['password', 'email']}
            });
            return res.json(users)
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params;

            if (!/^[1-9]\d*$/.test(id)) {
                return next(ApiError.badRequest(`Некорректное значение id: ${id}`));
            }
            const user = await User.findOne({
                where: {_id: id},
                attributes: {exclude: ['password']}
            });

            return user ? res.json(user) : next(ApiError.notFound(`Пользователь с id=${id} не найден`))
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async getAvatar(req, res, next) {

        const {id} = req.params;

        // формируем путь к файлу картинки
        const imagePath = path.resolve('src/staticImages', `${id}.png`);

        // проверяем, существует ли файл картинки
        fs.exists(imagePath, exists => {
            if (exists) {
                // отправляем запрошенную картинку на клиент
                res.sendFile(imagePath);
            }
            else {
                // отправляем картинку по умолчанию на клиент
                const defaultImagePath = path.resolve('src/staticImages', 'default', 'default_1.png');
                res.sendFile(defaultImagePath);
            }
        });
    }
}