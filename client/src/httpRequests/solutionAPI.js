import {check} from "./authAPI";
import {$authHost} from "./httpMain";

const baseUrlApi = 'http://localhost:5000/sql-crowd-api'

export const createSolution = async (contextUser, contextTask, contextSolution,moduleId,themeId,taskId) => {
    let result = false;

    await check(contextUser);

    let solutionId;
    await $authHost.post(`${baseUrlApi}/modules/${moduleId}/themes/${themeId}/tasks/${taskId}/solutions`, {taskId: taskId})
        .then(data => {
            solutionId = data.data.solutionId;

            result = getOneSolution(contextUser, contextTask, contextSolution,moduleId,themeId,taskId,solutionId)
                .then((bool)=>{if(!bool){
                    contextUser.setErrorMessage(200, `Получить решение #${solutionId} задачи #${taskId} не удалось`)
                }else{
                    contextTask.setCurrentTask({...contextTask.currentTask, myProgress: 'Выполняется'})
                }});
        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}`, error.response.data.message)
        })



    return result;
}
export const getOneSolution = async (contextUser, contextTask, contextSolution,moduleId,themeId,taskId, solutionId) => {
    let result = false;

    await check(contextUser);

    await $authHost.get(`${baseUrlApi}/modules/${moduleId}/themes/${themeId}/tasks/${taskId}/solutions/${solutionId}`, {taskId: taskId})
        .then(data => {
            contextSolution.setOneSolution(data.data)
            result = true;
        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}`, error.response.data.message)
        })

    return result;
}
export const runOneSolution = async (contextUser, contextTask, contextSolution, code, moduleId, themeId, taskId, solutionId) => {
    let result = false;

    await check(contextUser);

    await $authHost.patch(`${baseUrlApi}/modules/${moduleId}/themes/${themeId}/tasks/${taskId}/solutions/${solutionId}`, {code: code})
        .then(data => {
            contextSolution.setResult(data.data)
            contextUser.setErrorMessage(`200`, `Запрос исполнен, данные получены`)

        })
        .catch(error => {
            contextSolution.setResult({success: false, fields: [],rows: []})
            contextUser.setErrorMessage(`${error.response.status}`, error.response.data.message)
        })

    return result;
}
export const endSolution = async (contextUser, contextSolution, moduleId, themeId, taskId, solutionId) => {
    let result = false;

    await check(contextUser);

    await $authHost.patch(`${baseUrlApi}/modules/${moduleId}/themes/${themeId}/tasks/${taskId}/solutions/${solutionId}/finished`)
        .then(data => {
            console.log(contextSolution.oneSolution)
            console.log({...contextSolution.oneSolution, finished: true})

            contextSolution.setOneSolution({...contextSolution.oneSolution, finished: true})
            //contextSolution.setResult(data.data)
            result = true;
            contextUser.setErrorMessage(`200`, `Решение завершено`)
        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}`, error.response.data.message)
        })

    return result;
}
export const getSolutions = async (contextUser, contextTask, contextSolution ,moduleId,themeId,taskId) => {
    let result = false;

    await check(contextUser);

    await $authHost.get(`${baseUrlApi}/modules/${moduleId}/themes/${themeId}/tasks/${taskId}/solutions`, {})
        .then(data => {

            contextSolution.setAllSolutions(data.data)
            result = true;

        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}`, error.response.data.message)
            //if(error.response.status==403) navigate(`/tasks/${taskId}`)
        })

    return result;
}

export const createComment = async (contextUser, contextTask, contextSolution, content,moduleId,themeId, taskId,solutionId) => {
   let result = false;

    await check(contextUser);

    await $authHost.post(
        `${baseUrlApi}/modules/${moduleId}/themes/${themeId}/tasks/${contextTask.currentTask._id}/solutions/${solutionId}/comment`, {content: content})
        .then(() => {
            result = getSolutions(contextUser,contextTask,contextSolution, null,themeId,taskId)
        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}`, error.response.data.message)
        })



    return result;
}

export const like = async (contextUser, contextTask, contextSolution,moduleId,themeId, solutionId) => {
   let result = false;

    await check(contextUser);

    await $authHost.post(`${baseUrlApi}/modules/${moduleId}/themes/${themeId}/tasks/${contextTask.currentTask._id}/solutions/${solutionId}/like`, {})
        .then(data => {
            let temp = contextSolution.allSolutions;
            let index = temp.findIndex(el => el._id === solutionId);

            temp[index].like.isLiked = data.data.isLiked;

            let likeCount = temp[index].like.likeCount;



            temp[index].like.likeCount = data.data.isLiked ? likeCount+1 : likeCount-1;

            contextSolution.setAllSolutions(temp)
            result = true;
        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}`, error.response.data.message)
        })

    return result;
}