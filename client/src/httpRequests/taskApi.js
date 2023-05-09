import {$authHost} from "./httpMain";
import {check} from "./authApi";

const baseUrlApi = 'http://localhost:5000/sql-crowd-api'

//+
export const getTasks = async (contextUser, contextTask) => {
    let result = false;
    contextUser.setIsLoading(true)
    await check(contextUser);

    await $authHost.get(`${baseUrlApi}/tasks`)
        .then(data => {
            contextTask.setTasks(data.data)
            result = true;
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })
        .finally(() => {
            contextUser.setIsLoading(false);
        });
    return result;
}

//+
//получить конкретную задачу
export const getOneTask = async (contextUser, contextTask, selectedTaskId) => {
    let result = false;
    contextUser.setIsLoading(true)
    await check(contextUser);

    await $authHost.get(`${baseUrlApi}/tasks/${selectedTaskId}`,{})
        .then(data => {
            contextTask.setTask(data.data);
            result = true;
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })
        .finally(() => {
            contextUser.setIsLoading(false);
        });
    return result;
}

//+
//обновить задачу
export const updateTask = async (contextUser, contextTask, navigate, taskId, databaseName, description) => {
    let result = false;
    contextUser.setIsLoading(true)
    await check(contextUser);

    await $authHost.patch(`${baseUrlApi}/tasks/${taskId}`,
        databaseName === "Не выбрано"
            ? {description}
            : {databaseName, description}
    )
        .then(data => {
            contextTask.setTask(data);
            contextUser.setErrorMessage(200, `Задача #${taskId} обновлена`)
            result = true;
        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}`, error.response.data.message)
        })
        .finally(() => {
            contextUser.setIsLoading(false);
            if (result) navigate(`/tasks/${taskId}`);
        });
    return result;
}

//-
//создать задачу
export const createTask = async (contextUser, contextTask, navigate) => {
    let result = false;
    contextUser.setIsLoading(true)
    await check(contextUser);
    let taskId;
    await $authHost.post(`${baseUrlApi}/tasks`,{})
        .then(data => {
            taskId = data.data.task_id;

            result = getOneTask(contextUser,contextTask, taskId)
                .then((bool)=>{if(bool){contextUser.setErrorMessage(200, `Задача #${taskId} создана`)}});
        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}: Создать задачу не удалось`, error.response.data.message)
        })
        .finally(() => {
            contextUser.setIsLoading(false);
            if (result) navigate(`/tasks/${taskId}`);
        });
    return result;
}