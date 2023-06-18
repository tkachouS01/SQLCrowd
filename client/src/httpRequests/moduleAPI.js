import {$authHost} from "./httpMain";
import {check} from "./authAPI";
import {getAllThemes} from "./themeAPI";

const baseUrlApi = 'http://localhost:5000/sql-crowd-api'

export const getAllModules = async (contextUser, contextModule, contextTheme) => {
    let result = false;

    await check(contextUser);
    try {
        const {data} = await $authHost.get(`${baseUrlApi}/modules`);
        contextModule.setModules(data);

        for (let i = 0; i < data.length; i++) {
            await getAllThemes(contextUser, contextModule, contextTheme, data[i]._id);
        }

        result = true;
    } catch (error) {
        contextUser.setErrorMessage(error.response.status, error.response.data.message);
    }

    return result;
};

export const addModule = async (contextUser, contextModule, contextTheme) => {
    let result = false;

    await check(contextUser);
    let temp;

    await $authHost.post(`${baseUrlApi}/modules`)
        .then(data => {
            temp = data.data
            contextModule.setModules([...contextModule.modules, data.data])
            contextTheme.setThemes([...contextTheme.themes, []])
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })


    return temp._id;
}

export const updateModule = async (contextUser, contextModule, moduleId, updateNameModule, updateDescriptionModule) => {
    let result = false;

    await check(contextUser);


    await $authHost.patch(`${baseUrlApi}/modules/${moduleId}`, {
        name: updateNameModule,
        description: updateDescriptionModule
    })
        .then(data => {
            if (!('_id' in data.data)) return false;
            let temp = contextModule.modules
            temp[moduleId - 1] = {...data.data};

            contextModule.setModules([...temp]);
            result = true;
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
            result = false;
        })

    return result;
}

export const makeAvailableModule = async (contextUser, contextModule, moduleId) => {
    let result = false;

    await check(contextUser);

    let currentIsAvailable = contextModule.modules[moduleId].isAvailable;

    await $authHost.patch(`${baseUrlApi}/modules/${moduleId + 1}/make-available`)
        .then(data => {
            if (data.data.isAvailable === currentIsAvailable) return true;

            let temp = contextModule.modules
            temp[moduleId] = {...data.data};

            contextModule.setModules([...temp]);

            result = true;
            contextUser.setErrorMessage(200,
                `Модуль #${moduleId + 1} теперь ${data.data.isAvailable
                    ? `доступен`
                    : 'НЕ доступен'} для пользователей`
            )
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })

    return result;
}