import {$authHost} from "./httpMain";
import {check} from "./authAPI";

const baseUrlApi = 'http://localhost:5000/sql-crowd-api'

export const getInfoAboutTest = async (contextUser, contextTest, themeId) => {
    let result = false;

    await check(contextUser);


    await $authHost.get(`${baseUrlApi}/modules/${null}/themes/${themeId}/test/about-test`)
        .then(data => {
            contextTest.setTestInfo(data.data)

            result = true;
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })


    return result;
}

export const getOneTest = async (contextUser, contextTest, themeId) => {
    let result = false;

    await check(contextUser);


    await $authHost.get(`${baseUrlApi}/modules/${null}/themes/${themeId}/test`)
        .then(data => {

            contextTest.setAllQuestions(data.data.result.questions)
            contextTest.setAllAnswers(data.data.result.answers)
            let temp;
            if (contextUser.user.role === 'ADMIN') {
                temp = data.data.result.correctAnswers
            } else if (contextTest.testInfo.user_test_answers.length !== 0) {
                temp = data.data.selectedAnswers;
            } else {
                temp = (new Array(data.data.result.questions.length)).fill([]);
            }
            contextTest.setSelectedAnswers(temp)
            contextTest.setCurrentQuestionIndex(data.data.result.questions.length === 0 ? null : 0)
            contextTest.setCorrectAnswers(data.data.result.correctAnswers)
            result = true;
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })


    return result;
}

export const addAnswerTest = async (contextUser, contextTest, themeId) => {
    let result = false;

    await check(contextUser);

    await $authHost.post(`${baseUrlApi}/modules/${null}/themes/${themeId}/test`, {selectedAnswers: contextTest.selectedAnswers})
        .then(data => {
            result = true
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })


    return result;
}

export const updateTest = async (contextUser, contextTest, themeId) => {
    let result = false;

    await check(contextUser);


    await $authHost.patch(`${baseUrlApi}/modules/${null}/themes/${themeId}/test`,
        {
            questions: contextTest.allQuestions,
            answers: contextTest.allAnswers,
            correctAnswers: contextTest.selectedAnswers
        })
        .then(data => {
            result = true;
            contextTest.setTestInfo({
                ...contextTest.testInfo,
                questionsCount: data.data.questionsCount,
                updatedBy: data.data.updatedBy
            })
            contextUser.setErrorMessage(200, `Тест обновлен`)
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)

        })


    return result;
}

export const makeAvailableTest = async (contextUser, contextTest, themeId) => {
    let result = false;

    await check(contextUser);


    await $authHost.patch(`${baseUrlApi}/modules/${null}/themes/${themeId}/test/make-available`)
        .then(data => {
            result = true;
            contextTest.setTestInfo({
                ...contextTest.testInfo,
                updatedAt: data.data.updatedAt,
                updatedBy: data.data.updatedBy,
                isAvailable: data.data.isAvailable
            })
            contextUser.setErrorMessage(200,
                `Текст в теме #${themeId} теперь ${data.data.isAvailable
                    ? `доступен`
                    : 'НЕ доступен'} для пользователей`
            )
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })


    return result;
}