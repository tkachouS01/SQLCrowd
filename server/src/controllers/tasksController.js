import {consoleMessage} from '../customMessageConsole.js'
import ApiError from '../error/ApiError.js';
import {formatMilliseconds} from '../utils/utils.js'
import {getAllTablesAndColumns} from '../init-user-dbs.js'
import {Database, Solution, Task, User} from "../models/models.js";

export default class TasksController {

    async addTaskStats(task,userId) {
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
        if(!solution) myProgress = "Не выполнялось"
        else if(solution.verified) myProgress = `Решено`
        else myProgress = "Выполняется"



        return {
            ...(task.toJSON()), solutions: undefined, solutionCount, userCount, averageTime,myProgress
        };


    }

    async getAllTasks(req, res, next) {
        const userId = req.user._id;
        const themeId = req.params.themeId;
        //try {

        consoleMessage(`ПОЛУЧИТЬ ВСЕ ЗАДАНИЯ`)

        const result = await Task.findAll({
            where: {themeId, inBank: true},
            attributes: ['_id','description'],
            include: [{
                model: User,
                attributes: ['_id','nickname','role']
            }]
        });

        return res.json(result)
        //} catch (error) {
        //    return next(ApiError.serverError(error.message))
        //}

    }

    async createTask(req, res, next) {
        try {
            const userId = req.user._id;
            let task = await Task.create({userId});
            return res.json({task_id: task._id})
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async getOneTask(req, res, next) {
        //try {
        const userId = req.user._id;
        const taskId = req.params.taskId;
        consoleMessage(`ПОЛУЧИТЬ ЗАДАНИЕ С id=${taskId}`)

        const task = await Task.findByPk(taskId, {
            ...queryOptions
        });
        if (task) {
            const taskWithStats = await this.addTaskStats(task,userId);
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

        //} catch (error) {
        //    return next(ApiError.serverError(error.message))
        //}

    }

    async updateTask(req, res, next) {
        //try {
        const userId = req.user._id;
        const taskId = req.params.taskId;
        const {databaseName, description} = req.body;
        consoleMessage(`ИЗМЕНЕНИЕ ЗАДАНИЯ. databaseName=${databaseName}, description=${description}`)

        if (databaseName && !await Database.findOne({where: {name: databaseName}})) return next(ApiError.badRequest(`БД \"${databaseName}\" несуществует`));
        if (!description) return next(ApiError.badRequest(`Описание задания не введено`))

        if(databaseName)
        {
            let databaseId = (await Database.findOne({where: {name: databaseName}}))._id
            await Task.update({databaseId, description, verified: false}, {where: {_id: taskId}});
        }
        else
        {
            await Task.update({databaseId: null,description, verified: false}, {where: {_id: taskId}});
        }

        const task = await Task.findByPk(taskId, {
            ...queryOptions
        });
        const result = await this.addTaskStats(task,userId)
        //res.redirect(`/sql-crowd-api/tasks/${task_id}`);
        return res.json(result)
        //} catch (error) {
        //    return next(ApiError.serverError(error.message))
        //}

    }
}

const queryOptions = {
    attributes: ['_id', 'description', 'createdAt', 'updatedAt','verified'], include: [{
        model: Solution, attributes: ['_id', 'createdAt', 'updatedAt', 'verified'], include: [{
            model: User, attributes: ['_id']
        }]
    }, {
        model: User, attributes: ['_id', 'nickname']
    }, {
        model: Database, attributes: ['_id', 'name']
    }]
};