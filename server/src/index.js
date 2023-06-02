import {consoleMessage, consoleError} from './customMessageConsole.js'
import ApiError from './error/ApiError.js'
import dotenv from 'dotenv'

dotenv.config()
import express from 'express'

import cors from 'cors'
import sequelize from './db.js';
import mainRouter from './routes/mainRouter.js'
import errorHandler from './middleware/ErrorHandlingMiddleware.js'
import path from 'path'
import {createDatabases} from './init-user-dbs.js'

const PORT = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(process.cwd(), 'static')))

app.use('/sql-crowd-api', mainRouter)
app.use((req, res, next) => {
    next(ApiError.notFound(`Маршрут не определен`))
});


app.use(errorHandler)


try {

    await sequelize.authenticate()
    await sequelize.sync()
    await createDatabases()
    app.listen(PORT, () => consoleMessage(`Сервер запущен на порту ${PORT}`))
} catch (e) {
    consoleError(`Ошибка при старте: ${e}`)
}
