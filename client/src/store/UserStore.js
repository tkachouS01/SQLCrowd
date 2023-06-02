import {makeAutoObservable, toJS} from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._user = {};
        this._users = [];
        this._currentProfile = {};
        this._errorMessage = {};
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    get isAuth() {
        return toJS(this._isAuth);
    }

    setUser(user) {
        this._user = user;
    }

    get user() {
        return toJS(this._user);
    }

    setUsers(users) {
        this._users = users;
    }

    get users() {
        return toJS(this._users);
    }
    setCurrentProfile(currentProfile) {
        this._currentProfile = currentProfile;
    }

    get currentProfile() {
        return toJS(this._currentProfile);
    }

    setErrorMessage(status, message){
        this._errorMessage={status, message};
    }

    get errorMessage() {
        return toJS(this._errorMessage);
    }
}