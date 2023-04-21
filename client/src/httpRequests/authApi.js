import {$authHost, $host} from "./httpMain";
import jwt_decode from "jwt-decode";
import {TASKS_ROUTE} from "../utils/constsPath";

const baseUrlApi = 'http://localhost:5000/sql-crowd-api'

//РЕГИСТРАТИОН
export const signUp = async (context, email, nickname, surname, name, patronymic, gender, date_of_birth, password) => {
    let result = false;
    context.setIsLoading(true)

    await $host.post(`${baseUrlApi}/signup`, {
        email,
        nickname,
        surname,
        name,
        patronymic,
        gender,
        date_of_birth,
        password
    })
        .then(data => {
            funcTokenSet(data.data.token, context)
            context.setErrorMessage(200, `Регистрация прошла успешно с id = ${data.data.userId}`)
            result = true;
        })
        .catch(error => {
            context.setErrorMessage(error.response.status, error.response.data.message)
        })
        .finally(() => {
            context.setIsLoading(false);
        });
    return result;
}

//АУТЕНТИФИКЭЙШЕН
export const signIn = async (contextUser, navigate, login, password) => {
    let result = false;
    contextUser.setIsLoading(true)

    await $host.post(`${baseUrlApi}/signin`, {login, password})
        .then((data) => {

            funcTokenSet(data.data.token, contextUser)
            contextUser.setErrorMessage(200, `Авторизация прошла успешно с id = ${data.data.userId}`)

            result = true;
            contextUser.setIsAuth(true);
        })
        .catch(error => {
            contextUser.setErrorMessage(error.response.status, error.response.data.message)
        })
        .finally(() => {
            contextUser.setIsLoading(false);
            if (result) navigate(TASKS_ROUTE);
        });
    return result;
}

//тут без запроса
export const exit = (context) => {
    localStorage.removeItem('token');
    context.setUser({});
    context.setIsAuth(false)

}
export const check = async (context) => {
    context.setIsLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken = jwt_decode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = decodedToken.exp - currentTime;
        if (timeLeft <= 3600) { // если осталось менее часа до истечения токена
            try {
                const response = await $authHost.get(`${baseUrlApi}/auth`);
                const newToken = response.data.token;
                funcTokenSet(newToken, context);
                console.log("ТОКЕН ОБНОВЛЕН")
                context.setIsAuth(true);
            } catch (error) {
                context.setErrorMessage(error.response.status, error.response.data.message);
                context.setIsAuth(false);
            }

        }
        else {
            const user = decodedToken;
            context.setUser(user);
            context.setIsAuth(true);
        }
    }
    else { context.setIsAuth(false);}
    context.setIsLoading(false);
    return true;
};

function funcTokenSet(token, context) {
    localStorage.setItem('token', token);
    const user = jwt_decode(token);
    context.setUser(user);
}