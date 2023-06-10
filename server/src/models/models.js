import sequelize from '../db.js'
import {DataTypes} from 'sequelize'

const Database = sequelize.define('databases', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    tables: {type: DataTypes.JSONB, allowNull: false} //названия таблиц, колонок
});

// СВЯЗАН:
// Subscriber, Module, Theme, Task, Solution, SolutionComment, SolutionLike, Test, TestAnswer, TaskRating, AdminRoleRequest, Scores.
const User = sequelize.define('users', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    role: {type: DataTypes.ENUM('USER', 'ADMIN'), defaultValue: 'USER'},
    surname: {type: DataTypes.STRING, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    patronymic: {type: DataTypes.STRING, allowNull: false},
    gender: {type: DataTypes.ENUM('М', 'Ж'), allowNull: false},
    date_of_birth: {type: DataTypes.DATEONLY, allowNull: false},
    nickname: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false}
});

// СВЯЗАН:
// User
const Subscriber = sequelize.define('subscribers', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    _idSubscriptionTarget: {type: DataTypes.INTEGER}
});

User.hasMany(Subscriber);
Subscriber.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
});

// СВЯЗАН:
// User
const Module = sequelize.define('modules', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, //номер модуля
    name: {type: DataTypes.STRING}, //название модуля
    description: {type: DataTypes.TEXT}, //описание набора тем
    isAvailable: {type: DataTypes.BOOLEAN, defaultValue: false}, //доступен ли модуль для просмотра
    createdByUserId: {type: DataTypes.INTEGER},
    updatedByUserId: {type: DataTypes.INTEGER}
});
User.hasMany(Module, { as: 'createdModule', foreignKey: 'createdByUserId' });
User.hasMany(Module, { as: 'updatedModule', foreignKey: 'updatedByUserId' });
Module.belongsTo(User, { as: 'createdBy', foreignKey: 'createdByUserId',allowNull: false });
Module.belongsTo(User, { as: 'updatedBy', foreignKey: 'updatedByUserId',allowNull: false });

// СВЯЗАН:
// User, Module
const Theme = sequelize.define('themes', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, //номер темы
    name: {type: DataTypes.STRING, defaultValue: ''}, //название темы
    description: {type: DataTypes.TEXT, defaultValue: ''}, //текст темы
    sqlCommands: {type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: []}, //набор sql комманд для создания и решения задачи
    numEvaluationTasks: {type: DataTypes.INTEGER, defaultValue: 0}, //минимальное оцененное кол-во задач для прохождения темы
    numCreateTasks: {type: DataTypes.INTEGER, defaultValue: 0}, //минимальное созданное кол-во задач для прохождения темы
    isAvailable: {type: DataTypes.BOOLEAN, defaultValue: false}, //доступна ли тема для просмотра
    createdByUserId: {type: DataTypes.INTEGER},
    updatedByUserId: {type: DataTypes.INTEGER}
});
User.hasMany(Theme, { as: 'createdThemes', foreignKey: 'createdByUserId' });
User.hasMany(Theme, { as: 'updatedThemes', foreignKey: 'updatedByUserId' });
Theme.belongsTo(User, { as: 'createdBy', foreignKey: 'createdByUserId',allowNull: false });
Theme.belongsTo(User, { as: 'updatedBy', foreignKey: 'updatedByUserId',allowNull: false });

Module.hasMany(Theme);
Theme.belongsTo(Module, {
    foreignKey: {
        name: 'moduleId',
        allowNull: false
    }
});

// СВЯЗАН:
// Theme
const DifficultyLevelsOfTheme = sequelize.define('difficulty_level_of_themes', {
    testSolution: {type: DataTypes.INTEGER, defaultValue: 1}, //максимум за решение теста
    taskSolution: {type: DataTypes.INTEGER, defaultValue: 0}, //максимум за решение задачи из БЗ
    taskCreation: {type: DataTypes.INTEGER, defaultValue: 0}, //максимум за создание задачи
    taskEvaluation: {type: DataTypes.INTEGER, defaultValue: 0} //максимум за оценку задачи
});
Theme.hasOne(DifficultyLevelsOfTheme);
DifficultyLevelsOfTheme.belongsTo(Theme, {
    foreignKey: {
        name: 'themeId',
        allowNull: false
    }
});

