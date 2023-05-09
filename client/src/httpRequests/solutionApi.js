import {check} from "./authApi";
import {$authHost} from "./httpMain";

const baseUrlApi = 'http://localhost:5000/sql-crowd-api'

export const createSolution = async (contextUser, contextTask, contextSolution) => {
    let result = false;
    contextUser.setIsLoading(true)
    await check(contextUser);
    let taskId = contextTask.selectedTask;
    console.log("№ " + taskId)
    let solutionId;
    await $authHost.post(`${baseUrlApi}/tasks/${taskId}/solutions`, {task_id: taskId})
        .then(data => {
            solutionId = data.data.solutionId;
            contextSolution.setSelectedSolution(solutionId);
            console.log("создание решения "+solutionId)
            result = getOneSolution(contextUser, contextTask, contextSolution)
                .then((bool)=>{if(!bool){contextUser.setErrorMessage(200, `Получить решение #${solutionId} задачи #${taskId} не удалось`)}});
        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}`, error.response.data.message)
        })
        .finally(() => {
            contextUser.setIsLoading(false);
            //if (result) navigate(`/tasks/${taskId}/solutions/${solutionId}`);
        });


    return result;
}
export const getOneSolution = async (contextUser, contextTask, contextSolution) => {
    let result = false;
    contextUser.setIsLoading(true)
    await check(contextUser);
    let taskId = contextTask.selectedTask;
    let solutionId = contextSolution.selectedSolution

    await $authHost.get(`${baseUrlApi}/tasks/${taskId}/solutions/${solutionId}`, {task_id: taskId})
        .then(data => {
            contextSolution.setSolution(data.data)
            result = true;
        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}`, error.response.data.message)
        })
        .finally(() => {
            contextUser.setIsLoading(false);
        });
    return result;
}
export const updateOneSolution = async (contextUser, contextTask, contextSolution, code) => {
    let result = false;
    contextUser.setIsLoading(true)
    await check(contextUser);
    let taskId = contextTask.selectedTask;
    let solutionId = contextSolution.selectedSolution

    await $authHost.patch(`${baseUrlApi}/tasks/${taskId}/solutions/${solutionId}`, {code: code})
        .then(data => {
            contextSolution.setResult(data.data)
            result = true;
            contextUser.setErrorMessage(`200`, `Запрос исполнен, данные получены`)
        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}`, error.response.data.message)
        })
        .finally(() => {
            contextUser.setIsLoading(false);
        });
    return result;
}
export const getSolutions = async (contextUser, contextTask, contextSolution, taskId,navigate) => {
    let result = false;
    contextUser.setIsLoading(true)
    await check(contextUser);

    //let solutionId = contextSolution.selectedSolution

    await $authHost.get(`${baseUrlApi}/tasks/${taskId}/solutions`, {task_id: taskId})
        .then(data => {
            contextSolution.setAllSolutions(data.data)
            result = true;

        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}`, error.response.data.message)
            if(error.response.status==403) navigate(`/tasks/${taskId}`)
        })
        .finally(() => {
            contextUser.setIsLoading(false);
        });
    return result;
}

export const createComment = async (contextUser, contextTask, contextSolution, solutionId, content, navigate) => {
   let result = false;
    contextUser.setIsLoading(true)
    await check(contextUser);

    await $authHost.post(`${baseUrlApi}/tasks/${contextTask.task.info._id}/solutions/${solutionId}/comment`, {content: content})
        .then(() => {
            result = getSolutions(contextUser,contextTask,contextSolution, contextTask.task.info._id, navigate)
        })
        .catch(error => {
            contextUser.setErrorMessage(`${error.response.status}`, error.response.data.message)
        })
        .finally(() => {
            contextUser.setIsLoading(false);
            //if (result) navigate(`/tasks/${taskId}/solutions/${solutionId}`);
        });


    return result;
}

export const like = async (contextUser, contextTask, contextSolution, solutionId) => {
   let result = false;
    contextUser.setIsLoading(true)
    await check(contextUser);

    await $authHost.post(`${baseUrlApi}/tasks/${contextTask.task.info._id}/solutions/${solutionId}/like`, {})
        .then(data => {
            let temp = contextSolution.allSolutions;
            let index = temp.findIndex(el => el._id === solutionId);
            console.log(data.data.isLiked)
            temp[index].like.isLiked = data.data.isLiked;
            console.log("2")
            let likeCount = temp[index].like.likeCount;
            console.log("3")
            console.log(temp[index].like.likeCount)

            temp[index].like.likeCount = data.data.isLiked ? likeCount+1 : likeCount-1;
            console.log("4")
            contextSolution.setAllSolutions(temp)
            result = true;
        })
        .catch(error => {
            console.log(error)
            contextUser.setErrorMessage(`${error.response.status}`, error.response.data.message)
        })
        .finally(() => {
            contextUser.setIsLoading(false);
        });
    return result;
}