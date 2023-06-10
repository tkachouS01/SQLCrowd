import ApiError from '../error/ApiError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Op} from 'sequelize'
import {User} from '../models/models.js';
import {mySendMail} from "./mail.js";
import {generatePassword} from "../utils/utils.js";
import sequelize from "../db.js";

const generateJwt = (_id, email, role, nickname) => {
    return jwt.sign({_id, email, role, nickname}, process.env.SECRET_KEY, {expiresIn: '24h'})
}

export default class AuthController {
    async check(req, res, next) {
        try {
            const token = generateJwt(req.user._id, req.user.email, req.user.role, req.user.nickname)

            return res.json({token})
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }

    }


    async signUp(req, res, next) {
        try {
            const {surname, name, patronymic, gender, date_of_birth, nickname, email} = req.body


            const errorMessage = validateFields(surname, name, patronymic, gender, date_of_birth, nickname, email);
            if (errorMessage) {
                return next(ApiError.badRequest(errorMessage));
            }
            let candidate = await User.findOne({where: {email}})
            if (candidate) {
                return next(ApiError.conflictingRequest('Пользователь с таким email уже существует'))
            }
            candidate = await User.findOne({where: {nickname}})
            if (candidate) {
                return next(ApiError.conflictingRequest('Пользователь с таким никнеймом уже существует'))
            }
            if (/^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email) === false) {
                return next(ApiError.badRequest('email некорректный'));
            }
            const password = generatePassword(12);

            const hashPassword = await bcrypt.hash(password, 5)
            const t = await sequelize.transaction()
            try {
                let user;

                user = await User.create({
                    surname, name, patronymic, gender, date_of_birth, nickname, email, password: hashPassword
                }, {transaction: t});


                let countUsers = await User.count({transaction:t});
                if (countUsers === 1) {
                    await User.update(
                        {role: 'ADMIN'}, {where: {_id: user._id},transaction:t}
                    )
                }
                await mySendMail(user.nickname, user.email, password, user._id, user.createdAt)
                await t.commit()
                return res.json({userId: user._id})
            } catch (error) {
                await t.rollback()
                return next(ApiError.badRequest(error))
            }

        } catch (error) {
            return next(ApiError.serverError(error.message))
        }

    }

    async signIn(req, res, next) {
        try {
            const {login, password} = req.body;

            if (!login || !password) return next(ApiError.badRequest(`Значения логина или пароля пусты`))

            const user = await User.findOne({
                where: {
                    [Op.or]: [{email: login}, {nickname: login}]
                }
            });

            if (!user) {
                return next(ApiError.unauthorized(`Пользователя с таким логином не найдено`))
            }

            let comparePassword = bcrypt.compareSync(password, user.password);

            if (!comparePassword) {
                return next(ApiError.unauthorized(`Неверный пароль`))
            }

            const token = generateJwt(user._id, user.email, user.role, user.nickname);
            return res.json({token, userId: user._id});
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }

    }
}

function validateFields(surname, name, patronymic, gender, date_of_birth, nickname, email) {
    const missingFields = [];
    if (!nickname) missingFields.push('никнейм');
    if (!email) missingFields.push('email');
    if (!surname) missingFields.push('фамилия');
    if (!name) missingFields.push('имя');
    if (!patronymic) missingFields.push('отчество');
    if (gender === "Не указано") missingFields.push('пол');
    if (!date_of_birth) missingFields.push('дата рождения');
    if (missingFields.length === 0) return null;
    return `Не указаны: ${missingFields.join(', ')}`;
}
