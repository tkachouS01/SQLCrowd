import ApiError from '../error/ApiError.js';
import {User} from '../models/models.js';
import fs from "fs";
import path from "path";
import {consoleError} from "../customMessageConsole.js";
import sharp from "sharp";
import {unknownUser} from "./solutionsController.js";

export default class UsersController {

    async getAll(req, res, next) {

        try {
            const users = await User.findAll({
                order: [['_id', 'ASC']],
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

            if (!/^[0-9]\d*$/.test(id)) {
                return next(ApiError.badRequest(`Некорректное значение id: ${id}`));
            }
            if(id==0) {
                return res.json(unknownUser)
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
    async addAvatar(req, res, next) {
        const { id } = req.params;
        const imagePath = path.resolve('src/staticImages', `${id}.png`);

        try {
            // Проверка наличия файла изображения
            await fs.promises.access(imagePath, fs.constants.F_OK);
            // Удаление существующего файла изображения
            await fs.promises.unlink(imagePath);
        } catch (err) {
            // Файл изображения не существует
        }

        const file = req.file;
        if (!file) {
            return res.json({});
        }

        try {
            // Изменение размера и сохранение нового файла изображения
            await sharp(file.path)
                .resize(200, 200)
                .toFile(imagePath);

            // Удаление временного файла
            await fs.promises.unlink(file.path);

            return res.json({});
        } catch (err) {
            return next(ApiError.serverError("Ошибка при обработке файла"));
        }
    }





}