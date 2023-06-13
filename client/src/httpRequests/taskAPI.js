import {$authHost} from "./httpMain";
import {check} from "./authAPI";

const baseUrlApi = 'http://localhost:5000/sql-crowd-api'

export const getTasks = async (contextUser, contextTask, themeId, section, category) => {
    let result = false;

    await check(contextUser);

    await $authHost.get(`${baseUrlApi}/modules/${null}/themes/${themeId}/tasks?section=${section}&category=${category}`)
        .then(data => {
            contextTask.setAllTasks(data.data.result)
            contextTask.setCurrentProgress(data.data.info)

            result = true;
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })

    return result;
}

export const getOneTask = async (contextUser, contextTask, themeId, taskId) => {
    let result = false;

    await check(contextUser);

    await $authHost.get(`${baseUrlApi}/modules/${null}/themes/${themeId}/tasks/${+taskId}`, {})
        .then(data => {

            contextTask.setCurrentTask(data.data.info);
            contextTask.setDatabases(data.data.databases);
            contextTask.setDatabasesData(data.data.data);
            result = true;

        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })

    return result;
}
export const addRatingOneTask = async (contextUser, contextTask, themeId, taskId, commentValue, ratingValue) => {
    let result = false;

    await check(contextUser);

    await $authHost.post(`${baseUrlApi}/modules/${null}/themes/${themeId}/tasks/${+taskId}/add-rating`, {
        comment: commentValue,
        rating: ratingValue
    })
        .then(data => {
            contextTask.setCurrentTask({...contextTask.currentTask, ratingTask: {...data.data}})
            contextUser.setErrorMessage(200, 'Отзыв успешно оставлен')
            result = true;

        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })

    return result;
}

export const updateTask = async (contextUser, contextTask, taskId, databaseName, description, themeId) => {
    let result = false;

    await check(contextUser);

    await $authHost.patch(`${baseUrlApi}/modules/${null}/themes/${themeId}/tasks/${taskId}`,
        databaseName === "Не выбрано"
            ? {description}
            : {databaseName, description}
    )
        .then(data => {
            contextTask.setCurrentTask(data.data.info);


            contextTask.setDatabasesData(data.data.data);

            contextUser.setErrorMessage(200, `Задача #${taskId} обновлена`)
            result = true;
        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}`, error.response.data.message)
        })
        .finally(() => {

        });
    return result;
}

export const createTask = async (contextUser, contextTask, themeId) => {
    let result = false;

    await check(contextUser);
    let taskId;
    await $authHost.post(`${baseUrlApi}/modules/${null}/themes/${themeId}/tasks`, {})
        .then(data => {
            taskId = +data.data.taskId;
            contextUser.setErrorMessage(200, 'Задача создана')
        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}: Создать задачу не удалось`, error.response.data.message)
        })
    return taskId;
}

export const updateInBankTask = async (contextUser, contextTask, themeId, tasks, inBank, section, category) => {
    let result = false;
    await check(contextUser);

    await $authHost.patch(`${baseUrlApi}/modules/${null}/themes/${themeId}/tasks/update-in-bank`, {
        tasks: tasks,
        inBank: inBank
    })
        .then(data => {
            result = true;
            contextUser.setErrorMessage(200, `Задачи ${inBank ? 'добавлены в банк' : 'отклонены от добавления в банк'}`)
            getTasks(contextUser, contextTask, themeId, section, category)
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })
    return result;
}