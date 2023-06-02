import {$authHost, $host} from "./httpMain";
import jwt_decode from "jwt-decode";
import {TASKS_ROUTE, THEMES_ROUTE} from "../utils/constsPath";

const baseUrlApi = 'http://localhost:5000/sql-crowd-api'

//РЕГИСТРАТИОН
export const signUp = async (context, email, nickname, surname, name, patronymic, gender, date_of_birth) => {
    let result = false;


    await $host.post(`${baseUrlApi}/signup`, {
        email,
        nickname,
        surname,
        name,
        patronymic,
        gender,
        date_of_birth
    })
        .then(data => {
            //funcTokenSet(data.data.token, context)
            context.setErrorMessage(200,
                `Вы стали #${data.data.userId} пользователем. На почту ${email} отправлено письмо с вашим паролем`)
            result = true;

        })
        .catch(error => {
            context.setErrorMessage(error.response.status, error.response.data.message)
        })
    return result;
}

//АУТЕНТИФИКЭЙШЕН
export const signIn = async (contextUser, navigate, login, password) => {
    let result = false;

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
            if (result) navigate(THEMES_ROUTE());
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

                context.setIsAuth(true);
            } catch (error) {
                context.setErrorMessage(error.response.status, error.response.data.message);
                context.setIsAuth(false);
            }

        }
        else {
            context.setUser(decodedToken);
            context.setIsAuth(true);
        }
    }
    else { context.setIsAuth(false);}

    return true;
};

function funcTokenSet(token, context) {
    localStorage.setItem('token', token);
    const user = jwt_decode(token);
    context.setUser(user);
}