import dotenv from 'dotenv'
dotenv.config()
import { Sequelize } from 'sequelize'
import path from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let sequelize = new Sequelize(null, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
});

let results = await sequelize.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);

    if (results[0].length === 0) {

        await sequelize.query(`CREATE DATABASE ${process.env.DB_NAME}`);
        sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST, dialect: 'postgres'
        });
    }
    else
    {
        sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST, dialect: 'postgres'
        });
    }



export default sequelize