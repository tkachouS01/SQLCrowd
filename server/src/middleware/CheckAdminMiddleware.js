import ApiError from "../error/ApiError.js";

export default async function (req, res, next) {
    if(req.user.role!=='ADMIN')
    { return next(ApiError.forbidden(`Необходимы права администратора`))}
    else next()
}