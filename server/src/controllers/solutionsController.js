import {
    Task,
    Solution,
    User,
    SolutionLike,
    SolutionComment,
    AutoTaskCheck,
    TaskRating, DifficultyLevelsOfTheme, Scores, TaskSolutionScore
} from '../models/models.js';
import ApiError from '../error/ApiError.js';
import {executeQuery} from '../init-user-dbs.js'
import stringSimilarity from "string-similarity";
import {Op} from "sequelize";
import sequelize from "../db.js";
import {convertScoreToRating} from "../utils/utils.js";

export const unknownUser = {
    _id: 0, nickname: 'СЕКРЕТНЫЙ СУСЛИК', role: 'ADMIN'
}

export default class SolutionsController {

    async getSolutions(req, res, next) {
        try {
            const taskId = req.params.taskId;

            const userId = req.user._id;

            const currentTask = await Task.findByPk(taskId);


            let solutions = await Solution.findAll({
                where: {taskId: taskId}, ...queryOptions
            });

            let result = await Promise.all(solutions.map(async (el) => {
                let temp = el.toJSON();
                let tempSolutionId = temp._id;
                let like = await SolutionLike.findOne({where: {solutionId: tempSolutionId, userId}});
                let likes = await SolutionLike.findAll({where: {solutionId: tempSolutionId}});
                temp.like = {isLiked: !!like, likeCount: likes.length};
                if (currentTask.inBank === null && temp.user._id !== userId) {
                    temp.user = (temp.user._id === userId || req.user.role === 'ADMIN') ? temp.user : {...unknownUser};
                    temp.solution_comments = temp.solution_comments.map(item => {
                        item.user = (item.user._id === userId || req.user.role === 'ADMIN') ? item.user : {...unknownUser};
                        return item;
                    })
                }
                return temp;
            }));

            return res.json(result);

        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async createSolutionTask(req, res, next) {
        const taskId = req.params.taskId;
        const userId = req.user._id;

        if (req.user.role === 'ADMIN' && (await Task.findByPk(taskId)).userId !== userId)
            return next(ApiError.forbidden('Преподавателям нельзя решать не свои задачи'))
        const t = await sequelize.transaction()
        try {
            let userSolution = await Solution.findOne({where: {taskId: taskId, userId}}, {transaction: t})
            if (!userSolution) {
                let task = await Task.findOne({where: {_id: taskId}}, {transaction: t});

                userSolution = await Solution.create({
                    userId,
                    taskId: taskId,
                    isAuthor: task.userId === userId
                }, {transaction: t});

            } else {
                await t.rollback()
                return res.json({solutionId: userSolution._id})
            }
            await t.commit()
            return res.json({solutionId: userSolution._id})
        } catch (error) {
            await t.rollback()
            return next(ApiError.serverError(error.message))
        }
    }

    async updateSolutionTask(req, res, next) {
        const t = await sequelize.transaction()

        try {
            const solutionId = req.params.solutionId;
            const {code} = req.body;
            const userId = req.user._id;

            let userSolution = await Solution.findByPk(solutionId, {transaction: t});
            let task = await Task.findByPk(userSolution.taskId, {transaction: t})

            let rowsUser;
            try {
                rowsUser = await executeQuery(code, task.databaseId);

                if (userSolution.code === code || userSolution.finished) {
                    return res.json({
                        success: userSolution.verified,
                        fields: Object.keys(rowsUser[0] || {}),
                        rows: rowsUser
                    })
                }
            } catch (error) {
                if (!(userSolution.code === code || userSolution.finished)) {

                    try {
                        await Solution.update({
                            code, attempts: ++userSolution.attempts, verified: false
                        }, {where: {_id: userSolution._id}, transaction: t});
                    } catch (error) {
                        await t.rollback()
                        return next(ApiError.badRequest(error))
                    }

                }
                await t.commit()
                return next(ApiError.badRequest(`Ошибка при выполнении запроса: ${(String(error).split('SequelizeDatabaseError:')[1]) || error}`))
            }

            if (userSolution.isAuthor) {
                try {
                    await Solution.update({
                        code, attempts: ++userSolution.attempts, verified: true
                    }, {where: {_id: userSolution._id}, transaction: t});
                    await Task.update({verified: true}, {where: {_id: task._id}, transaction: t})
                    await t.commit()
                    return res.json({success: true, fields: Object.keys(rowsUser[0] || {}), rows: rowsUser})
                } catch (error) {
                    await t.rollback()
                    try {
                        await Solution.update({
                            code, attempts: ++userSolution.attempts, verified: false
                        }, {where: {_id: userSolution._id}, transaction: t});
                        await Task.update({verified: false}, {where: {_id: task._id}, transaction: t})
                        await t.commit()
                        return next(ApiError.badRequest(`Ошибка при выполнении запроса: ${(String(error).split('Error: SequelizeDatabaseError:')[1]) || error}`))
                    } catch (error) {
                        await t.rollback()
                        return next(ApiError.badRequest(error))
                    }

                }
            }

            if (!rowsUser[0]) {
                await Solution.update({
                    code, attempts: ++userSolution.attempts, verified: false
                }, {where: {_id: userSolution._id}, transaction: t});
                await t.commit()
                return next(ApiError.badRequest(`Пустой набор строк`))
            }

            let solutionAuthor = await Solution.findOne({where: {taskId: task._id, isAuthor: true}}, {transaction: t})

            let rowsAuthor = await executeQuery(solutionAuthor.code, task.databaseId);

            let temp = JSON.stringify(rowsUser) === JSON.stringify(rowsAuthor)
            let taskTemp = await Task.findByPk(userSolution.taskId, {transaction: t})
            if (taskTemp.description !== '' && taskTemp.databaseId) {
                await Task.update({verified: true}, {where: {_id: taskTemp._id}, transaction: t})
            }
            await Solution.update({
                code, attempts: ++userSolution.attempts, verified: temp
            }, {where: {_id: userSolution._id}, transaction: t});
            await t.commit()
            return res.json({success: temp, fields: Object.keys(rowsUser[0]), rows: rowsUser})
        } catch (error) {
            await t.rollback()
            return next(ApiError.badRequest(error))
        }
    }

    async finishTheSolution(req, res, next) {
        const solutionId = req.params.solutionId;
        const taskId = req.params.taskId;
        const themeId = req.params.themeId;
        const userId = req.user._id;

        let userSolution = await Solution.findByPk(solutionId);
        let userTask = await Task.findByPk(taskId);

        if (userSolution.finished) {
            return next(ApiError.forbidden('Вы уже завершили решение'))
        }
        if (req.user.role === 'USER' && req.user._id !== userTask.userId && userTask.inBank === null) {
            const taskRating = await TaskRating.findOne({where: {taskId, userId}})
            if (!taskRating) {
                return next(ApiError.forbidden('Вы не оценили задачу, завершение решения запрещено'))
            }
        }
        const t = await sequelize.transaction()
        try {
            await Solution.update(
                {finished: true},
                {where: {_id: solutionId}, transaction: t}
            )
            if (userTask.userId !== req.user._id && userTask.inBank === true) {
                const taskSolution = (await DifficultyLevelsOfTheme.findByPk(themeId, {transaction: t})).taskSolution;
                const score = userSolution.verified ? taskSolution : 0;
                const rating = convertScoreToRating(score, taskSolution)

                const scoreId = (await Scores.create({
                    score,
                    rating,
                    userId
                }, {transaction: t}))._id
                await TaskSolutionScore.create({
                    solutionId,
                    scoreId
                }, {transaction: t})
                await t.commit()
                return res.json({})
            }

            let isUserSolution = userSolution.userId === userId
            if (isUserSolution) {

                if (userSolution.isAuthor) {

                    const currentSolution = await Solution.findOne({
                        where: {_id: solutionId},
                        attributes: ['code']
                    }, {transaction: t})
                    const solutions = await Solution.findAll({
                        where: {
                            isAuthor: true,
                            verified: true,
                            finished: true,
                            _id: {
                                [Op.ne]: solutionId
                            }
                        },
                        attributes: ['code']
                    }, {transaction: t})
                    const currentTask = await Task.findOne({
                        where: {_id: taskId},
                        attributes: ['description']
                    }, {transaction: t})
                    const tasks = await Task.findAll({
                        where: {
                            _id: {
                                [Op.ne]: taskId
                            }
                        },
                        include: {
                            model: Solution,
                            where: {isAuthor: true, finished: true},
                            attributes: []
                        },
                        attributes: ['description']
                    }, {transaction: t})

                    const complexConditionCheck = solutions.length === 0 ? 0 : conditionCheckFunc(
                        currentSolution.code,
                        solutions.filter(item => item.code !== null && item.code.trim() !== '').map(item => item.code)
                    );
                    const simpleConditionCheck = tasks.length === 0 ? 0 : conditionCheckFunc(
                        currentTask.description,
                        tasks.filter(item => item.description !== null && item.description.trim() !== '').map(item => item.description)
                    );

                    await AutoTaskCheck.create({
                        taskId,
                        checkingSyntaxOfCode: userSolution.verified,
                        simpleConditionCheck,
                        complexConditionCheck
                    }, {transaction: t})
                    const checks = await AutoTaskCheck.findOne({where: {taskId}, transaction: t})
                    if (!checks.checkingSyntaxOfCode || checks.simpleConditionCheck >= 85 || checks.complexConditionCheck >= 85) {
                        await Task.update({inBank: false}, {where: {_id: taskId}, transaction: t})
                    } else {
                        if (req.user.role === 'ADMIN')
                            await Task.update({inBank: true}, {where: {_id: taskId}, transaction: t})
                    }
                    const inBank = (await Task.findByPk(taskId, {transaction: t})).inBank;

                    await t.commit()

                    return res.json({
                        autoTaskCheck: {
                            checkingSyntaxOfCode: checks.checkingSyntaxOfCode,
                            simpleConditionCheck: checks.simpleConditionCheck,
                            complexConditionCheck: checks.complexConditionCheck
                        },
                        inBank
                    })
                } else {
                    await t.commit()
                    return res.json({})
                }
            } else {
                await t.commit()
                return next(ApiError.forbidden(`Редактировать решение другого пользователя запрещено`))
            }
        } catch (error) {
            if (!t.finished) await t.rollback()
            return next(ApiError.badRequest(error))
        }
    }

    async getOneSolution(req, res, next) {
        try {
            const userId = req.user._id;
            const solutionId = req.params.solutionId;
            const taskId = req.params.taskId;

            let solution = await Solution.findByPk(solutionId)

            if (solution.userId !== userId) return next(ApiError.forbidden(`Доступ к этому решению разрешен только его создателю`))
            return res.json(solution)
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async likeSolution(req, res, next) {
        const solutionId = req.params.solutionId;
        const userId = req.user._id;

        try {
            const solutionLike = await SolutionLike.findOne({where: {solutionId: solutionId, userId}})

            if (solutionLike) {
                await SolutionLike.destroy({where: {solutionId: solutionId, userId}})
                return res.json({isLiked: false})
            } else {
                await SolutionLike.create({solutionId: solutionId, userId})
                return res.json({isLiked: true})
            }
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async addCommentSolution(req, res, next) {
        try {
            const solutionId = req.params.solutionId;
            const content = req.body.content;
            const userId = req.user._id;
            if (!content || content === ' ') return next(ApiError.badRequest(`Комментарий не может быть пустым`))

            const comment = await SolutionComment.create({content, userId, solutionId: solutionId})

            return res.json({id: comment._id})
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }
}

const queryOptions = {
    attributes:
        {
            exclude: ['taskId', 'userId']
        },
    include:
        [
            {
                model: User, attributes: ['_id', 'nickname', 'role']
            },
            {
                model: SolutionComment,
                attributes: {exclude: ['solutionId', 'userId', 'updatedAt', 'taskRatingId']},
                include:
                    [
                        {
                            model: User,
                            attributes: ['_id', 'nickname', 'role'],

                        },
                        {
                            model: TaskRating,
                            attributes: ['rating', 'verified']
                        }
                    ]
            }]
};
const conditionCheckFunc = (current, array) => {
    if (current === null) {
        return 100
    }
    current = current.replace(/(\/\*[\s\S]*?\*\/|--.*?$)/gm, '').toLowerCase();
    if (!current) {
        return 100
    }
    array = array.map(item => item.replace(/(\/\*[\s\S]*?\*\/|--.*?$)/gm, '').toLowerCase())
    const result = stringSimilarity.findBestMatch(current, array);

    return +(result.bestMatch.rating * 100).toFixed(2)
}


















