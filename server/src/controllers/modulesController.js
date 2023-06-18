import {Module, Theme, User} from "../models/models.js";
import ApiError from "../error/ApiError.js";
import sequelize from "../db.js";

const objTemp = {
    attributes: {exclude: ['createdByUserId', 'updatedByUserId']},
    include: [
        {
            model: User,
            as: 'createdBy',
            attributes: ['_id', 'nickname', 'role']
        },
        {
            model: User,
            as: 'updatedBy',
            attributes: ['_id', 'nickname', 'role']
        }
    ]
}
export default class ModulesController {
    async getAllModules(req, res, next) {
        try {
            req = req.user.role === 'USER'
                ? {query: {isAvailable: true}}
                : {query: {}};

            const result = await Module.findAll({
                order: [['_id', 'ASC']],
                where: req.query,
                ...objTemp
            })

            return res.json(result)
        } catch (error) {
            return res.json([])
        }
    }

    async addModule(req, res, next) {
        const t = await sequelize.transaction()
        try {
            const adminId = req.user._id;

            const currentModule = await Module.create({
                createdByUserId: adminId,
                updatedByUserId: adminId
            }, {transaction: t})

            const result = await Module.findByPk(
                currentModule._id,
                {...objTemp, transaction: t}
            )
            await t.commit()

            return res.json(result)
        } catch (error) {
            await t.rollback()
            return next(ApiError.badRequest(error.message))
        }
    }

    async updateModule(req, res, next) {
        const adminId = req.user._id;
        const {moduleId} = req.params
        const {name, description} = req.body;
        const oldResult = await Module.findByPk(
            moduleId
        );
        if (oldResult.name === name && oldResult.description === description) {
            return res.json({})
        }
        if (!name && !description) {
            return next(ApiError.badRequest('Данные не введены'))
        }
        const t = await sequelize.transaction()
        try {
            await Module.update(
                {name, description, updatedByUserId: adminId, isAvailable: false},
                {where: {_id: moduleId}, transaction: t}
            )
            const result = await Module.findByPk(
                moduleId,
                {...objTemp, transaction: t}
            )
            await t.commit()
            return res.json(result)

        } catch (error) {
            await t.rollback()
            return next(ApiError.badRequest(error))
        }
    }

    async makeAvailableModule(req, res, next) {
        try {
            const adminId = req.user._id;
            const {moduleId} = req.params
            const currentModule = await Module.findByPk(moduleId);
            if (currentModule.isAvailable === false) {
                const currentThemes = await Theme.findAll({
                    where: {isAvailable: true, moduleId: moduleId}
                });
                if (!currentModule.name || !currentModule.description) {
                    return next(ApiError.badRequest('Модуль не полностью заполнен'))
                }
                if (currentThemes.length === 0) {
                    return next(ApiError.badRequest(('Ни одна тема в модуле не допущена')))
                }

            }
            const t = await sequelize.transaction()
            try {
                await Module.update(
                    {isAvailable: !currentModule.isAvailable, updatedByUserId: adminId},
                    {where: {_id: moduleId}, transaction: t}
                )
                const result = await Module.findByPk(
                    moduleId,
                    {...objTemp, transaction: t}
                )
                await t.commit()
                return res.json(result)
            } catch (error) {
                await t.rollback()
                return next(ApiError.badRequest(error))
            }
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }
}