import {makeAutoObservable, toJS} from "mobx";

export default class SolutionStore {
    constructor() {
        this._oneSolution = {};
        this._allSolutions = [];
        this._selectedSolution = {};
        this._result = {success: false, fields:[],rows:[]};
        //this._codeSolution = '';
        makeAutoObservable(this)
    }

    setSolution(solution) {
        this._oneSolution = solution;
    }

    get solution() {
        return toJS(this._oneSolution);
    }

    setAllSolutions(solutions) {
        this._allSolutions = solutions;
    }

    get allSolutions() {
        return toJS(this._allSolutions);

    }

    setSelectedSolution(selectedSolution) {
        this._selectedSolution = selectedSolution;
    }

    get selectedSolution() {
        return toJS(this._selectedSolution);
    }

    setResult(result) {
        this._result = result;
    }

    get result() {
        return toJS(this._result);
    }
}