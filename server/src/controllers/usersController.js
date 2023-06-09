import ApiError from '../error/ApiError.js';
import {User} from '../models/models.js';
import fs from "fs";
import path from "path";
import sharp from "sharp";
import {unknownUser} from "./solutionsController.js";

export default class UsersController {

    async getAllUsers(req, res, next) {

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

    async getOneUser(req, res, next) {
        try {
            const {id} = req.params;

            if (!/^[0-9]\d*$/.test(id)) {
                return next(ApiError.badRequest(`Некорректное значение id: ${id}`));
            }
            if (id == 0) {
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

    async getImage(req, res, next) {

        const {id} = req.params;

        const imagePath = path.resolve('src/staticImages', `${id}.png`);

        fs.exists(imagePath, exists => {
            if (exists) {
                res.sendFile(imagePath);
            } else {
                const defaultImagePath = path.resolve('src/staticImages', 'default', 'default_1.png');
                res.sendFile(defaultImagePath);
            }
        });
    }

    async addImage(req, res, next) {
        const {id} = req.params;
        const imagePath = path.resolve('src/staticImages', `${id}.png`);

        try {
            await fs.promises.access(imagePath, fs.constants.F_OK);

            await fs.promises.unlink(imagePath);
        } catch (err) {
        }

        const file = req.file;
        if (!file) {
            return res.json({});
        }

        try {
            await sharp(file.path)
                .resize(200, 200)
                .toFile(imagePath);

            await fs.promises.unlink(file.path);

            return res.json({});
        } catch (err) {
            return next(ApiError.serverError("Ошибка при обработке файла"));
        }
    }
}