// СВЯЗАН:
// Theme, User, Database
const Task = sequelize.define('tasks', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, //номер задачи
    description: {type: DataTypes.STRING}, // описание задачи
    verified: {type: DataTypes.BOOLEAN, defaultValue: false}, //доступно ли для решения
    inBank: {type: DataTypes.BOOLEAN, defaultValue: null} //задача в банке задач? (банк - прошедшие все проверки)
});
Theme.hasMany(Task);
Task.belongsTo(Theme, {
    foreignKey: {
        name: 'themeId',
        allowNull: false
    }
});

User.hasMany(Task);
Task.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
});

Database.hasMany(Task);
Task.belongsTo(Database, {
    foreignKey: {
        name: 'databaseId',
        allowNull: false
    }
});

// СВЯЗАН:
// Task
const AutoTaskCheck = sequelize.define('auto_task_checks', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //номер проверки
    simpleConditionCheck: {type: DataTypes.FLOAT}, //содержимое ответа
    complexConditionCheck: {type: DataTypes.FLOAT}, //содержимое ответа
    checkingSyntaxOfCode: {type: DataTypes.BOOLEAN, defaultValue: false}, //содержимое ответа
});
Task.hasOne(AutoTaskCheck);
AutoTaskCheck.belongsTo(Task, {
    foreignKey: {
        name: 'taskId',
        allowNull: false
    }
});

// СВЯЗАН:
// Task, User
const Solution = sequelize.define('solutions', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, //номер решения
    isAuthor: {type: DataTypes.BOOLEAN, defaultValue: false}, //это авторское решение?
    attempts: {type: DataTypes.INTEGER, defaultValue: 0}, //количество попыток решения
    code: {type: DataTypes.STRING}, //код решения
    verified: {type: DataTypes.BOOLEAN, defaultValue: false},
    finished: {type: DataTypes.BOOLEAN, defaultValue: false} //прошло ли решение автоматическую проверку
});
Task.hasMany(Solution);
Solution.belongsTo(Task, {
    foreignKey: {
        name: 'taskId',
        allowNull: false
    }
});

User.hasMany(Solution);
Solution.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
});

// СВЯЗАН:
// Solution, User
const TaskRating = sequelize.define('task_ratings', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rating: {type: DataTypes.INTEGER, allowNull: false},
    verified: {type: DataTypes.BOOLEAN, defaultValue: null}, //оценка надежная или нет
    isAdmin: {type: DataTypes.BOOLEAN, allowNull: false},
});
Task.hasMany(TaskRating);
TaskRating.belongsTo(Task, {
    foreignKey: {
        name: 'taskId',
        allowNull: false
    }
});

User.hasMany(TaskRating);
TaskRating.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
});

// СВЯЗАН:
// Solution, User
const SolutionComment = sequelize.define('solution_comments', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, //номер комментария
    content: {type: DataTypes.TEXT, allowNull: false}, //текст комментария
});
Solution.hasMany(SolutionComment);
SolutionComment.belongsTo(Solution, {
    foreignKey: {
        name: 'solutionId',
        allowNull: false
    }
});

User.hasMany(SolutionComment);
SolutionComment.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
});

TaskRating.hasOne(SolutionComment);
SolutionComment.belongsTo(TaskRating, {
    foreignKey: {
        name: 'taskRatingId',
        allowNull: true
    }
});

// СВЯЗАН:
// Solution, User
const SolutionLike = sequelize.define('solution_likes', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, //номер лайка
    isLiked: {type: DataTypes.BOOLEAN, defaultValue: true} //текущее состояние лайка
});
Solution.hasMany(SolutionLike);
SolutionLike.belongsTo(Solution, {
    foreignKey: {
        name: 'solutionId',
        allowNull: false
    }
});

User.hasMany(SolutionLike);
SolutionLike.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
});

// СВЯЗАН:
// User, Theme
const Test = sequelize.define('tests', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, //номер теста
    questions: {type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: []}, //содержимое теста
    answers: {type: DataTypes.JSONB, defaultValue: []}, //содержимое теста
    correctAnswers: {type: DataTypes.JSONB, defaultValue: []}, //содержимое теста
    isAvailable: {type: DataTypes.BOOLEAN, defaultValue: false},
    createdByUserId: {type: DataTypes.INTEGER},
    updatedByUserId: {type: DataTypes.INTEGER}
});
User.hasMany(Test, { as: 'createdTest', foreignKey: 'createdByUserId' });
User.hasMany(Test, { as: 'updatedTest', foreignKey: 'updatedByUserId' });
Test.belongsTo(User, { as: 'createdBy', foreignKey: 'createdByUserId',allowNull: false });
Test.belongsTo(User, { as: 'updatedBy', foreignKey: 'updatedByUserId',allowNull: false });

