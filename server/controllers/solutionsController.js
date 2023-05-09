import {consoleError, consoleMessage} from '../customMessageConsole.js'
import {Tasks, Solutions, Users, SolutionLikes, SolutionComments} from '../models/models.js';
import ApiError from '../error/ApiError.js';
import {executeQuery} from '../init-user-dbs.js'

export default class SolutionsController {

    async getSolutions(req, res, next) {
        try {
            const {task_id} = req.params;

            //const { limit, offset } = req.pagination;
            consoleMessage(`ПОЛУЧИТЬ ВСЕ РЕШЕНИЯ ЗАДАЧИ №${task_id}`)
            const userId = req.user._id;

            let isAuthor = await Tasks.findOne({where: {_id: task_id, userId}})
            let userSolution = isAuthor || (await Solutions.findOne({where: {taskId: task_id, userId, verified: true}}));

            if (!userSolution) {
                return next(ApiError.forbidden(`Вам не разрешено просматривать решения задачи №${task_id}`));
            }
            let solutions = await Solutions.findAll({
                where: {taskId: task_id}, ...queryOptions
            });

            let result = await Promise.all(solutions.map(async (el) => {
                let temp = el.toJSON();
                let tempSolutionId = temp._id;
                let like = await SolutionLikes.findOne({where:{solutionId: tempSolutionId, userId}});
                let likes = await SolutionLikes.findAll({where:{solutionId: tempSolutionId}});
                temp.like = {isLiked: !!like, likeCount: likes.length};
                return temp;
            }));

            //let json = JSON.stringify(result);


            console.log(result)
            res.json(result);

        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async createSolutionTask(req, res, next) {
        try {
            const {task_id} = req.params;
            const userId = req.user._id;
            let userSolution = await Solutions.findOne({where: {taskId: task_id, userId}})
            if (!userSolution) {
                let task = await Tasks.findOne({where: {_id: task_id}});

                consoleError(task.userId === userId)
                userSolution = await Solutions.create({userId, taskId: task_id, is_author: task.userId === userId});

            }
            return res.json({solutionId: userSolution._id})
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async updateSolutionTask(req, res, next) {
        try {
            const {solution_id} = req.params;
            const {code} = req.body;
            const userId = req.user._id;
            consoleError(solution_id)
            consoleError(code)
            consoleError(userId)
            let userSolution = (await Solutions.findByPk(solution_id));

            let isUserSolution = await Solutions.findOne({where: {_id: solution_id, userId}})
            if (isUserSolution) {

                let task = await Tasks.findByPk(userSolution.taskId)
                if (userSolution.is_author) {
                    try {
                        let rows = await executeQuery(code, task.databaseId);
                        await Solutions.update({
                            code, attempts: ++userSolution.attempts, verified: true
                        }, {where: {_id: userSolution._id}});
                        await Tasks.update({verified: true}, {where: {_id: task._id}})
                        return res.json({success: true, fields: Object.keys(rows[0]), rows})
                    } catch (error) {
                        await Solutions.update({
                            code, attempts: ++userSolution.attempts, verified: false
                        }, {where: {_id: userSolution._id}});
                        await Tasks.update({verified: false}, {where: {_id: task._id}})
                        return next(ApiError.badRequest(`Ошибка при выполнении запроса: ${(String(error).split('Error: SequelizeDatabaseError:')[1]) || error}`))
                    }
                }

                let rowsUser;
                try {
                    rowsUser = await executeQuery(code, task.databaseId);
                } catch (error) {
                    await Solutions.update({
                        code, attempts: ++userSolution.attempts, verified: false
                    }, {where: {_id: userSolution._id}});
                    return next(ApiError.badRequest(`Ошибка при выполнении запроса: ${(String(error).split('SequelizeDatabaseError:')[1]) || error}`))
                }


                if (!rowsUser[0]) 
                {
                    await Solutions.update({
                        code, attempts: ++userSolution.attempts, verified: false
                    }, {where: {_id: userSolution._id}});
                    return next(ApiError.badRequest(`Пустой набор строк`))
                }


                let solutionAuthor = await Solutions.findOne({where: {taskId: task._id, is_author: true}})
                consoleError(solutionAuthor)
                let rowsAuthor = await executeQuery(solutionAuthor.code, task.databaseId);

                let temp = JSON.stringify(rowsUser) === JSON.stringify(rowsAuthor)
                let taskTemp = await Tasks.findByPk(userSolution.taskId)
                if (taskTemp.description !== '' && taskTemp.databaseId) {
                    await Tasks.update({verified: true}, {where: {_id: taskTemp._id}})
                }
                await Solutions.update({
                    code, attempts: ++userSolution.attempts, verified: temp
                }, {where: {_id: userSolution._id}});
                consoleError(rowsUser[0])
                return res.json({success: temp, fields: Object.keys(rowsUser[0]), rows: rowsUser})
            }
            return next(ApiError.forbidden(`Редактировать решение другого пользователя запрещено`))
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async getOneSolution(req, res, next) {
        try {
            const {solution_id} = req.params;
            const userId = req.user._id;
            let solution = await Solutions.findByPk(solution_id)

            if (solution.userId !== userId) return next(ApiError.forbidden(`Доступ к этому решению разрешен только его создателю`))
            return res.json(solution)
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async likeSolution(req, res, next) {
        const {solution_id} = req.params;
        const userId = req.user._id;

        try {
            const solutionLike = await SolutionLikes.findOne({where: {solutionId: solution_id, userId}})

            if (solutionLike) {
                await SolutionLikes.destroy({where: {solutionId: solution_id, userId}})
                return res.json({isLiked: false})
            } else {
                await SolutionLikes.create({solutionId: solution_id, userId})
                return res.json({isLiked: true})
            }
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async addCommentSolution(req, res, next) {
        try {
            const {solution_id} = req.params;
            const content = req.body.content;
            const userId = req.user._id;
            if (!content || content===' ') return next(ApiError.badRequest(`Комментарий не может быть пустым`))

            const comment = await SolutionComments.create({content, userId, solutionId: solution_id})

            return res.json({id: comment._id})
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }
}

const queryOptions = {
    attributes: {exclude: ['taskId', 'userId']}, include: [{
        model: Users, attributes: ['_id', 'nickname']
    }, {
        model: SolutionComments, attributes: {exclude: ['solutionId', 'userId', 'updatedAt']}, include: [{
            model: Users, attributes: ['_id', 'nickname']
        }]
    }]
};