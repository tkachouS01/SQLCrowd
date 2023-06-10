import ApiError from '../error/ApiError.js';
import {formatMilliseconds} from '../utils/utils.js'
import {getAllTablesAndColumns} from '../init-user-dbs.js'
import {
    AutoTaskCheck,
    Database, DifficultyLevelsOfTheme,
    Scores,
    Solution,
    SolutionComment,
    Task,
    TaskEvaluationScore,
    TaskRating, Theme,
    User, UserTestAnswer
} from "../models/models.js";
import {Op} from "sequelize";
import sequelize from "../db.js";
import levenshtein from "fast-levenshtein";
import {consoleError, consoleMessage} from "../customMessageConsole.js";

export default class TasksController {

    async addTaskStats(task, userId) {
        let solutions = task.solutions;
        solutions = solutions.filter(solution => {
            return solution.verified
        });
        let solutionCount = solutions.length;

        const userCount = new Set(task.solutions.map(solution => solution.user._id)).size;
        let averageTime = solutions.reduce((acc, solution) => {
            const startTime = new Date(solution.createdAt);
            const finishTime = new Date(solution.updatedAt);
            return acc + (finishTime - startTime);
        }, 0) / solutionCount;
        averageTime = formatMilliseconds(averageTime || 0);

        let myProgress;
        let solution = await Solution.findOne({where: {taskId: task._id, userId: userId}});
        if (!solution) myProgress = "Не выполнялось"
        else if (solution.verified) myProgress = `Решено`
        else myProgress = "Выполняется"

/**/
        const checks = await AutoTaskCheck.findOne({where: {taskId: task._id}})
        const inBank = (await Task.findByPk(task._id)).inBank;
        const authorSolution = await Solution.findOne({where: {taskId:task._id, isAuthor: true}})

        const autoTaskCheck = {
            checkingSyntaxOfCode: !checks?false:checks.checkingSyntaxOfCode,
            simpleConditionCheck: {
                value: !checks?'0':checks.simpleConditionCheck,
                check: !checks?false:checks.simpleConditionCheck<85
            },
            complexConditionCheck: {
                value: !checks?0:checks.complexConditionCheck,
                check: !checks?false:checks.complexConditionCheck<85
            },
        };
        const finished = !!authorSolution ? authorSolution.finished : null;
        const currentMyRating = await TaskRating.findOne({where: {taskId: task._id, userId}});
        const currentMyComment = await SolutionComment.findOne({where: {userId, solutionId}})
        /**/
        return {
            ...(task.toJSON()), solutions: undefined, solutionCount, userCount, averageTime, myProgress,autoTaskCheck,inBank,finished
        };


    }

    async getAllTasks(req, res, next) {
        const userId = req.user._id;
        const themeId = req.params.themeId;
        if ((await DifficultyLevelsOfTheme.findByPk(themeId)).taskCreation === 0) {
            return next(ApiError.forbidden('Задачи по этой теме не предусмотрены'))
        }

        if (!(await UserTestAnswer.findOne({where: {userId, testId: themeId}})) && req.user.role === 'USER') {
            return next(ApiError.forbidden('Для просмотра задач вам необходимо решить тест'))
        }
        //try {

        const result = await Task.findAll({
            ...getQuery(req.query.section, req.query.category, themeId, userId, req.user.role)
        });
        const currentTheme = await Theme.findByPk(themeId)

        let created = {
            current: (await Task.findAll({...getQuery('evaluation', 'my-tasks', themeId, userId, req.user.role)})).length,
            max: currentTheme.numCreateTasks
        }
        let evaluated = {
            current: (await Task.findAll({...getQuery('evaluation', 'executed', themeId, userId, req.user.role)})).length,
            max: currentTheme.numEvaluationTasks
        }
        let fromBank = {
            current: (await Task.findAll({...getQuery('bank', 'executed', themeId, userId, req.user.role)})).length
        }
        return res.json({result, info: {created, evaluated, fromBank}})
        //} catch (error) {
        //    return next(ApiError.serverError(error.message))
        //}

    }

    async createTask(req, res, next) {
        const t = await sequelize.transaction()
        try {
            const userId = req.user._id;
            const themeId = req.params.themeId;

            if ((await DifficultyLevelsOfTheme.findByPk(themeId, {transaction: t})).taskCreation === 0) {
                await t.rollback()
                return next(ApiError.forbidden('Задачи по этой теме не предусмотрены'))
            }
            if (!(await UserTestAnswer.findOne({
                where: {
                    userId,
                    testId: themeId
                }
            }, {transaction: t})) && req.user.role === 'USER') {
                await t.rollback()
                return next(ApiError.forbidden('Для просмотра задач вам необходимо решить тест'))
            }

            let task = await Task.create({userId, themeId}, {transaction: t});
            await t.commit()
            return res.json({taskId: task._id})
        } catch (error) {
            await t.rollback()
            return next(ApiError.badRequest(error.message))
        }
    }

