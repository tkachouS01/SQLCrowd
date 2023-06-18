import {AdminRoleRequest, User} from "../models/models.js";
import ApiError from "../error/ApiError.js";
import sequelize from "../db.js";

export default class RoleRequestsController {

    async getAllRequests(req, res, next) {
        try {
            const userId = req.user._id;
            req.query = {
                userId: req.user.role === 'USER' ? userId : req.user.role,
                role: req.query.role,
                isThereResponse: req.query.isThereResponse,
                isApproved: req.query.isApproved
            }

            if (req.user.role === 'USER') req.query.userId = userId;

            const result = await AdminRoleRequest.findAll({
                order: [['_id', 'ASC']],
                where: req.query
            });

            return res.json(result);
        } catch (error) {
            return res.json([])
        }
    }

    async addRequest(req, res, next) {
        try {
            const userId = req.user._id;
            const {requestMessage} = req.body
            if (userId === 1) {
                return next(ApiError.badRequest('Изменять роль запрещено'))
            }

            const result = await AdminRoleRequest.findOne(
                {where: {userId}, order: [['_id', 'DESC']]}
            )
            if (result) {
                if (!result.isThereResponse) {
                    return next(ApiError.badRequest(`Прошлый запрос роли еще не обработан. Создавать новый запрещено`))
                }
            }
            const currentRole = (await User.findOne(
                {where: {_id: userId}}
            )).role;
            const newRole = currentRole === 'USER' ? 'ADMIN' : 'USER';

            const t = await sequelize.transaction()
            try {
                const request = await AdminRoleRequest.create({
                    userId, requestMessage, role: newRole
                }, {transaction: t});
                await t.commit()
                return res.json({_id: request._id, createAt: request.createAt})
            } catch (error) {
                await t.rollback()
                return next(ApiError.badRequest(error))
            }

        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async addRole(req, res, next) {
        const adminId = req.user._id;
        const {responseMessage} = req.body;
        const userId = req.body._id

        const currentRole = (await User.findOne(
            {where: {_id: userId}}
        )).role;

        if (adminId === userId || userId === 1) {
            return next(ApiError.badRequest('Изменять роль запрещено'))
        }

        const newRole = currentRole === 'USER' ? 'ADMIN' : 'USER';

        const request = await AdminRoleRequest.findOne(
            {where: {userId: userId}, order: [['_id', 'DESC']]}
        )
        const defaultObj = {
            userId: userId, role: newRole, isThereResponse: true, isApproved: true, responseMessage:
                responseMessage ? responseMessage : `Автоматическое сообшение [Роль назначена преподавателем #${adminId}]`
        };
        const t = await sequelize.transaction();
        try {
            if (request) {
                if (!request.isThereResponse) {
                    await AdminRoleRequest.update(
                        {where: {_id: request._id}},
                        {...defaultObj, transaction: t},
                    );
                } else {
                    await AdminRoleRequest.create(defaultObj, {transaction: t});
                }
            } else {
                await AdminRoleRequest.create(defaultObj, {transaction: t});
            }

            await User.update(
                {role: newRole},
                {where: {_id: userId}, transaction: t},
            )
            await t.commit();
            return res.json({role: newRole})
        } catch (error) {
            await t.rollback();
            return next(ApiError.badRequest(error))
        }
    }
}