import { User } from '/js/model.js';
import { Utils } from '/js/utils.js';

/**
 * Class to address the rest service
 */
export class RestClient {
    /**
     * Constructor
     */
    constructor() {
    }

    login(email, pwd) {
        return Utils.ajax("POST", "/login/", {email: email, pwd: pwd}).then( token => {
            let user = User.fromStorage();
            user.token = token;
            user.email = email;
            user.store();
        });
    }

    logout() {
        let user = User.fromStorage();
        user.logout();
    }


    isLoggedIn() {
        let user = User.fromStorage();
        return user.isLoggedIn();
    }

    getNotes() {
        return Utils.ajax("GET", "/notes/", undefined, Utils.loginHeader(User.fromStorage().token));
    }

    getNote(id) {
        return Utils.ajax("GET", `/notes/${id}`, undefined, Utils.loginHeader(User.fromStorage().token));
    }

    addNote(note) {
        return Utils.ajax("POST", "/notes/", {note: note}, Utils.loginHeader(User.fromStorage().token));
    }

    updateNote(note) {
        return Utils.ajax("POST", `/notes/${note._id}`, {note: note},  Utils.loginHeader(User.fromStorage().token));
    }

    deleteNote(note) {
        return Utils.ajax("DELETE", `/notes/${note._id}`, undefined,  Utils.loginHeader(User.fromStorage().token));
    }
}