    async getOneTask(req, res, next) {
        //try {
        try {
            const userId = req.user._id;
            const taskId = req.params.taskId;
            const themeId = req.params.themeId;
            if ((await DifficultyLevelsOfTheme.findByPk(themeId)).taskCreation === 0) {
                return next(ApiError.forbidden('Задачи по этой теме не предусмотрены'))
            }
            if (!(await UserTestAnswer.findOne({where: {userId, testId: themeId}})) && req.user.role === 'USER') {
                return next(ApiError.forbidden('Для просмотра задач вам необходимо решить тест'))
            }
            const task = await Task.findByPk(taskId, {
                ...queryOptions
            });
            if (task) {
                const taskWithStats = await this.addTaskStats(task, userId);




                if (req.user._id === task.user._id) {
                    const dbs = await Database.findAll({attributes: ['_id', 'name']});

                    if (!task.database) {
                        return res.json({info: taskWithStats, databases: dbs});
                    } else {
                        return res.json({
                            info: taskWithStats, data: await getAllTablesAndColumns(task.database._id), databases: dbs
                        });
                    }
                } else {
                    if (task.database) {
                        return res.json({
                            info: taskWithStats, data: await getAllTablesAndColumns(task.database._id)
                        });
                    } else {
                        return res.json({
                            info: taskWithStats
                        });
                    }

                }

            } else {
                return next(ApiError.notFound(`Задание с id=${taskId} не найдено`));
            }
        } catch (error) {
            return next(ApiError.badRequest(error))
        }


        //} catch (error) {
        //    return next(ApiError.serverError(error.message))
        //}

    }

    async updateTask(req, res, next) {
        //try {
        const t = await sequelize.transaction()

        const userId = req.user._id;
        const taskId = req.params.taskId;
        const {databaseName, description} = req.body;

        const currentTask = await Task.findByPk(taskId, {transaction: t});
        if (currentTask.inBank !== null) {
            await t.rollback()
            return next(ApiError.badRequest('Изменение задачи запрещено, т.к. ее решение вами завершено'))
        }


        if (databaseName && !await Database.findOne({where: {name: databaseName}}, {transaction: t})) {
            await t.rollback()
            return next(ApiError.badRequest(`БД \"${databaseName}\" несуществует`));
        }

        if (!description) {
            await t.rollback()
            return next(ApiError.badRequest(`Описание задания не введено`))
        }


        try {
            if (databaseName) {
                let databaseId = (await Database.findOne({where: {name: databaseName}}, {transaction: t}))._id
                await Task.update({databaseId, description, verified: false}, {where: {_id: taskId}, transaction: t});
            } else {
                await Task.update({databaseId: null, description, verified: false}, {
                    where: {_id: taskId},
                    transaction: t
                });
            }

            const task = await Task.findByPk(taskId, {
                ...queryOptions, transaction: t
            });
            await t.commit()

            const taskWithStats = await this.addTaskStats(task, userId);

            if (!task.database) {
                return res.json({info: taskWithStats})
            } else {
                return res.json({info: taskWithStats, data: await getAllTablesAndColumns(task.database._id)})
            }
        } catch (error) {
            await t.rollback()
            return next(ApiError.badRequest(error))
        }

        //} catch (error) {
        //    return next(ApiError.serverError(error.message))
        //}

    }

    async addTaskRating(req, res, next) {
        //try {
        const taskId = req.params.taskId;
        const themeId = req.params.themeId;
        const userId = req.user._id;
const currentRating = await TaskRating.findOne({where:{taskId, userId}})
        if(currentRating) {
            return next(ApiError.forbidden('Оценивать задачу повторно запрещено'))
        }
        const currentTask = await Task.findByPk(taskId);

        const solutionId = (await Solution.findOne({where: {isAuthor: true, taskId}}))._id


        if (currentTask.inBank) {
            return next(ApiError.forbidden('Оценивать задачу из банка задач запрещено'))
        }
        const currentSolution = await Solution.findByPk(solutionId);
        /*if (!currentSolution.finished && req.user.role === 'USER') {
            return next(ApiError.forbidden('Завершите решение для оценки задачи'))
        }*/

        const newRating = req.body.rating;
        const comment = (!!req.body.comment) ? req.body.comment : '';
        if (!((+newRating) <= 5 && (+newRating) >= 1)) {
            return next(ApiError.badRequest('Оценка должна быть выбрана и быть в диапазоне от 1 до 5.'))
        }
        const t = await sequelize.transaction()
        try {
            const taskRating = await TaskRating.create({
                rating: newRating,
                verified: req.user.role === 'ADMIN' ? true : null,
                isAdmin: req.user.role === 'ADMIN',
                taskId: taskId,
                userId: userId
            }, {transaction: t})
            await SolutionComment.create({
                content: comment,
                solutionId: solutionId,
                userId: userId
            }, {transaction: t})
            const taskEvaluation = (await DifficultyLevelsOfTheme.findByPk(themeId)).taskEvaluation;
            const score = currentSolution.verified ? taskEvaluation : 0;
            const rating = Math.round(((score / taskEvaluation) * 5) * 100) / 100
            const scoreId = (await Scores.create({
                score,
                rating,
                userId
            }, {transaction: t}))._id;

            await TaskEvaluationScore.create({
                scoreId,
                taskRatingId: taskRating._id
            }, {transaction: t})
            await t.commit()
            return res.json({})
        } catch (error) {
            await t.rollback()
            return next(ApiError.badRequest(error))
        }


        //} catch (error) {
        //    return next(ApiError.serverError(error.message))
        //}
    }
}

