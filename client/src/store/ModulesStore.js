import {makeAutoObservable, toJS} from "mobx";

export default class ModulesStore {
    constructor() {
        this._modules = [];

        makeAutoObservable(this)
    }

    setModules(modules) {
        this._modules = modules;
    }

    get modules() {
        return toJS(this._modules);
    }
}