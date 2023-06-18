import {
    DifficultyLevelsOfTheme,
    Scores,
    Test,
    UserTestAnswer,
    Theme,
    User,
    UserTestScore
} from "../models/models.js";
import ApiError from "../error/ApiError.js";
import sequelize from "../db.js";
import {convertScoreToRating} from "../utils/utils.js";

function calculateScore(selectedAnswers, currentAnswers, score) {
    return selectedAnswers.reduce((totalScore, item, i) => {
        if (item.length === 0) {
            return totalScore;
        }
        const correctCount = item.filter(answer => currentAnswers[i].includes(answer)).length;
        const incorrectCount = item.length - correctCount;
        if (incorrectCount > 0 || correctCount < currentAnswers[i].length - 1) {
            return totalScore;
        } else if (correctCount === currentAnswers[i].length - 1) {
            return totalScore + score / 2;
        } else {
            return totalScore + score;
        }
    }, 0);
}

function calculateFinalGradeAndScore(selectedAnswers, currentAnswers, score) {
    const currentScore = calculateScore(selectedAnswers, currentAnswers, score);
    const maxScore = currentAnswers.length * score;
    return {currentScore, maxScore};
}

export default class TestController {
    async addAnswer(req, res, next) {
        const {themeId} = req.params;
        const userId = req.user._id;
        const {selectedAnswers} = req.body;
        const test = await Test.findByPk(themeId);

        const difficultyLevelsOfTheme = await DifficultyLevelsOfTheme.findByPk(themeId);
        const t = await sequelize.transaction()
        try {
            const answer = await UserTestAnswer.create({
                userId: userId,
                testId: themeId,
                selectedAnswers
            }, {transaction: t})
            let {currentScore, maxScore} =
                calculateFinalGradeAndScore(selectedAnswers, test.correctAnswers, difficultyLevelsOfTheme.testSolution);

            const score = await Scores.create({
                userId: userId,
                score: currentScore,
                rating: convertScoreToRating(currentScore, maxScore),

            }, {transaction: t})
            await UserTestScore.create({
                userTestAnswerId: answer._id,
                scoreId: score._id,
            }, {transaction: t})
            await t.commit()
            return res.json({totalScore: currentScore, rating: convertScoreToRating(currentScore, maxScore)})
        } catch (error) {
            await t.rollback()
            return next(ApiError.badRequest(error))
        }
    }

    async getInfoAboutTest(req, res, next) {
        const userId = req.user._id;
        const {themeId} = req.params;
        const result = await Test.findByPk(themeId, {
            attributes: [
                'isAvailable',
                'createdAt',
                'updatedAt',
                [sequelize.fn('array_length', sequelize.col('questions'), 1), 'questionsCount']
            ],
            include: [
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
                    model: Theme,
                    attributes: ['_id', 'name'],
                    include: [
                        {
                            model: DifficultyLevelsOfTheme,
                            attributes: ['testSolution']
                        }
                    ]
                },
                {
                    model: UserTestAnswer,
                    where: {userId},
                    separate: true,
                    attributes: {
                        exclude: ['testId', 'updatedAt', 'userId', '_id', 'selectedAnswers']
                    },
                    include: [
                        {
                            model: UserTestScore,
                            attributes: {
                                exclude: ['testId', 'createdAt', 'userId', '_id', 'scoreId', 'userTestAnswerId']
                            },
                            include: [
                                {
                                    model: Scores,
                                    attributes: ['score', 'rating']
                                }
                            ]
                        }
                    ]
                }
            ]
        });


