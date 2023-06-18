import {
    Database,
    Scores, Solution, Task, TaskCreationScore, TaskEvaluationScore,
    TaskRating, TaskSolutionScore,
    User,
    UserTestScore
} from "../models/models.js";
import {consoleMessage} from "../customMessageConsole.js";
import {Op} from "sequelize";

export default class RatingController {
    async getRating(req, res, next) {
        let result;
        let users;
        if ('userId' in req.query) {
            users = await User.findAll({
                attributes: ['_id', 'nickname', 'role'],
                where: {_id: req.query.userId},
                raw: true
            })
        } else {
            users = await User.findAll({
                attributes: ['_id', 'nickname', 'role'],
                order: [['_id', 'ASC']],
                raw: true
            })
        }

        result = users
        let i = 0
        for (let user of users) {
            let tasksInBankValues = await Task.findAll({
                where: {userId: user._id, inBank: true},
                attributes: {exclude: ['inBank','userId','databaseId','verified']},
                include: [
                    {
                        model: Solution,
                        attributes:['_id']
                    },
                    {
                        model: TaskCreationScore,
                        attributes: ['updatedAt'],
                        include: {
                            model: Scores,
                            attributes: ['score','rating']
                        }
                    },
                    {
                        model: Database,
                        attributes: ['name']
                    }
                ]
            })
            let solutionsFromBankValues = await Task.findAll({
                where: {
                    inBank: true,
                    userId: {[Op.not]: user._id},
                    '$solutions.userId$': user._id,
                },
                attributes: {exclude: ['inBank','userId','databaseId','verified','createdAt','updatedAt']},
                include: [
                    {
                        model: Solution,
                        where: {verified: true, userId: user._id, isAuthor:false},
                        attributes: ['createdAt','updatedAt','_id'],
                        include:{
                            model: TaskSolutionScore,
                            attributes: ['updatedAt'],
                            include: {
                                model: Scores,
                                attributes: ['score','rating']
                            }
                        },
                    },
                    {
                        model: Database,
                        attributes: ['name']
                    }
                ]
            })
            let tasksCreatedValues = await Task.findAll({
                where: {userId: user._id},
                include: {
                    model: Solution,
                    attributes: [],
                    where: {finished: true}
                }
            })
            let tasksEvaluatedValues = (await Task.findAll({
                where: {userId: user._id},
                attributes: [],
                include: [
                    {
                        model: TaskRating,
                        attributes: ['rating', 'taskId','verified', 'createdAt'],
                        //required: true,
                        include: [
                            {
                                model: Task,
                                attributes: ['_id', 'description'],
                                include: {
                                    model: Database,
                                    attributes: ['name']
                                }
                            },
                            {
                                model: TaskEvaluationScore,
                                attributes: ['createdAt'],
                                include: {
                                    model: Scores,
                                    attributes: ['score','rating']
                                }
                            }
                        ]
                    }
                ],raw:true

            }))
            console.log(tasksEvaluatedValues)
            let scoresValues = await Scores.findAll({
                where: {userId: user._id},
                attributes: ['score'],
                raw: true
            })

            if ('userId' in req.query) {
                result[i].tasksInBankValues = tasksInBankValues
                result[i].solutionsFromBankValues = solutionsFromBankValues
                result[i].tasksCreatedValues = tasksCreatedValues
                result[i].tasksEvaluatedValues = tasksEvaluatedValues
            } else {

            }
            result[i].tasksInBank = tasksInBankValues.length
            result[i].solutionsFromBank = solutionsFromBankValues.length
            result[i].tasksCreated = tasksCreatedValues.length
            result[i].tasksEvaluated = tasksEvaluatedValues.length
            result[i].scores = scoresValues.reduce((accum, item) => accum + item.score, 0)
            result[i].averageRating = (await Scores.findAll({
                where: {userId: user._id},
                attributes: ['rating'],
                raw: true
            })).reduce((accum, item, _, array) => accum + (item.rating) / array.length, 0)
            result[i].currentRating = (await UserTestScore.findAll({
                attributes: [],
                include: {
                    model: Scores,
                    attributes: ['rating'],
                    where: {userId: user._id}
                }
            })).reduce((accum, item, _, array) => accum + (item.score.rating) / array.length, 0)
            result[i].sameRating = 5;

            i++;
        }
        return res.json(result);
    }
}