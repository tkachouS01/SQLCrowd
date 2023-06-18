import {$authHost} from "./httpMain";
import {check} from "./authAPI";

const baseUrlApi = 'http://localhost:5000/sql-crowd-api'

export const getAllThemes = async (contextUser, contextModule, contextTheme, moduleId) => {
    if (contextTheme.themes.length >= moduleId) return true;
    let result = false;

    await check(contextUser);


    await $authHost.get(`${baseUrlApi}/modules/${moduleId}/themes`)
        .then(data => {
            let temp = [...contextTheme.themes.slice(0, moduleId - 1), data.data, ...contextTheme.themes.slice(moduleId - 1)];
            contextTheme.setThemes(temp)
            result = true;
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })


    return result;
}
export const getOneTheme = async (contextUser, contextModule, contextTheme, moduleId, themeId) => {
    let result = false;

    await check(contextUser);

    await $authHost.get(`${baseUrlApi}/modules/${moduleId}/themes/${themeId}`)
        .then(data => {

            contextTheme.setCurrentTheme(data.data)
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })

    return result;
}
export const addTheme = async (contextUser, contextModule, contextTheme, moduleId) => {
    let result;

    await check(contextUser);

    await $authHost.post(`${baseUrlApi}/modules/${moduleId + 1}/themes`)
        .then(data => {
            getOneTheme(contextUser, contextModule, contextTheme, moduleId + 1, data.data._id)
            result = data.data._id;
            contextUser.setErrorMessage(200, `Создана тема #${data.data._id}`)
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })


    return result;
}


export const updateTheme = async (contextUser, contextTheme, contextModule, moduleId, themeId, name, description, sqlCommands, numEvaluationTasks, numCreateTasks, levels) => {
    let result = false;

    await check(contextUser);

    await $authHost.patch(`${baseUrlApi}/modules/${moduleId}/themes/${themeId}`, {
        name,
        description,
        sqlCommands,
        numEvaluationTasks,
        numCreateTasks,
        levels
    })
        .then(data => {
            getOneTheme(contextUser, contextModule, contextTheme, moduleId, themeId)
                .then((dataTemp) => {

                    result = true;
                })
            contextUser.setErrorMessage(200, `Изменения в теме #${themeId} сохранены`)
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })

    return result;
}

export const makeAvailableTheme = async (contextUser, contextTheme, moduleId, themeId) => {
    let result = false;

    await check(contextUser);

    let currentIsAvailable = contextTheme.currentTheme.isAvailable;

    await $authHost.patch(`${baseUrlApi}/modules/${moduleId}/themes/${themeId}/make-available`)
        .then(data => {
            contextTheme.setCurrentTheme({
                ...contextTheme.currentTheme,
                updatedAt: data.data.updatedAt,
                isAvailable: data.data.isAvailable,
                updatedBy: data.data.updatedBy
            })

            result = true;
            contextUser.setErrorMessage(200,
                `Тема #${themeId} теперь ${data.data.isAvailable
                    ? `доступна`
                    : 'НЕ доступна'} для пользователей`
            )
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })

    return result;
}