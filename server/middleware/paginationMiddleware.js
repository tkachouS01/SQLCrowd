export default function (req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    req.pagination = { limit, offset };
    next();
}