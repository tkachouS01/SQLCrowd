import sequelize from '../db.js'
import {DataTypes} from 'sequelize'

const Database = sequelize.define('databases', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    tables: {type: DataTypes.JSONB, allowNull: false}
});

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

const Module = sequelize.define('modules', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.TEXT},
    isAvailable: {type: DataTypes.BOOLEAN, defaultValue: false},
    createdByUserId: {type: DataTypes.INTEGER},
    updatedByUserId: {type: DataTypes.INTEGER}
});
User.hasMany(Module, {as: 'createdModule', foreignKey: 'createdByUserId'});
User.hasMany(Module, {as: 'updatedModule', foreignKey: 'updatedByUserId'});
Module.belongsTo(User, {as: 'createdBy', foreignKey: 'createdByUserId', allowNull: false});
Module.belongsTo(User, {as: 'updatedBy', foreignKey: 'updatedByUserId', allowNull: false});

const Theme = sequelize.define('themes', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: ''},
    description: {type: DataTypes.TEXT, defaultValue: ''},
    sqlCommands: {type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: []},
    numEvaluationTasks: {type: DataTypes.INTEGER, defaultValue: 0},
    numCreateTasks: {type: DataTypes.INTEGER, defaultValue: 0},
    isAvailable: {type: DataTypes.BOOLEAN, defaultValue: false},
    createdByUserId: {type: DataTypes.INTEGER},
    updatedByUserId: {type: DataTypes.INTEGER}
});
User.hasMany(Theme, {as: 'createdThemes', foreignKey: 'createdByUserId'});
User.hasMany(Theme, {as: 'updatedThemes', foreignKey: 'updatedByUserId'});
Theme.belongsTo(User, {as: 'createdBy', foreignKey: 'createdByUserId', allowNull: false});
Theme.belongsTo(User, {as: 'updatedBy', foreignKey: 'updatedByUserId', allowNull: false});

Module.hasMany(Theme);
Theme.belongsTo(Module, {
    foreignKey: {
        name: 'moduleId',
        allowNull: false
    }
});

const DifficultyLevelsOfTheme = sequelize.define('difficulty_level_of_themes', {
    testSolution: {type: DataTypes.INTEGER, defaultValue: 1},
    taskSolution: {type: DataTypes.INTEGER, defaultValue: 0},
    taskCreation: {type: DataTypes.INTEGER, defaultValue: 0},
    taskEvaluation: {type: DataTypes.INTEGER, defaultValue: 0}
});
Theme.hasOne(DifficultyLevelsOfTheme);
DifficultyLevelsOfTheme.belongsTo(Theme, {
    foreignKey: {
        name: 'themeId',
        allowNull: false
    }
});

const Task = sequelize.define('tasks', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    description: {type: DataTypes.STRING},
    verified: {type: DataTypes.BOOLEAN, defaultValue: false},
    inBank: {type: DataTypes.BOOLEAN, defaultValue: null}
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

const AutoTaskCheck = sequelize.define('auto_task_checks', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    simpleConditionCheck: {type: DataTypes.FLOAT},
    complexConditionCheck: {type: DataTypes.FLOAT},
    checkingSyntaxOfCode: {type: DataTypes.BOOLEAN, defaultValue: false},
});
Task.hasOne(AutoTaskCheck);
AutoTaskCheck.belongsTo(Task, {
    foreignKey: {
        name: 'taskId',
        allowNull: false
    }
});

const Solution = sequelize.define('solutions', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    isAuthor: {type: DataTypes.BOOLEAN, defaultValue: false},
    attempts: {type: DataTypes.INTEGER, defaultValue: 0},
    code: {type: DataTypes.STRING},
    verified: {type: DataTypes.BOOLEAN, defaultValue: false},
    finished: {type: DataTypes.BOOLEAN, defaultValue: false}
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

const TaskRating = sequelize.define('task_ratings', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rating: {type: DataTypes.INTEGER, allowNull: false},
    verified: {type: DataTypes.BOOLEAN, defaultValue: null},
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

const SolutionComment = sequelize.define('solution_comments', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    content: {type: DataTypes.TEXT, allowNull: false},
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

const SolutionLike = sequelize.define('solution_likes', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    isLiked: {type: DataTypes.BOOLEAN, defaultValue: true}
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

const Test = sequelize.define('tests', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    questions: {type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: []},
    answers: {type: DataTypes.JSONB, defaultValue: []},
    correctAnswers: {type: DataTypes.JSONB, defaultValue: []},
    isAvailable: {type: DataTypes.BOOLEAN, defaultValue: false},
    createdByUserId: {type: DataTypes.INTEGER},
    updatedByUserId: {type: DataTypes.INTEGER}
});
User.hasMany(Test, {as: 'createdTest', foreignKey: 'createdByUserId'});
User.hasMany(Test, {as: 'updatedTest', foreignKey: 'updatedByUserId'});
Test.belongsTo(User, {as: 'createdBy', foreignKey: 'createdByUserId', allowNull: false});
Test.belongsTo(User, {as: 'updatedBy', foreignKey: 'updatedByUserId', allowNull: false});

Theme.hasOne(Test);
Test.belongsTo(Theme, {
    foreignKey: {
        name: 'themeId',
        allowNull: false
    }
});

const UserTestAnswer = sequelize.define('user_test_answers', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
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

const AdminRoleRequest = sequelize.define('admin_role_requests', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    role: {type: DataTypes.ENUM('USER', 'ADMIN'), allowNull: false},
    isThereResponse: {type: DataTypes.BOOLEAN, defaultValue: false},
    isApproved: {type: DataTypes.BOOLEAN, defaultValue: false},
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

const Scores = sequelize.define('scores', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    score: {type: DataTypes.DOUBLE, allowNull: false},
    rating: {type: DataTypes.DOUBLE, allowNull: false},
});
User.hasMany(Scores);
Scores.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
});

const UserTestScore = sequelize.define('user_test_scores', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
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

const TaskCreationScore = sequelize.define('task_creation_scores', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
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

const TaskEvaluationScore = sequelize.define('task_evaluation_scores', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
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

const TaskSolutionScore = sequelize.define('task_solution_scores', {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
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
    Task,
    AutoTaskCheck,
    Solution,
    SolutionComment,
    SolutionLike,
    Module,
    Theme,
    DifficultyLevelsOfTheme,
    Test,
    UserTestAnswer,
    TaskRating,
    AdminRoleRequest,
    Scores,
    UserTestScore,
    TaskCreationScore,
    TaskEvaluationScore,
    TaskSolutionScore
};