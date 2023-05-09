import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

const Databases = sequelize.define('databases', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    tables: { type: DataTypes.JSONB, allowNull: false } //названия таблиц, колонок
});

const Users = sequelize.define('users', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
const Tasks = sequelize.define('tasks', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер задачи
    description: { type: DataTypes.STRING }, // описание задачи
    verified: { type: DataTypes.BOOLEAN, defaultValue: false }, //доступно ли для решения
    inBank: {type: DataTypes.BOOLEAN, defaultValue: false} //задача в банке задач? (банк - прошедшие все проверки)
});
Users.hasMany(Tasks);
Tasks.belongsTo(Users);

Databases.hasMany(Tasks);
Tasks.belongsTo(Databases);

//автоматические проверки задачи
const AutoTaskChecks = sequelize.define('auto_task_checks', {
    //_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер проверки
    simpleConditionCheck: {type: DataTypes.BOOLEAN, defaultValue: false}, //содержимое ответа
    complexConditionCheck: {type: DataTypes.BOOLEAN, defaultValue: false}, //содержимое ответа
    checkingSyntaxOfCode: {type: DataTypes.BOOLEAN, defaultValue: false}, //содержимое ответа
});
Tasks.hasOne(AutoTaskChecks);
AutoTaskChecks.belongsTo(Tasks);

const Solutions = sequelize.define('solutions', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер решения
    is_author: { type: DataTypes.BOOLEAN, defaultValue: false }, //это авторское решение?
    attempts: { type: DataTypes.INTEGER, defaultValue: 0 }, //количество попыток решения
    code: { type: DataTypes.STRING }, //код решения
    verified: { type: DataTypes.BOOLEAN, defaultValue: false } //прошло ли решение автоматическую проверку
});
Tasks.hasMany(Solutions);
Solutions.belongsTo(Tasks);

Users.hasMany(Solutions);
Solutions.belongsTo(Users);

const SolutionComments = sequelize.define('solution_comments', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер комментария
    content: { type: DataTypes.TEXT, allowNull: false }, //текст комментария
});
Solutions.hasMany(SolutionComments);
SolutionComments.belongsTo(Solutions);

Users.hasMany(SolutionComments);
SolutionComments.belongsTo(Users);

const SolutionLikes = sequelize.define('solution_likes', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер лайка
    isLiked: {type: DataTypes.BOOLEAN, defaultValue: true} //текущее состояние лайка
});
Solutions.hasMany(SolutionLikes);
SolutionLikes.belongsTo(Solutions);

Users.hasMany(SolutionLikes);
SolutionLikes.belongsTo(Users);

//содержит темы
const Module = sequelize.define('modules', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер модуля
    name: {type: DataTypes.STRING, allowNull: false}, //название модуля
    description: {type: DataTypes.TEXT}, //описание набора тем
    isAvailable: {type: DataTypes.BOOLEAN, defaultValue: false}, //доступен ли модуль для просмотра
});

//для темы создаются тесты и задачи
const Theme = sequelize.define('themes', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер темы
    name: {type: DataTypes.STRING, allowNull: false}, //название темы
    description: {type: DataTypes.TEXT}, //текст темы
    sqlCommands: {type: DataTypes.ARRAY(DataTypes.STRING)}, //набор sql комманд для создания и решения задачи
    numEvaluationTasks: {type: DataTypes.INTEGER}, //минимальное оцененное кол-во задач для прохождения темы
    numCreateTasks: {type: DataTypes.INTEGER}, //минимальное созданное кол-во задач для прохождения темы
    isAvailable: {type: DataTypes.BOOLEAN, defaultValue: false}, //доступна ли тема для просмотра
});
Users.hasMany(Theme);
Theme.belongsTo(Users);

Module.hasMany(Theme);
Theme.belongsTo(Module);

