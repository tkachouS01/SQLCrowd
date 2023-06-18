import {makeAutoObservable, toJS} from "mobx";

export default class TestStore {
    constructor() {
        this._testInfo = {};
        this._questions = [];
        this._answers = [];
        this._correctAnswers = [];
        this._selectedAnswers = [];
        this._currentQuestionIndex = null;
        this._readResult = false;

        makeAutoObservable(this)
    }

    setTestInfo(testInfo) {
        this._testInfo = testInfo;
    }

    get testInfo() {
        return toJS(this._testInfo);
    }

    setAllQuestions(questions) {
        this._questions = questions;
    }

    get allQuestions() {
        return toJS(this._questions);
    }

    setAllAnswers(answers) {
        this._answers = answers;
    }

    get allAnswers() {
        return toJS(this._answers);
    }

    setCorrectAnswers(correctAnswers) {
        this._correctAnswers = correctAnswers;
    }

    get correctAnswers() {
        return toJS(this._correctAnswers);
    }

    setSelectedAnswers(selectedAnswers) {
        this._selectedAnswers = selectedAnswers;
    }

    get selectedAnswers() {
        return toJS(this._selectedAnswers);
    }

    setCurrentQuestionIndex(currentQuestionIndex) {
        this._currentQuestionIndex = currentQuestionIndex;
    }

    get currentQuestionIndex() {
        return toJS(this._currentQuestionIndex);
    }

    setReadResult(readResult) {
        this._readResult = readResult;
    }

    get readResult() {
        return toJS(this._readResult);
    }
}