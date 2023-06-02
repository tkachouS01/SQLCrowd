import {makeAutoObservable, toJS} from "mobx";

export default class TaskStore {
    constructor() {
        this._databases=[];
        this._databasesData=[];
        this._currentTask = {};
        this._allTasks = [];
        makeAutoObservable(this)
    }
    setDatabases(databases) {
        this._databases = databases;
    }
    get databases() {
        return toJS(this._databases);
    }

    setDatabasesData(databasesData) {
        this._databasesData = databasesData;
    }
    get databasesData() {
        return toJS(this._databasesData);
    }

    setCurrentTask(currentTask) {
        this._currentTask = currentTask;
    }
    get currentTask() {
        return toJS(this._currentTask);
    }

    setAllTasks(allTasks) {
        this._allTasks = allTasks;
    }
    get allTasks() {
        return toJS(this._allTasks);
    }
}