//уровни сложности темы (максимум баллов за выполнение одного действия)
const DifficultyLevelsOfTheme = sequelize.define('difficulty_level_of_themes', {
    testSolution: {type: DataTypes.INTEGER}, //максимум за решение теста
    taskSolution: {type: DataTypes.INTEGER}, //максимум за решение задачи из БЗ
    taskCreation: {type: DataTypes.INTEGER}, //максимум за создание задачи
    taskEvaluation: {type: DataTypes.INTEGER} //максимум за оценку задачи
});
Theme.hasOne(DifficultyLevelsOfTheme);
DifficultyLevelsOfTheme.belongsTo(Theme);

//тестирование для доступа к созданию и оцениванию
const Tests = sequelize.define('tests', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер теста
    content: {type: DataTypes.JSONB, defaultValue: true}, //содержимое теста
});
Theme.hasOne(Tests);
Tests.belongsTo(Theme);

//результаты тестирований
const TestAnswers = sequelize.define('test_answers', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер ответа
    content: {type: DataTypes.JSONB, defaultValue: true}, //содержимое ответа
});

Theme.hasOne(TestAnswers);
TestAnswers.belongsTo(Theme);

//выставленные оценки задачи
const TaskRatings = sequelize.define('task_ratings', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер оценки
    rating: {type: DataTypes.INTEGER, allowNull: false}, //выставленный бал
    verified: {type: DataTypes.BOOLEAN}, //оценка надежная или нет
});
Solutions.hasMany(TaskRatings);
TaskRatings.belongsTo(Solutions);

Users.hasMany(TaskRatings);
TaskRatings.belongsTo(Users);

//запросы на роль админа
const AdminRoleRequests = sequelize.define('admin_role_requests', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер запроса
    isApproved: {type: DataTypes.BOOLEAN}, //назначена роль?
    requestMessage: {type: DataTypes.STRING},
    responseMessage: {type: DataTypes.STRING}
});
Users.hasMany(AdminRoleRequests);
AdminRoleRequests.belongsTo(Users);

//оценки за решение теста
const Scores = sequelize.define('scores', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер оценки
    score: { type: DataTypes.INTEGER }, //баллы
    rating: { type: DataTypes.INTEGER }, //оценка
});
Users.hasMany(Scores);
Scores.belongsTo(Users);

//оценки за решение теста
const UserTestScores = sequelize.define('user_test_scores', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер оценки
});
TestAnswers.hasOne(UserTestScores);
UserTestScores.belongsTo(TestAnswers);

Scores.hasOne(UserTestScores);
UserTestScores.belongsTo(Scores);

//оценки за создание задачи
const TaskCreationScores = sequelize.define('task_creation_scores', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер оценки
});
Tasks.hasOne(TaskCreationScores);
TaskCreationScores.belongsTo(Tasks);

Scores.hasOne(TaskCreationScores);
TaskCreationScores.belongsTo(Scores);

//оценки за оценку задачи
const TaskEvaluationScores = sequelize.define('task_evaluation_scores', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер оценки
});
TaskRatings.hasOne(TaskEvaluationScores);
TaskEvaluationScores.belongsTo(TaskRatings);

Scores.hasOne(TaskEvaluationScores);
TaskEvaluationScores.belongsTo(Scores);

//оценки за решение задачи
const TaskSolutionScores = sequelize.define('task_solution_scores', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер оценки
});
Solutions.hasOne(TaskSolutionScores);
TaskSolutionScores.belongsTo(Solutions);

Scores.hasOne(TaskSolutionScores);
TaskSolutionScores.belongsTo(Scores);

export {
    Databases,
    Users,
    Tasks,
    AutoTaskChecks,
    Solutions,
    SolutionComments,
    SolutionLikes,
    Module,
    Theme,
    DifficultyLevelsOfTheme,
    Tests,
    TestAnswers,
    TaskRatings,
    AdminRoleRequests,
    Scores,
    UserTestScores,
    TaskCreationScores,
    TaskEvaluationScores,
    TaskSolutionScores
};