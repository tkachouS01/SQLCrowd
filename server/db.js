import dotenv from 'dotenv'
dotenv.config()
import { Sequelize } from 'sequelize'
let sequelize = new Sequelize(null, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
});
let results = await sequelize.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);
if (results[0].length === 0) {
    await sequelize.query(`CREATE DATABASE ${process.env.DB_NAME}`);
}
export default sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
)
