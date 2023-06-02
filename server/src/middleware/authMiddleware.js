import jwt from 'jsonwebtoken'
import {User} from "../models/models.js";
import ApiError from "../error/ApiError.js";

export default async function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return next(ApiError.unauthorized("Доступ запрещен. Пройдите регистрацию и авторизацию для получения токена"))
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        req.user = decoded
        //let temp = req.user;
        const user = await User.findByPk(req.user._id)
        if(user._id === req.user._id && user.nickname === req.user.nickname && user.email ===req.user.email&& user.role===req.user.role) {

            //req.user = jwt.verify(token, process.env.SECRET_KEY)
            next()
        }
        else {
            return next(ApiError.unauthorized("Доступ запрещен. Данные токена изменены. Пройдите авторизацию"))
        }


    } catch (e) {
        return next(ApiError.unauthorized("Доступ запрещен. Пройдите авторизацию для получения валидного токена"))
    }
};
