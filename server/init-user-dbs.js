import {consoleMessage, consoleError} from './customMessageConsole.js'
import dotenv from 'dotenv'

dotenv.config()

import {Sequelize} from 'sequelize';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {Database} from './models/models.js'
import ApiError from './error/ApiError.js';

const dbNames = ['aero_pg_script', 'computer_pg_script', 'inc_out_pg_script', 'painting_pg_script', 'ships_pg_script'];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let sequelize = new Sequelize(null, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST, dialect: 'postgres'
});

async function createDatabases() {
    let results = [];
    for (let i = 0; i < dbNames.length; i++) {
        results[i] = await sequelize.query(`SELECT 1 FROM pg_database WHERE datname = '${dbNames[i]}'`);
        if (results[i][0].length === 0) {
            await sequelize.query(`CREATE DATABASE ${dbNames[i]}`);
        }
    }
    sequelize = [];
    for (let i = 0; i < dbNames.length; i++) {
        sequelize[i] = new Sequelize(dbNames[i], process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST, dialect: 'postgres'
        });
    }


    for (let i = 0; i < dbNames.length; i++) {
        try {
            await sequelize[i].authenticate();
            consoleMessage(`Соединение с ${dbNames[i]} успешно установлено.`)
            if (results[i][0].length == 0) {
                const sqlFilePath = path.join(__dirname, 'staticScriptsDB', `${dbNames[i]}.sql`);
                const sql = fs.readFileSync(sqlFilePath, 'utf8');

                await sequelize[i].query(sql);

                consoleMessage(`Структура ${dbNames[i]} создана`)
                await Database.create({id: i + 1, name: dbNames[i]})
            }
        } catch (err) {
            consoleError(`Не удалось подключиться к базе данных ${dbNames[i]}: ${err}`)
        }
    }


}

async function executeQuery(code, databaseId) {
    databaseId = databaseId || 1;
    databaseId--;
    const allowedQueryTypes = /^(SELECT|INSERT|UPDATE|DELETE)/i;

    if (!allowedQueryTypes.test(code)) {
        throw new Error('Запрос начинается с неподдержимаемого оператора или имеет неверный синтаксис')
    }

    const t = await sequelize[databaseId].transaction();
    try {
        const result = await sequelize[databaseId].query(code, {transaction: t});
        await t.rollback();
        return result[0];
    } catch (err) {
        await t.rollback();

        throw err;
    }
}

async function getAllTablesAndColumns(databaseId) {
    databaseId--;
    const query = `SELECT table_name     FROM information_schema.tables     WHERE table_schema = 'public'     ORDER BY table_name;`;

    const result = await sequelize[databaseId].query(query, {type: Sequelize.QueryTypes.SELECT});
    const tables = result.map(r => r.table_name);

    if (tables.length === 0) {
        return {message: 'В базе данных нет таблиц'};
    }

    const tableData = {};

    for (const table of tables) {
        const columnsQuery = `
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = '${table}'
  ORDER BY ordinal_position;
`;
        const columnsResult = await sequelize[databaseId].query(columnsQuery, {type: Sequelize.QueryTypes.SELECT});
        const fields = columnsResult.map(r => r.column_name);

        const contentQuery = `SELECT * FROM "${table}";`;
        const rows = await sequelize[databaseId].query(contentQuery, {type: Sequelize.QueryTypes.SELECT});

        tableData[table] = {fields, rows};
    }

    return tableData;
};
export {createDatabases, executeQuery, getAllTablesAndColumns};