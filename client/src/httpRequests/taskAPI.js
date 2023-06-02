import {$authHost} from "./httpMain";
import {check} from "./authAPI";

const baseUrlApi = 'http://localhost:5000/sql-crowd-api'

//+
export const getTasks = async (contextUser, contextTask, themeId) => {
    let result = false;

    await check(contextUser);

    await $authHost.get(`${baseUrlApi}/modules/${null}/themes/${themeId}/tasks?inBank=true&themeId=${themeId}`)
        .then(data => {
            contextTask.setAllTasks(data.data)

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
console.log(data.data.info)
console.log(data.data.databases)
console.log(data.data.data)
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

//+
//обновить задачу
export const updateTask = async (contextUser, contextTask, navigate, taskId, databaseName, description, themeId) => {
    let result = false;

    await check(contextUser);

    await $authHost.patch(`${baseUrlApi}/modules/${null}/themes/${themeId}/tasks/${taskId}`,
        databaseName === "Не выбрано"
            ? {description}
            : {databaseName, description}
    )
        .then(data => {
console.log(data.data)
            //contextTask.setCurrentTask(data.data);

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
            taskId = +data.data.task_id;

            getOneTask(contextUser, contextTask, themeId, taskId)
                .then((bool) => {
                    if (bool) {
                        result = taskId;
                        contextUser.setErrorMessage(200, `Задача #${taskId} создана`)
                    }
                });
        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}: Создать задачу не удалось`, error.response.data.message)
        })
    return result;
}