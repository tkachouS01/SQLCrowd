import {consoleError, consoleMessage} from '../customMessageConsole.js'
import {Task, Solution, User, SolutionLike, SolutionComment} from '../models/models.js';
import ApiError from '../error/ApiError.js';
import {executeQuery} from '../init-user-dbs.js'
import {raw} from "express";

export default class SolutionsController {

    async getSolutions(req, res, next) {
        try {
            const {task_id} = req.params;

            //const { limit, offset } = req.pagination;
            consoleMessage(`ПОЛУЧИТЬ ВСЕ РЕШЕНИЯ ЗАДАЧИ №${task_id}`)
            const userId = req.user.id;

            let isAuthor = await Task.findOne({where: {id: task_id, userId}})
            let userSolution = isAuthor || (await Solution.findOne({where: {taskId: task_id, userId, verified: true}}));

            if (!userSolution) {
                return next(ApiError.forbidden(`Вам не разрешено просматривать решения задачи №${task_id}`));
            }
            let solutions = await Solution.findAll({
                where: {taskId: task_id}, ...queryOptions
            });

            let result = await Promise.all(solutions.map(async (el) => {
                let temp = el.toJSON();
                let tempSolutionId = temp.id;
                let like = await SolutionLike.findOne({where:{solutionId: tempSolutionId, userId}});
                let likes = await SolutionLike.findAll({where:{solutionId: tempSolutionId}});
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
            const userId = req.user.id;
            let userSolution = await Solution.findOne({where: {taskId: task_id, userId}})
            if (!userSolution) {
                let task = await Task.findOne({where: {id: task_id}});

                consoleError(task.userId === userId)
                userSolution = await Solution.create({userId, taskId: task_id, is_author: task.userId === userId});

            }
            return res.json({solutionId: userSolution.id})
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async updateSolutionTask(req, res, next) {
        try {
            const {solution_id} = req.params;
            const {code} = req.body;
            const userId = req.user.id;
            consoleError(solution_id)
            consoleError(code)
            consoleError(userId)
            let userSolution = (await Solution.findByPk(solution_id));

            let isUserSolution = await Solution.findOne({where: {id: solution_id, userId}})
            if (isUserSolution) {

                let task = await Task.findByPk(userSolution.taskId)
                if (userSolution.is_author) {
                    try {
                        let rows = await executeQuery(code, task.databaseId);
                        await Solution.update({
                            code, attempts: ++userSolution.attempts, verified: true
                        }, {where: {id: userSolution.id}});
                        await Task.update({verified: true}, {where: {id: task.id}})
                        return res.json({success: true, fields: Object.keys(rows[0]), rows})
                    } catch (error) {
                        await Solution.update({
                            code, attempts: ++userSolution.attempts, verified: false
                        }, {where: {id: userSolution.id}});
                        await Task.update({verified: false}, {where: {id: task.id}})
                        return next(ApiError.badRequest(`Ошибка при выполнении запроса: ${(String(error).split('Error: SequelizeDatabaseError:')[1]) || error}`))
                    }
                }

                let rowsUser;
                try {
                    rowsUser = await executeQuery(code, task.databaseId);
                } catch (error) {
                    return next(ApiError.badRequest(`Ошибка при выполнении запроса: ${(String(error).split('SequelizeDatabaseError:')[1]) || error}`))
                }


                if (!rowsUser[0]) return next(ApiError.badRequest(`Пустой набор строк`))


                let solutionAuthor = await Solution.findOne({where: {taskId: task.id, is_author: true}})
                consoleError(solutionAuthor)
                let rowsAuthor = await executeQuery(solutionAuthor.code, task.databaseId);

                let temp = JSON.stringify(rowsUser) === JSON.stringify(rowsAuthor)
                let taskTemp = await Task.findByPk(userSolution.taskId)
                if (taskTemp.description !== '' && taskTemp.databaseId) {
                    await Task.update({verified: true}, {where: {id: taskTemp.id}})
                }
                await Solution.update({
                    code, attempts: ++userSolution.attempts, verified: temp
                }, {where: {id: userSolution.id}});
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
            const userId = req.user.id;
            let solution = await Solution.findByPk(solution_id)

            if (solution.userId !== userId) return next(ApiError.forbidden(`Доступ к этому решению разрешен только его создателю`))
            return res.json(solution)
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async likeSolution(req, res, next) {
        const {solution_id} = req.params;
        const userId = req.user.id;

        try {
            const solutionLike = await SolutionLike.findOne({where: {solutionId: solution_id, userId}})

            if (solutionLike) {
                await SolutionLike.destroy({where: {solutionId: solution_id, userId}})
                return res.json({isLiked: false})
            } else {
                await SolutionLike.create({solutionId: solution_id, userId})
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
            const userId = req.user.id;
            if (!content) return next(ApiError.badRequest(`Комментарий не может быть пустым`))

            const comment = await SolutionComment.create({content, userId, solutionId: solution_id})

            return res.json({id: comment.id})
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }
}

const queryOptions = {
    attributes: {exclude: ['taskId', 'userId']}, include: [{
        model: User, attributes: ['id', 'nickname']
    }, {
        model: SolutionComment, attributes: {exclude: ['solutionId', 'userId', 'updatedAt']}, include: [{
            model: User, attributes: ['id', 'nickname']
        }]
    }]
};