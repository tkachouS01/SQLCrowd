import {$authHost} from "./httpMain";
import {check} from "./authAPI";

const baseUrlApi = 'http://localhost:5000/sql-crowd-api'

//+
export const getTasks = async (contextUser, contextTask, themeId,section,category) => {
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

//+
//получить конкретную задачу
export const getOneTask = async (contextUser, contextTask, themeId, taskId) => {
    let result = false;

    await check(contextUser);

    await $authHost.get(`${baseUrlApi}/modules/${null}/themes/${themeId}/tasks/${+taskId}`, {})
        .then(data => {
            console.log(data.data.info.inBank)
            console.log(data.data.info.autoTaskCheck)

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

    await $authHost.post(`${baseUrlApi}/modules/${null}/themes/${themeId}/tasks/${+taskId}/add-rating`, {comment: commentValue, rating: ratingValue})
        .then(data => {
            //contextTask.setCurrentTask(data.data.info);
            //contextTask.setDatabases(data.data.databases);
            //contextTask.setDatabasesData(data.data.data);
            contextUser.setErrorMessage(200, 'Отзыв успешно оставлен')
            result = true;

        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })

    return result;
}

//+
//обновить задачу
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

//-
//создать задачу
export const createTask = async (contextUser, contextTask, themeId) => {
    let result = false;

    await check(contextUser);
    let taskId;
    await $authHost.post(`${baseUrlApi}/modules/${null}/themes/${themeId}/tasks`, {})
        .then(data => {
            taskId = +data.data.taskId;
        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}: Создать задачу не удалось`, error.response.data.message)
        })
    return taskId;
}