        return res.json(result)
    }

    async getOneTest(req, res, next) {
        try {
            const userId = req.user._id;
            const {themeId} = req.params;

            let attr = ['questions', 'answers'];

            const curTest = await UserTestAnswer.findOne({where: {testId: themeId, userId}})


            if (req.user.role === 'ADMIN' || curTest) {
                attr.push('correctAnswers');
            }
            const result = await Test.findByPk(
                themeId,
                {
                    attributes: [...attr], raw: true
                }
            )

            return res.json({
                result: {...result, answers: result.answers.map(item => item.sort(() => Math.random() - 0.5))},
                selectedAnswers: curTest ? ('selectedAnswers' in curTest ? curTest.selectedAnswers : undefined) : undefined
            })
        } catch (error) {
            return res.json([])
        }
    }

    async getOneResultTest(req, res, next) {
        try {
            const {userId} = req.user;
            const {themeId} = req.params;
            const result = await Test.findByPk(
                themeId,
                {
                    attributes: [
                        'questions',
                        'answers'
                    ],
                }
            )
            return res.json(result)
        } catch (error) {
            return res.json([])
        }
    }

    async updateTest(req, res, next) {
        const adminId = req.user._id;
        const {questions, answers, correctAnswers} = req.body;
        const {themeId} = req.params;
        const t = await sequelize.transaction()
        try {
            await Test.update(
                {
                    questions,
                    answers,
                    correctAnswers,
                    isAvailable: false,
                    updatedByUserId: adminId
                },
                {where: {_id: themeId}, transaction: t},
            )

            const result = await Test.findByPk(
                themeId,
                {
                    attributes: [
                        'isAvailable', 'updatedAt',
                        [sequelize.fn('array_length', sequelize.col('questions'), 1), 'questionsCount']
                    ],
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

    async makeAvailableTest(req, res, next) {
        const t = await sequelize.transaction()
        try {
            const adminId = req.user._id;
            const {themeId} = req.params;
            const currentTest = (await Test.findByPk(themeId, {transaction: t})).get({plain: true})

            if (currentTest.isAvailable) {
                await Test.update(
                    {isAvailable: false, updatedByUserId: adminId},
                    {where: {_id: themeId}, transaction: t}
                )
                const result = await Test.findByPk(
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
            }

            if (currentTest.questions.length === 0) {
                await t.rollback()
                return next(ApiError.badRequest(`Вопросов нет`))
            }

            let temp = [];
            currentTest.questions.forEach((item, index) => {

                if (item.trim() === '') {
                    temp.push(index + 1)
                }
            })
            if (temp.length !== 0) {
                await t.rollback()
                return next(ApiError.badRequest(`Названия вопросов (${temp.join(', ')}) некорректное`))
            }

            currentTest.answers.forEach((item, index) => {

                if (item.length === 0) {
                    temp.push(index + 1)
                }
            })
            if (temp.length !== 0) {
                await t.rollback()
                return next(ApiError.badRequest(`Отсутствуют варианты ответов в вопросах (${temp.join(', ')})`))
            }

            currentTest.answers.forEach((item, index) => {
                item.forEach((item2, index2) => {
                    if (item2.trim() === '') {
                        temp.push(index + 1)
                    }
                })
            })
            temp = [...new Set(temp)].sort();
            if (temp.length !== 0) {
                await t.rollback()
                return next(ApiError.badRequest(`В вопросах (${temp.join(', ')}) есть пустые варианты ответов`))
            }


            currentTest.correctAnswers.forEach((item, index) => {

                if (item.length === 0) {
                    temp.push(index + 1)
                }
            })
            if (temp.length !== 0) {
                await t.rollback()
                return next(ApiError.badRequest(`Не указаны правильные варианты ответов в вопросах (${temp.join(', ')})`))
            }


            currentTest.answers.forEach((item, index) => {
                let duplicate = [...new Set(item.filter((item2, index2) => item.indexOf(item2) !== index2))]
                if (duplicate.length !== 0) {
                    temp.push(`[#${index + 1}: ${duplicate.join(', ')}]`)
                }
            })
            if (temp.length !== 0) {
                await t.rollback()
                return next(ApiError.badRequest(`Дублирование вариантов ответов в вопросах: (${temp.join(', ')})`))
            }


            await Test.update(
                {isAvailable: true, updatedByUserId: adminId},
                {where: {_id: themeId}, transaction: t},
            )
            const result = await Test.findByPk(
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