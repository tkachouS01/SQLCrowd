import {$authHost, $host} from "./httpMain";
import {check} from "./authApi";

const baseUrlApi = 'http://localhost:5000/sql-crowd-api'

export const getUsers = async (contextUser) => {
    let result = false;
    contextUser.setIsLoading(true)
    await check(contextUser);


    await $authHost.get(`${baseUrlApi}/users`)
        .then(data => {
            contextUser.setUsers(data.data)
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