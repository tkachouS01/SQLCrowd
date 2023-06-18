import {$authHost} from "./httpMain";
import {check} from "./authAPI";

const baseUrlApi = 'http://localhost:5000/sql-crowd-api'

export const updateRole = async (contextUser, contextRoleRequests, userId) => {
    let result = false;
    await check(contextUser);

    await $authHost.patch(`${baseUrlApi}/role-requests`, {_id: userId})
        .then((data) => {
            result = data.data.role
        })
        .catch((error) => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message);
        })

    return result;
};
