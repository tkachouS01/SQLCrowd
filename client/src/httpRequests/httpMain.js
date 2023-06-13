import axios from "axios";
import * as Process from "process";

const $host = axios.create({
    baseURL: Process.env.REACT_APP_API_URL,
});

const $authHost = axios.create({
    baseURL: Process.env.REACT_APP_API_URL,
});

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

$authHost.interceptors.request.use(authInterceptor)

export {$host, $authHost};