import {makeAutoObservable, toJS} from "mobx";

export default class ThemesStore {
    constructor() {
        this._themes = [];
        this._currentTheme = {};

        makeAutoObservable(this)
    }

    setThemes(themes) {
        this._themes = themes;
    }

    get themes() {
        return toJS(this._themes);
    }

    setCurrentTheme(currentTheme) {
        this._currentTheme = currentTheme;
    }

    get currentTheme() {
        return toJS(this._currentTheme);
    }
}