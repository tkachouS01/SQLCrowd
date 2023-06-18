import {makeAutoObservable, toJS} from "mobx";

export default class RatingStore {
    constructor() {
        this._usersRating = [];
        makeAutoObservable(this)
    }

    setUsersRating(usersRating) {
        this._usersRating = usersRating
    }

    get usersRating() {
        return toJS(this._usersRating)
    }
}