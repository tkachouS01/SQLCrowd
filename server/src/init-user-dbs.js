import {consoleMessage, consoleError} from './customMessageConsole.js'
import dotenv from 'dotenv'

dotenv.config()

import {Sequelize} from 'sequelize';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const dbNames = ['aero', 'computer', 'inc_out', 'painting', 'ships'];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let sequelize = new Sequelize(null, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST, dialect: 'postgres'
});

async function createDatabases() {
    let results = [];
    for (let i = 0; i < dbNames.length; i++) {
        results[i] = await sequelize.query(`SELECT 1 FROM pg_database WHERE datname = '${dbNames[i]}'`);

        try {
            await sequelize.query(`CREATE DATABASE ${dbNames[i]}`);
            console.log(`БД ${dbNames[i]} создана`);
        } catch (error) {}
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
            if (!results[i][0].length) {
                const sqlFilePath = path.join(__dirname, 'staticScriptsDB', `${dbNames[i]}.sql`);
                const sql = fs.readFileSync(sqlFilePath, 'utf8');
                await sequelize[i].query(sql);


                const result = await sequelize[i].query(`
                  SELECT table_name, column_name
                  FROM information_schema.columns
                  WHERE table_schema = 'public'
                `);

                const tables = {};

                result[0].forEach(({table_name, column_name}) => {
                    if (!tables[table_name]) {
                        tables[table_name] = [];
                    }
                    tables[table_name].push(column_name);
                });
                consoleMessage(`Структура ${dbNames[i]} создана`)
                await Databases.create({_id: i + 1, name: dbNames[i], tables})
            }
        } catch (err) {
            consoleError(`Не удалось подключиться к базе данных ${dbNames[i]}: ${err}`)
        }
    }
}

async function executeQuery(code, databaseId) {
    databaseId--;
    const allowedQueryTypes = /^(SELECT)/i;

    if (!allowedQueryTypes.test(code)) {
        throw new Error('Запрос начинается с неподдержимаемого оператора или имеет неверный синтаксис')
    }
    const t = await sequelize[databaseId].transaction();
    try {
        const result = await sequelize[databaseId].query(code, {transaction: t});
        await t.commit();
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
}
export {createDatabases, executeQuery, getAllTablesAndColumns};