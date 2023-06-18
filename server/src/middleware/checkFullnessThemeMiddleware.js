import {DifficultyLevelsOfTheme, Module, Test, Theme} from "../models/models.js";
import ApiError from "../error/ApiError.js";

export default async function (req, res, next) {

    try {
        const {themeId} = req.params;
        const currentTheme = await Theme.findByPk(themeId)

        if (!currentTheme.isAvailable) {
            const currentDifficultyLevelsOfTheme = await DifficultyLevelsOfTheme.findOne({where: {themeId}});
            const currentTest = await Test.findOne({where: {themeId}})

            if (!currentTest) {
                return next(ApiError.badRequest(`Отсутствует тест по теме`))
            }
            if (!currentTest.isAvailable) {
                return next(ApiError.badRequest(`Тест не допущен`))
            }


            if (currentDifficultyLevelsOfTheme.testSolution === 0) {
                return next(ApiError.badRequest(`Не указаны баллы за решение теста`))
            }
            if (currentTheme.numEvaluationTasks === 0 ^ currentTheme.numCreateTasks === 0) {
                if (currentTheme.numEvaluationTasks === 0)
                    return next(ApiError.badRequest(`Не указаны баллы за решение теста`))
                else return next(ApiError.badRequest(`Необходимо указать минимальное кол-во созданных задач`))
            }
            if (currentTheme.numCreateTasks > 0 && currentTheme.sqlCommands.length === 0) {
                return next(ApiError.badRequest(`Необходимо указать комманды SQL`))
            }
            if ((currentTheme.numCreateTasks > 0 && currentDifficultyLevelsOfTheme.taskSolution === 0)) {
                return next(ApiError.badRequest(`Необходимо указать максимальный балл за решение задачи из БЗ`))
            }
            if ((currentTheme.numCreateTasks > 0 && currentDifficultyLevelsOfTheme.taskCreation === 0)) {
                return next(ApiError.badRequest(`Необходимо указать максимальный балл за создание задачи`))
            }
            if ((currentTheme.numCreateTasks > 0 && currentDifficultyLevelsOfTheme.taskEvaluation === 0)) {
                return next(ApiError.badRequest(`Необходимо указать максимальный балл за оценку задачи`))
            }
        }
        next()
    } catch (error) {
        return next(ApiError.badRequest(error.message))
    }
};