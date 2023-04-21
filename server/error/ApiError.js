export default class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status
        this.message = message
    }
    //неверные данные в теле запроса
    static badRequest(message) {
        return new ApiError(400, `${message}`)
    }
    //не авторизирован (пытается получить доступ к запрещенному ресурсу)
    static unauthorized(message) {
        return new ApiError(401, `${message}`)
    }
    //запрет
    static forbidden(message) {
        return new ApiError(403, `${message}`)
    }
    //запрашиваемый ресурс не найден
    static notFound(message) {
        return new ApiError(404, `${message}`)
    }
    //конфликт с состоянием ресурса
    static conflictingRequest(message) {
        return new ApiError(409, `${message}`)
    }
    //ошибка сервака
    static serverError(message) {
        return new ApiError(500, `${message}`)
    }
}
