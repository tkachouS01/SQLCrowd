import {makeAutoObservable, toJS} from "mobx";

export default class SolutionStore {
    constructor() {
<<<<<<< HEAD
        this._oneSolution = {};
        this._allSolutions = [];
        this._selectedSolution = {};
        this._result = {success: false, fields:[],rows:[]};
=======
        this._solution = {};
        this._solutions = [];
        this._selectedSolution = {};
>>>>>>> SQLCrowd/master
        //this._codeSolution = '';
        makeAutoObservable(this)
    }

    setSolution(solution) {
<<<<<<< HEAD
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
=======
        this._solution = solution;
    }

    get solution() {
        return toJS(this._solution);
    }

    setAllSolutions(solutions) {
        this._solutions = solutions;
    }

    get allSolutions() {
        return toJS(this._solutions);
>>>>>>> SQLCrowd/master
    }

    setSelectedSolution(selectedSolution) {
        this._selectedSolution = selectedSolution;
    }

    get selectedSolution() {
        return toJS(this._selectedSolution);
    }
<<<<<<< HEAD

    setResult(result) {
        this._result = result;
    }

    get result() {
        return toJS(this._result);
    }
=======
>>>>>>> SQLCrowd/master
/*
    setCodeSolution(codeSolution) {
        this._codeSolution = codeSolution;
    }

    get codeSolution() {
        return toJS(this._codeSolution);
    }
    */
}