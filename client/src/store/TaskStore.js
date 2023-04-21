import {makeAutoObservable, toJS} from "mobx";

export default class TaskStore {
    constructor() {
        this._task = {};
        this._tasks = [];
        this._selectedTask = {};
        makeAutoObservable(this)
    }

    setTask(task) {
        this._task = task;
    }

    get task() {
        return toJS(this._task);
    }

    setTasks(tasks) {
        this._tasks = tasks;
    }

    get tasks() {
        return toJS(this._tasks);
    }

    setSelectedTask(task) {
        this._selectedTask = task;
    }

    get selectedTask() {
        return toJS(this._selectedTask);
    }
}