export const getQuery = (section, category, themeId, userId, role, isFinished = false) => {
    let query = {
        attributes: ['_id', 'description'],
        order: [['_id', 'ASC']],
        include: [{
            model: User,
            attributes: ['_id', 'nickname', 'role']
        }]
    };

    if (section === 'bank') {

        if (category === 'all') {
            query.where = {themeId, inBank: true,userId: {[Op.not]: userId}}
        } else if (category === 'not-executed') {
            query.where = {
                themeId,
                inBank: true,
                _id: {
                    [Op.notIn]: sequelize.literal(`(SELECT "taskId" FROM "solutions" WHERE "userId" = ${userId})`)
                }
            };
        } else if (category === 'in-progress') {

                query.where = {
                    themeId,
                    inBank: true,
                    '$solutions.userId$': userId
                };
                query.include.push({
                    model: Solution,
                    where: {verified: false},
                    attributes: []
                })


        } else if (category === 'executed') {
            query.where = {
                themeId,
                inBank: true,
                '$solutions.userId$': userId
            };
            query.include.push({
                model: Solution,
                where: {verified: true},
                attributes: []
            })
        } else if (category === 'my-tasks') {
            if (role === 'ADMIN') {
                query.where = {
                    themeId, userId
                }
            } else {
                query.where = {
                    themeId, inBank: {[Op.is]: true}, userId
                }
            }

        }
    } else if (section === 'evaluation') {

        if (category === 'all') {
            query.where = {
                themeId,
                inBank: null,
                verified: true,
                userId: {[Op.not]: userId}
            };
            query.include.push({
                model: Solution,
                where: {finished: true, isAuthor: true},
                attributes: []
            })
        } else if (category === 'not-executed') {
            query.where = {
                themeId,
                inBank: null,
                verified: true,
                _id: {
                    [Op.notIn]: sequelize.literal(`(SELECT "taskId" FROM "solutions" WHERE "userId" = ${userId})`)
                }
            };
            query.include.push({
                model: Solution,
                where: {finished: true, isAuthor: true},
                attributes: []
            })
        } else if (category === 'in-progress') {
            query.where = {
                themeId,
                inBank: null,
                _id: {
                    [Op.in]: sequelize.literal(`(SELECT "taskId" FROM "solutions" WHERE "userId" = ${userId} and "finished" = ${false} and "isAuthor" = ${false})`)
                }
            };
            query.include.push({
                model: Solution,
                where: {finished: true, isAuthor: true},
                attributes: []
            })
        } else if (category === 'executed') {
            query.where = {
                themeId,
            };
            query.include.push({
                model: TaskRating,
                where: {userId: userId},
                attributes: []
            })
        } else if (category === 'my-tasks') {
            if (!isFinished) {

                query.where = {
                    themeId, userId, '$solutions.userId$': userId
                };
                query.include.push({
                    model: Solution,
                    where: {finished: true},
                    attributes: []
                })

            } else {

                query.where = {
                    themeId, userId: 0
                }

            }


        }
    } else if (section === 'admission-to-bank') {

        if (category === 'all') {
            query.where = {
                themeId,
                inBank: null,
                verified: true,
                '$solutions.userId$': userId
            };
            query.include.push({
                model: Solution,
                where: {finished: true},
                attributes: []
            })
        } else if (category === 'accepted') {
            query.where = {
                themeId,
                inBank: true,
                verified: true,
                '$solutions.userId$': userId
            };
            query.include.push({
                model: Solution,
                where: {finished: true},
                attributes: []
            })
        } else if (category === 'not-accepted') {
            query.where = {
                themeId,
                inBank: false,
                '$solutions.userId$': userId
            };
            query.include.push({
                model: Solution,
                where: {verified: false},
                attributes: []
            })
        }
    }
    return query
}

const queryOptions = {
    attributes: ['_id', 'description', 'createdAt', 'updatedAt', 'verified', 'inBank'], include: [{
        model: Solution, attributes: ['_id', 'createdAt', 'updatedAt', 'verified'], include: [{
            model: User, attributes: ['_id']
        }]
    }, {
        model: User, attributes: ['_id', 'nickname', 'role']
    }, {
        model: Database, attributes: ['_id', 'name']
    }]
};
