import ApiError from '../error/ApiError.js';
import {convertRatingToScore, convertScoreToRating, formatMilliseconds} from '../utils/utils.js'
import {getAllTablesAndColumns} from '../init-user-dbs.js'
import {
    AutoTaskCheck,
    Database, DifficultyLevelsOfTheme,
    Scores,
    Solution,
    SolutionComment,
    Task, TaskCreationScore,
    TaskEvaluationScore,
    TaskRating, Theme,
    User, UserTestAnswer
} from "../models/models.js";
import {Op} from "sequelize";
import sequelize from "../db.js";
import {unknownUser} from "./solutionsController.js";

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
        else myProgress = "Решение не верное"

        const checks = await AutoTaskCheck.findOne({where: {taskId: task._id}})
        const inBank = (await Task.findByPk(task._id)).inBank;
        const authorSolution = await Solution.findOne({where: {taskId: task._id, isAuthor: true}})

        const autoTaskCheck = {
            checkingSyntaxOfCode: !checks ? false : checks.checkingSyntaxOfCode,
            simpleConditionCheck: {
                value: !checks ? '0' : checks.simpleConditionCheck,
                check: !checks ? false : checks.simpleConditionCheck < 85
            },
            complexConditionCheck: {
                value: !checks ? 0 : checks.complexConditionCheck,
                check: !checks ? false : checks.complexConditionCheck < 85
            },
        };
        const finished = !!authorSolution ? authorSolution.finished : null;
        const currentMyRating = await TaskRating.findOne({where: {taskId: task._id, userId}});

        let currentMyComment = currentMyRating ? await SolutionComment.findOne({where: {taskRatingId: currentMyRating._id}}) : null

        const myRating = {
            value: currentMyRating ? currentMyRating.rating : null,
            verified: currentMyRating ? currentMyRating.verified : null
        };
        const myComment = currentMyComment ? currentMyComment.content : null;
        const createdAt = currentMyRating ? currentMyRating.createdAt : null;
        const ratingTask = {myRating, myComment, createdAt};
        const sqlCommands = (await Theme.findByPk((await Task.findByPk(task._id)).themeId)).sqlCommands;

        return {
            ...(task.toJSON()),
            solutions: undefined,
            solutionCount,
            userCount,
            averageTime,
            myProgress,
            autoTaskCheck,
            inBank,
            finished,
            ratingTask,
            sqlCommands
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
        if (req.user.role === 'USER' && req.query.section === 'admission-to-bank') {
            return next(ApiError.forbidden('Вы не являетесь преподавателем. Принимать решения о допуске задач вам запрещено'))
        }
        try {

            const result = await Task.findAll({
                ...getQuery(req.query.section, req.query.category, themeId, userId, req.user.role)
            });
            const currentTheme = await Theme.findByPk(themeId)

            let created = {
                current: (await Task.findAll({...getQuery('evaluation', 'my-tasks', themeId, userId, req.user.role, true)})).length,
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
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
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
                taskWithStats.user = (taskWithStats.user._id === userId || req.user.role === 'ADMIN' || taskWithStats.inBank !== null) ? taskWithStats.user : {...unknownUser};

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
    }

    async updateTask(req, res, next) {
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
    }

    async addTaskRating(req, res, next) {
        const taskId = req.params.taskId;
        const themeId = req.params.themeId;
        const userId = req.user._id;
        if ((!await Solution.findOne({where: {taskId, userId}}) && req.user.role === 'USER')) {
            return next(ApiError.forbidden('Вы еще не начали решение'))
        }
        const currentRating = await TaskRating.findOne({where: {taskId, userId}})
        if (currentRating) {
            return next(ApiError.forbidden('Оценивать задачу повторно запрещено'))
        }
        const currentTask = await Task.findByPk(taskId);

        const solutionId = (await Solution.findOne({where: {isAuthor: true, taskId}}))._id


        if (currentTask.inBank) {
            return next(ApiError.forbidden('Оценивать задачу из банка задач запрещено'))
        }
        const currentSolution = await Solution.findByPk(solutionId);

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
                userId: userId,
                taskRatingId: taskRating._id,
            }, {transaction: t})


            await t.commit()


            const currentMyRating = await TaskRating.findOne({where: {taskId, userId}});
            let currentMyComment = currentMyRating ? await SolutionComment.findOne({taskRatingId: currentMyRating._id}) : null
            const myRating = {
                value: currentMyRating ? currentMyRating.rating : null,
                verified: currentMyRating ? currentMyRating.verified : null
            };
            const myComment = currentMyComment ? currentMyComment.content : null;
            const createdAt = currentMyRating ? currentMyRating.createdAt : null;
            const ratingTask = {myRating, myComment, createdAt};


            return res.json(ratingTask)
        } catch (error) {
            await t.rollback()
            return next(ApiError.badRequest(error))
        }
    }

    async updateInBankTasks(req, res, next) {
        const t = await sequelize.transaction()
        try {
            const userId = req.user._id;
            const themeId = req.params.themeId;
            const tasksForBank = req.body.tasks;
            const inBank = req.body.inBank;
            if (req.user.role === 'USER') {
                await t.rollback()
                return next(ApiError.badRequest('Обычный пользователь не может допускать задачи в БЗ'))
            }
            if (tasksForBank.length === 0) {
                await t.rollback();
                return next(ApiError.badRequest('Задачи не выбраны'))
            }
            for (let i = 0; i < tasksForBank.length; i++) {
                let currentTask = await Task.findByPk(tasksForBank[i], {transaction: t})
                if (!currentTask) {
                    await t.rollback()
                    return next(ApiError.badRequest(`Задачи #${tasksForBank[i]} нет`))
                }
                if (currentTask.inBank === true || currentTask.inBank === false) {
                    await t.rollback();
                    return next(ApiError.badRequest(`Задача #${tasksForBank[i]} уже была ${currentTask.inBank ? 'допущена' : 'не допущена'}`))
                }
                const currentTaskRating = await TaskRating.findAll({
                    where: {
                        taskId: tasksForBank[i],
                        isAdmin: false
                    }
                }, {transaction: t, raw: true})
                const currentTaskRatingAdmin = await TaskRating.findAll({
                    where: {
                        taskId: tasksForBank[i],
                        isAdmin: true
                    }
                }, {transaction: t, raw: true})

                for (const element of currentTaskRatingAdmin) {
                    await TaskRating.update({verified: true}, {where: {_id: element._id}, transaction: t})
                }


                if (currentTaskRating.length === 0 && currentTaskRatingAdmin.length === 0) {
                    await t.rollback();
                    return next(ApiError.badRequest(`Задача ${tasksForBank[i]} не имеет оценок. Подождите появления новых, или оцените сами`))
                } else {
                    await Task.update({inBank}, {where: {_id: tasksForBank[i]}, transaction: t})
                    const {
                        taskCreation,
                        taskEvaluation
                    } = (await DifficultyLevelsOfTheme.findByPk(themeId, {transaction: t}));

                    if (currentTaskRating.length >= 3) {
                        let goodScores = dixonCriterion(currentTaskRating.map(item => {
                            return {id: item._id, value: item.rating}
                        }))

                        for (let element of currentTaskRating) {

                            const isGood = goodScores.some(item => item.id === element._id);
                            if (currentTaskRating.length < 3) {
                                for (let j = 0; j < currentTaskRating.length; j++) {
                                    if (currentTaskRating[j].verified === null) {
                                        await TaskRating.update({verified: true}, {
                                            where: {_id: currentTaskRating[j]._id},
                                            transaction: t
                                        })
                                    }
                                }
                            }
                            await TaskRating.update({verified: isGood}, {where: {_id: element._id}, transaction: t})


                            const currentSolution = await Solution.findOne({
                                where: {
                                    userId: element.userId,
                                    taskId: element.taskId
                                }
                            }, {transaction: t})

                            const score = isGood
                                ? taskEvaluation
                                : currentSolution.verified ? (taskEvaluation / 2).toFixed(2) : 0;
                            const rating = convertScoreToRating(score, taskEvaluation)
                            const scoreIdEvaluation = (await Scores.create({
                                score,
                                rating,
                                userId: element.userId
                            }, {transaction: t}))._id;
                            await TaskEvaluationScore.create({
                                scoreId: scoreIdEvaluation,
                                taskRatingId: element._id
                            }, {transaction: t})
                        }
                    }

                    let ratingUser;
                    if (currentTaskRating.length !== 0)
                        ratingUser = currentTaskRating.length > 1 ? median(currentTaskRating.map(item => item.rating)) : currentTaskRating[0].rating
                    let ratingAdmin
                    if (currentTaskRatingAdmin.length !== 0)
                        ratingAdmin = currentTaskRatingAdmin.length > 1 ? median(currentTaskRatingAdmin.map(item => item.rating)) : currentTaskRatingAdmin[0].rating

                    let resultRating;


                    if (currentTaskRatingAdmin.length === 0) {
                        resultRating = ratingUser
                    } else if (currentTaskRating.length === 0) {
                        resultRating = ratingAdmin
                    } else {
                        resultRating = (ratingUser + ratingAdmin) / 2
                    }

                    const scoreIdCreation = (await Scores.create({
                        score: convertRatingToScore(resultRating, taskCreation),
                        rating: resultRating,
                        userId: currentTask.userId
                    }, {transaction: t}))._id
                    await TaskCreationScore.create({
                        taskId: currentTask._id,
                        scoreId: scoreIdCreation
                    }, {transaction: t})
                }
            }
            await t.commit()
            return res.json({})
        } catch (error) {
            await t.rollback();
            return next(ApiError.badRequest(error))
        }
    }
}