Theme.hasOne(Test);
Test.belongsTo(Theme, {
    foreignKey: {
        name: 'themeId',
        allowNull: false
    }
});

// СВЯЗАН:
// Test, User
const UserTestAnswer = sequelize.define('user_test_answers', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, //номер ответа
    selectedAnswers: {type: DataTypes.JSONB, defaultValue: []}
});
Test.hasMany(UserTestAnswer);
UserTestAnswer.belongsTo(Test, {
    foreignKey: {
        name: 'testId',
        allowNull: false
    }
});

User.hasMany(UserTestAnswer);
UserTestAnswer.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
});



// СВЯЗАН:
// User
const AdminRoleRequest = sequelize.define('admin_role_requests', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, //номер запроса
    role: {type: DataTypes.ENUM('USER', 'ADMIN'), allowNull: false},
    isThereResponse: {type: DataTypes.BOOLEAN, defaultValue: false}, //просмотрено ли админом
    isApproved: {type: DataTypes.BOOLEAN,defaultValue: false}, //назначена роль?
    requestMessage: {type: DataTypes.STRING},
    responseMessage: {type: DataTypes.STRING},
    updatedByUserId: {type: DataTypes.INTEGER}
});
User.hasMany(AdminRoleRequest);
AdminRoleRequest.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
});

// СВЯЗАН:
// User
const Scores = sequelize.define('scores', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, //номер оценки
    score: {type: DataTypes.DOUBLE, allowNull: false}, //баллы
    rating: {type: DataTypes.DOUBLE,allowNull: false}, //оценка
});
User.hasMany(Scores);
Scores.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
});

// СВЯЗАН:
// TestAnswer, Scores
const UserTestScore = sequelize.define('user_test_scores', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, //номер оценки
});
UserTestAnswer.hasOne(UserTestScore);
UserTestScore.belongsTo(UserTestAnswer, {
    foreignKey: {
        name: 'userTestAnswerId',
        allowNull: false
    }
});

Scores.hasOne(UserTestScore);
UserTestScore.belongsTo(Scores, {
    foreignKey: {
        name: 'scoreId',
        allowNull: false
    }
});

// СВЯЗАН:
// Task, Scores
const TaskCreationScore = sequelize.define('task_creation_scores', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, //номер оценки
});
Task.hasOne(TaskCreationScore);
TaskCreationScore.belongsTo(Task, {
    foreignKey: {
        name: 'taskId',
        allowNull: false
    }
});

Scores.hasOne(TaskCreationScore);
TaskCreationScore.belongsTo(Scores, {
    foreignKey: {
        name: 'scoreId',
        allowNull: false
    }
});

// СВЯЗАН:
// TaskRating, Scores
const TaskEvaluationScore = sequelize.define('task_evaluation_scores', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, //номер оценки
});
TaskRating.hasOne(TaskEvaluationScore);
TaskEvaluationScore.belongsTo(TaskRating, {
    foreignKey: {
        name: 'taskRatingId',
        allowNull: false
    }
});

Scores.hasOne(TaskEvaluationScore);
TaskEvaluationScore.belongsTo(Scores, {
    foreignKey: {
        name: 'scoreId',
        allowNull: false
    }
});

// СВЯЗАН:
// Solution, Scores
const TaskSolutionScore = sequelize.define('task_solution_scores', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, //номер оценки
});
Solution.hasOne(TaskSolutionScore);
TaskSolutionScore.belongsTo(Solution, {
    foreignKey: {
        name: 'solutionId',
        allowNull: false
    }
});

Scores.hasOne(TaskSolutionScore);
TaskSolutionScore.belongsTo(Scores, {
    foreignKey: {
        name: 'scoreId',
        allowNull: false
    }
});

export {
    Database,
    User,
    Subscriber,//-
    Task,
    AutoTaskCheck,//-
    Solution,
    SolutionComment,
    SolutionLike,
    Module,
    Theme,
    DifficultyLevelsOfTheme,
    Test,
    UserTestAnswer,
    TaskRating,//-
    AdminRoleRequest,
    Scores,
    UserTestScore,
    TaskCreationScore,//-
    TaskEvaluationScore,//-
    TaskSolutionScore//-
};
