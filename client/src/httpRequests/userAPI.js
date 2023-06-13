import {$authHost} from "./httpMain";
import {check} from "./authAPI";

const baseUrlApi = 'http://localhost:5000/sql-crowd-api'

export const getUsers = async (contextUser) => {
    let result = false;

    await check(contextUser);


    await $authHost.get(`${baseUrlApi}/users`)
        .then(data => {
            contextUser.setUsers(data.data)
            result = true;
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })

    return result;
}
export const getOneUser = async (contextUser, currentUserId) => {
    let result = false;

    await check(contextUser);

    await $authHost.get(`${baseUrlApi}/users/${currentUserId}`)
        .then(data => {
            contextUser.setCurrentProfile(data.data)
            result = true;
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })

    return result;
}
export const addImageProfile = async (contextUser, userId,selectedFile)=>{
    let result = false;
    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    await check(contextUser);

    await $authHost.post(`${baseUrlApi}/users/image/${userId}`,formData)
        .then(data => {
            result = true;
            contextUser.setErrorMessage(200, "Картинка профиля обновлена. При необходимости перезагрузите страницу")
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })

    return result;
}
export const getImage = async (contextUser,file) => {

    await check(contextUser);

    let response = await $authHost.get(`${baseUrlApi}/users/image/${file}`, {
        responseType: 'blob',
    })

    return URL.createObjectURL(response.data);
}