function median(arr) {
    arr.sort((a, b) => a - b);
    let mid = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
}

const getCriticalValue = (n, q = 0.1) => {
    const qValues = [0.1, 0.05, 0.02, 0.01]
    if (!qValues.includes(q)) {
        return 'Неверный уровень значимости q'
    }
    if (n < 3 || n > 25) {
        return 'Не верное количество n'
    }
    const index = qValues.indexOf(q)
    const table =
        [
            [0.886, 0.941, 0.976, 0.988],
            [0.679, 0.765, 0.846, 0.899],
            [0.557, 0.642, 0.729, 0.780],
            [0.482, 0.560, 0.644, 0.698],
            [0.434, 0.507, 0.586, 0.637],
            [0.479, 0.554, 0.631, 0.683],
            [0.441, 0.512, 0.587, 0.636],
            [0.409, 0.477, 0.551, 0.597],
            [0.517, 0.576, 0.538, 0.679],
            [0.490, 0.546, 0.605, 0.642],
            [0.467, 0.521, 0.578, 0.615],
            [0.462, 0.546, 0.602, 0.641],
            [0.472, 0.525, 0.579, 0.616],
            [0.452, 0.507, 0.559, 0.595],
            [0.438, 0.490, 0.542, 0.577],
            [0.424, 0.475, 0.527, 0.561],
            [0.412, 0.462, 0.514, 0.547],
            [0.401, 0.450, 0.502, 0.535],
            [0.391, 0.440, 0.491, 0.524],
            [0.382, 0.430, 0.481, 0.514],
            [0.374, 0.421, 0.472, 0.505],
            [0.367, 0.413, 0.464, 0.497],
            [0.360, 0.406, 0.457, 0.489],
        ]

    return table[n - 3][index]
}
const dixonCriterion = (scores) => {
    scores.sort((a, b) => a.value - b.value);

    let n = scores.length;
    if (n < 3 || n > 25) return false;
    let criticalValue = getCriticalValue(n)

    let currentValueMin, currentValueMax;
    let indexes1 = [], indexes2 = [];
    if (n >= 3 && n <= 7) {
        indexes1 = [2, 1, n, 1];
        indexes2 = [n, n - 1, n, 1];
    } else if (n >= 8 && n <= 10) {
        indexes1 = [2, 1, n - 1, 1];
        indexes2 = [n, n - 1, n, 2];
    } else if (n >= 11 && n <= 13) {
        indexes1 = [3, 1, n - 1, 1];
        indexes2 = [n, n - 2, n, 2];
    } else if (n >= 14 && n <= 25) {
        indexes1 = [3, 1, n - 2, 1];
        indexes2 = [n, n - 2, n, 3];
    }
    let tempFunc = (temp) => (scores[temp[0] - 1].value - scores[temp[1] - 1].value)
        / (scores[temp[2] - 1].value - scores[temp[3] - 1].value);
    currentValueMin = tempFunc(indexes1)
    currentValueMax = tempFunc(indexes2)
    let temp = false;
    if (currentValueMin > criticalValue) {
        scores.splice(0, 1);
    }
    if (currentValueMax > criticalValue) {
        scores.splice(scores.length - 1, 1);
    }

    return scores
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
            query.where = {themeId, inBank: true, userId: {[Op.not]: userId}}
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
                userId: {[Op.not]: userId},
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
            };
            query.include.push({
                model: Solution,
                where: {finished: false, userId},
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

            if (isFinished) {
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
                    themeId, userId
                };
            }
        }
    } else if (section === 'admission-to-bank') {

        if (category === 'all') {
            query.where = {
                themeId,
                inBank: null,
                verified: true,
            };
            query.include.push({
                model: Solution,
                where: {finished: true},
                attributes: []
            })
            query.include.push({
                model: TaskRating,
                attributes: ['rating'],
                separate: true,
            })

            query.order = [['_id', 'DESC']];

        } else if (category === 'accepted') {
            query.where = {
                themeId,
                inBank: true,
                verified: true,
            };
            query.order = [['updatedAt', 'DESC']];
        } else if (category === 'not-accepted') {
            query.where = {
                themeId,
                inBank: false,
            };
            query.order = [['updatedAt', 'DESC']];
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
    }],
};
