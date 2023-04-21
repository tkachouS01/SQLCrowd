import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

const Database = sequelize.define('database', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true }
});
const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role: { type: DataTypes.ENUM('USER', 'ADMIN'), defaultValue: 'USER' },
    surname: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    patronymic: { type: DataTypes.STRING },
    gender: { type: DataTypes.ENUM('М', 'Ж', 'Не указано'), defaultValue: 'Не указано' },
    date_of_birth: { type: DataTypes.DATEONLY },
    nickname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
});
const Task = sequelize.define('task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: { type: DataTypes.STRING },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false }
});
const Solution = sequelize.define('solution', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    is_author: { type: DataTypes.BOOLEAN, defaultValue: false },
    attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
    code: { type: DataTypes.STRING },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false }
});
const SolutionComment = sequelize.define('solution_comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.TEXT, allowNull: false },
});
const SolutionLike = sequelize.define('solution_like', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});
User.hasMany(Task);
Task.belongsTo(User);
Database.hasMany(Task);
Task.belongsTo(Database);
Task.hasMany(Solution);
Solution.belongsTo(Task);
User.hasMany(Solution);
Solution.belongsTo(User);
Solution.hasMany(SolutionComment);
SolutionComment.belongsTo(Solution);
User.hasMany(SolutionComment);
SolutionComment.belongsTo(User);
Solution.hasMany(SolutionLike);
SolutionLike.belongsTo(Solution);
User.hasMany(SolutionLike);
SolutionLike.belongsTo(User);

export {
    User,
    Database,
    Task,
    Solution,
    SolutionComment,
    SolutionLike
};

