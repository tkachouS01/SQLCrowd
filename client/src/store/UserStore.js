import {makeAutoObservable, toJS} from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._user = {};
        this._users = [];
        this._errorMessage = {};
        this._isLoading = false;
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

    setErrorMessage(status, message){
        this._errorMessage={status, message};
    }

    get errorMessage() {
        return toJS(this._errorMessage);
    }

    setIsLoading(bool) {
        this._isLoading = bool;
    }

    get isLoading (){
        return toJS(this._isLoading);
    }
}