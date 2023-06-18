import {
    DifficultyLevelsOfTheme,
    Module, Scores,
    Task,
    Test,
    Theme,
    User,
    UserTestAnswer,
    UserTestScore
} from "../models/models.js";
import ApiError from "../error/ApiError.js";
import sequelize from "../db.js";
import {getQuery} from "./tasksController.js";


const objTemp = {
    attributes: {exclude: ['createdByUserId', 'updatedByUserId', 'moduleId']},
    include: [
        {
            model: Module,
            attributes: ['name']
        },
        {
            model: User,
            as: 'createdBy',
            attributes: ['_id', 'nickname', 'role']
        },
        {
            model: User,
            as: 'updatedBy',
            attributes: ['_id', 'nickname', 'role']
        },

        {
            model: DifficultyLevelsOfTheme,
            attributes: {exclude: ['themeId', 'id', 'createdAt', 'updatedAt']}
        },
    ],
}
export default class ThemesController {
    async getAllThemes(req, res, next) {
        try {
            const userId = req.user._id

            const {moduleId} = req.params;
            const currentModule = await Module.findByPk(moduleId);
            if ((!currentModule.isAvailable) && req.user.role === 'USER') {
                return next(ApiError.forbidden('Модуль не доступен к просмотру'))
            }

            req.query = req.user.role === 'USER'
                ? {isAvailable: true}
                : {};
            req.query.moduleId = moduleId;


            const result = await Theme.findAll({
                order: [['_id', 'ASC']],
                where: req.query,
                attributes: ['_id', 'name', 'isAvailable'],
            })

            let results = await Promise.all(result.map(async (item) => {
                let temp = item.toJSON();

                const currentTestAnswer = await UserTestAnswer.findOne({where: {testId: temp._id, userId}})

                let currentScore = null;
                let score = null;

                if (currentTestAnswer) {
                    currentScore = (await UserTestScore.findOne({where: {userTestAnswerId: currentTestAnswer._id}}));
                    score = await Scores.findByPk(currentScore.scoreId)
                }
                const levels = await DifficultyLevelsOfTheme.findByPk(temp._id)
                const currentTheme = await Theme.findByPk(temp._id);
                const currentCreated = await Task.findAll({...getQuery('evaluation', 'my-tasks', temp._id, userId, req.user.role)})
                let created = {
                    currentCount: currentCreated.length,
                    maxCount: currentTheme.numCreateTasks,
                    score: 'надо вычислить',
                    rating: 'надо вычислить',
                    scoreMax: levels.taskCreation
                }
                let currentEvaluated = (await Task.findAll({...getQuery('evaluation', 'executed', temp._id, userId, req.user.role)}))
                let evaluated = {
                    currentCount: currentEvaluated.length,
                    maxCount: currentTheme.numEvaluationTasks,
                    score: 'надо вычислить',
                    rating: 'надо вычислить',
                    scoreMax: levels.taskEvaluation
                }
                let currentFromBank = await Task.findAll({...getQuery('bank', 'executed', temp._id, userId, req.user.role)})
                let fromBank = {
                    currentCount: currentFromBank.length,
                    score: 'надо вычислить',
                    rating: 'надо вычислить',
                    scoreMax: levels.taskSolution
                }
                const currentTest = await Test.findByPk(currentTheme._id)
                let tested = {
                    score: score === null ? 'Тест не решен' : score.score,
                    rating: score === null ? 'Тест не решен' : score.rating,
                    scoreMax: levels.testSolution * currentTest.questions.length
                };
                temp.created = created;
                temp.evaluated = evaluated;
                temp.fromBank = fromBank;
                temp.tested = tested;
                return temp;
            }));


            return res.json(results)
        } catch (error) {
            return res.json([])
        }
    }

    async getOneTheme(req, res, next) {
        try {
            const userId = req.user._id;
            let {moduleId, themeId} = req.params;
            const currentTheme = await Theme.findByPk(themeId);
            moduleId = currentTheme.moduleId;


            const currentModule = await Module.findByPk(moduleId ?? currentTheme.moduleId);

            if (!(currentModule.isAvailable && currentTheme.isAvailable) && req.user.role === 'USER') {
                return next(ApiError.forbidden('Тема не доступна к просмотру'))
            }

            const result = await Theme.findByPk(
                themeId,
                {...objTemp}
            );


            return res.json(result)
        } catch (error) {
            return res.json([])
        }
    }

    async addTheme(req, res, next) {

        const adminId = req.user._id;
        const {moduleId} = req.params;
        const t = await sequelize.transaction()
        try {
            const theme = await Theme.create({
                createdByUserId: adminId,
                updatedByUserId: adminId,
                moduleId
            }, {transaction: t})
            await DifficultyLevelsOfTheme.create({
                themeId: theme._id
            }, {transaction: t})
            await Test.create({
                themeId: theme._id,
                createdByUserId: adminId,
                updatedByUserId: adminId
            }, {transaction: t})
            await t.commit()
            return res.json({_id: theme._id})
        } catch (error) {
            await t.rollback()
            return next(ApiError.badRequest(error))
        }
    }

    async updateTheme(req, res, next) {

        const adminId = req.user._id;
        const {name, description, sqlCommands, numEvaluationTasks, numCreateTasks, levels} = req.body;
        const {themeId} = req.params;
        const t = await sequelize.transaction()
        try {
            await Theme.update(
                {
                    name,
                    description,
                    sqlCommands,
                    numEvaluationTasks,
                    numCreateTasks,
                    isAvailable: false,
                    updatedByUserId: adminId
                },
                {where: {_id: themeId}, transaction: t},
            )
            await DifficultyLevelsOfTheme.update(
                levels,
                {where: {themeId: themeId}, transaction: t},
            )
            const result = await Theme.findByPk(
                themeId,
                {...objTemp, transaction: t}
            )
            await t.commit()
            return res.json(result)
        } catch (error) {
            await t.rollback()
            return next(ApiError.badRequest(error.message))
        }
    }

    async makeAvailableTheme(req, res, next) {
        const adminId = req.user._id;
        const {themeId, moduleId} = req.params;
        const currentTheme = await Theme.findByPk(themeId)
        const t = await sequelize.transaction()
        try {
            await Theme.update(
                {isAvailable: (!currentTheme.isAvailable), updatedByUserId: adminId},
                {where: {_id: themeId}},
                {transaction: t}
            )

            const result = await Theme.findByPk(
                themeId,
                {
                    attributes: ['updatedAt', 'isAvailable'],
                    include: {
                        model: User,
                        as: 'updatedBy',
                        attributes: ['_id', 'nickname', 'role']
                    }, transaction: t
                }
            )
            await t.commit()
            return res.json(result)
        } catch (error) {
            await t.rollback()
            return next(ApiError.badRequest(error))
        }
    }
}