import {consoleMessage} from '../customMessageConsole.js'
import {Tasks, Solutions, Users, Databases} from '../models/models.js';
import ApiError from '../error/ApiError.js';
import {formatMilliseconds} from '../utils/utils.js'
import {getAllTablesAndColumns} from '../init-user-dbs.js'

export default class TasksController {

    async getTask(task_id) {
        return await Tasks.findByPk(task_id, {
            ...queryOptions
        });
    }

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
        let solution = await Solutions.findOne({where: {taskId: task._id, userId: userId}});
        if(!solution) myProgress = "Не выполнялось"
        else if(solution.verified) myProgress = `Решено`
        else myProgress = "Выполняется"



            return {
                ...(task.toJSON()), solutions: undefined, solutionCount, userCount, averageTime,myProgress
            };


    }

    async getAllTasks(req, res, next) {
        const userId = req.user._id;
        //try {
//const { limit, offset } = req.pagination;
            consoleMessage(`ПОЛУЧИТЬ ВСЕ ЗАДАНИЯ`)

            const tasks = await Tasks.findAll();

            const result = [];
            for (const task of tasks) {
                const fullTask = await this.getTask(task._id);
                const taskWithStats = await this.addTaskStats(fullTask,userId);

                result.push(taskWithStats);
            }
            return result.length ? res.json(result) : next(ApiError.notFound(`Задания не найдены`))
        //} catch (error) {
        //    return next(ApiError.serverError(error.message))
        //}

    }

    async createTask(req, res, next) {
        try {
            const userId = req.user._id;
            let task = await Tasks.create({userId});
            return res.json({task_id: task._id})
        } catch (error) {
            return next(ApiError.serverError(error.message))
        }
    }

    async getOneTask(req, res, next) {
        //try {
            const userId = req.user._id;
            const {task_id} = req.params;
            consoleMessage(`ПОЛУЧИТЬ ЗАДАНИЕ С id=${task_id}`)

            const task = await this.getTask(task_id);
            if (task) {
                const taskWithStats = await this.addTaskStats(task,userId);
                if (req.user._id === task.user._id) {
                    const dbs = await Databases.findAll({attributes: ['_id', 'name']});

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
                return next(ApiError.notFound(`Задание с id=${task_id} не найдено`));
            }

        //} catch (error) {
        //    return next(ApiError.serverError(error.message))
        //}

    }

    async updateTask(req, res, next) {
        //try {
            const {task_id} = req.params;
            const {databaseName, description} = req.body;
            consoleMessage(`ИЗМЕНЕНИЕ ЗАДАНИЯ. databaseName=${databaseName}, description=${description}`)

            if (databaseName && !await Databases.findOne({where: {name: databaseName}})) return next(ApiError.badRequest(`БД \"${databaseName}\" несуществует`));
            if (!description) return next(ApiError.badRequest(`Описание задания не введено`))

            if(databaseName)
            {
                let databaseId = (await Databases.findOne({where: {name: databaseName}}))._id
                await Tasks.update({databaseId, description, verified: false}, {where: {_id: task_id}});
            }
            else
            {
                await Tasks.update({databaseId: null,description, verified: false}, {where: {_id: task_id}});
            }


            //res.redirect(`/sql-crowd-api/tasks/${task_id}`);
            return res.json({message: `Задача №${task_id} успешно изменена`})
        //} catch (error) {
        //    return next(ApiError.serverError(error.message))
        //}

    }
}

const queryOptions = {
    attributes: ['_id', 'description', 'createdAt', 'updatedAt','verified'], include: [{
        model: Solutions, attributes: ['_id', 'createdAt', 'updatedAt', 'verified'], include: [{
            model: Users, attributes: ['_id']
        }]
    }, {
        model: Users, attributes: ['_id', 'nickname']
    }, {
        model: Databases, attributes: ['_id', 'name']
    }]
};