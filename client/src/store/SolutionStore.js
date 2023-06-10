import {makeAutoObservable, toJS} from "mobx";

export default class SolutionStore {
    constructor() {
        this._oneSolution = {};
        this._allSolutions = [];
        this._result = {success: false, fields:[],rows:[]};
        //this._codeSolution = '';
        makeAutoObservable(this)
    }

    setOneSolution(solution) {
        this._oneSolution = solution;
    }

    get oneSolution() {
        return toJS(this._oneSolution);
    }

    setAllSolutions(solutions) {
        this._allSolutions = solutions;
    }

    get allSolutions() {
        return toJS(this._allSolutions);

    }

    setResult(result) {
        this._result = result;
    }

    get result() {
        return toJS(this._result);
    }
}