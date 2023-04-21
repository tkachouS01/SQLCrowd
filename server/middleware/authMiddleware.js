import jwt from 'jsonwebtoken'
import util from 'util';

export default function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1] // Bearer asfasnfkajsfnjk
        if (!token) {
            res.redirect('/signin');
            return res.status(401).json({ message: "Не авторизован" })
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        req.user = decoded
        let temp = req.user;

        next()
    } catch (e) {
        res.status(401).json({ message: "Не авторизован" })
    }
};
