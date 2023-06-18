import {check} from "./authAPI";
import {$authHost} from "./httpMain";

const baseUrlApi = 'http://localhost:5000/sql-crowd-api'

export const getRating = async (contextUser, contextRating, selectedUser=null) => {
    let result = false;

    await check(contextUser);
    try {
        await $authHost.get(`${baseUrlApi}/rating${selectedUser ? `?userId=${selectedUser}`:``}`)
            .then((data) => {
                contextRating.setUsersRating(data.data)

                result = true;
            })
            .catch((error) => {
                contextUser.setErrorMessage(error.response.status, error.response.data.message)
            });

        result = true;
    } catch (error) {
        contextUser.setErrorMessage(error.response.status, error.response.data.message);
    }

    return result;
}