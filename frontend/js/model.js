/**
 * The model
 */

/**
 * Variable to hold class properties privacy
 */
let notePrivates = new WeakMap();
let noteListPrivates = new WeakMap();
let ratingPrivates = new WeakMap();
let userPrivates = new WeakMap();

/**
 * Class represent the list of notes 
 */
export class NoteList {
	/**
	 * Constructor
	 */
	constructor(noteList) {
		noteListPrivates.set(this, noteList);
	}

	/**
	 * Returns the list of all notes
	 */
	get notes() {
		return noteListPrivates.get(this);
	}
	
	/**
	 * Creates a new empty note and adds it to the list
	 */
	createNote() {
		let noteList = noteListPrivates.get(this);
		let note = new Note(noteList.length, "" , "", "", new Rating(5, 0), "", new Date(), "");
		noteList.push(note);
		return note;
	}
	
	/**
	 * Finds the note with the given id
	 */
	find(_id){
		return this.notes.find((note) => {
			return note._id == _id;
		});
	}
	
	/**
	 * returns the notes list sorted by the given sorter function 
	 */
	sort(sorter) {
		return this.notes.sort(sorter);
	}
	
	/**
	 * returns the notes list filtered by the given filter function 
	 */
	filter(filter) {
		return this.notes.filter(filter);
	}

	/**
	 * Stores the current list of notes to storage
	 */
	store() {
		sessionStorage.setItem('noteList', JSON.stringify(this.toJSON()));
	}

	/**
	 * conferts to json format
	 */
	toJSON() {
		return noteListPrivates.get(this);
	}
	
	/**
	 * Static method to load the notes list from storage
	 */
	static fromStorage() {
		let objList = JSON.parse(sessionStorage.getItem('noteList'));
		if (!objList) {
			objList = [];
			sessionStorage.setItem('noteList', JSON.stringify(objList));
		}

		let noteList = [];
		for (let i in objList) {
			noteList.push(Note.fromJSON(objList[i]));
		}
		
		return new NoteList(noteList);
	}

    /**
	 * Static method to load the notes list from json
     * @param json
     * @returns {NoteList}
     */
    static fromJSON(json) {
        let noteList = [];
        for (let i in json) {
            noteList.push(Note.fromJSON(json[i]));
        }
        return new NoteList(json);
    }
}

/**
 * Class represents a single node
 */
export class Note {
	constructor(_id, user, state, titel, description, rating, doDate, createDate, done) {
        if (state === undefined){
            state = "NEW";
        }
        if (user === undefined){
            user = User.fromStorage().email;
        }
		if (rating === undefined){
			rating = new Rating(5, 0);
		}
        if (createDate === undefined){
            createDate = new Date();
        }
		notePrivates.set(this, {_id, user, state, titel, description, rating, doDate, createDate, done})
	}
	
	/**
	 * The id of this note
	 */
	get _id() {
		return notePrivates.get(this)._id;
	}

    /**
     * The user of this note
     */
    get user() {
        return notePrivates.get(this).user;
    }
    set user(user) {
        notePrivates.get(this).user = user;
    }

    /**
     * The state of the note
     */
    get state() {
        return notePrivates.get(this).state;
    }
    set state(state) {
        notePrivates.get(this).user = state;
    }

	/**
	 * The titel of the note
	 */
	get titel() {
		return notePrivates.get(this).titel;
	}
	set titel(titel) {
		notePrivates.get(this).titel = titel;
	}

	/**
	 * The descrition of the note
	 */
	get description() {
		return notePrivates.get(this).description;
	}
	set description(description) {
		notePrivates.get(this).description = description;
	}

	/**
	 * The rating of the note
	 */
	get rating() {
		return notePrivates.get(this).rating;
	}
	set rating(rating) {
		notePrivates.get(this).rating = rating;
	}

	/**
	 * The do date to the note
	 */
	get doDate() {
		return notePrivates.get(this).doDate;
	}
	set doDate(doDate) {
		notePrivates.get(this).doDate = doDate;
	}

	/**
	 * The creation date to the note
	 */
	get createDate() {
		return notePrivates.get(this).createDate;
	}

	/**
	 * Indicates if the note is done
	 */
	get done() {
		return notePrivates.get(this).done;
	}
	set done(done) {
		notePrivates.get(this).done = done;
	}
	
	/**
	 * converts to json format
	 */
	toJSON() {
		return notePrivates.get(this);
	}

	static fromJSON(json) {
		return new Note (json._id, json.user, json.state, json.titel, json.description, json.rating, json.doDate, json.createDate, json.done);
	}
}


/**
 * Class represents a rating
 */
export class Rating {
	constructor(max, current) {
		ratingPrivates.set(this, {max, current})
	}

	/**
	 * The maximum rating
	 */
	get max() {
		return ratingPrivates.get(this).max;
	}
	set max(max) {
		ratingPrivates.get(this).max = max;
	}

	/**
	 * The current rating
	 */
	get current() {
		return ratingPrivates.get(this).current;
	}
	set current(current) {
		ratingPrivates.get(this).current = current;
	}
	
	/**
	 * converts to json format
	 */
	toJSON() {
		return ratingPrivates.get(this);
	}

	static fromJSON(json) {
		return new Rating (json.max, json.current);
	}
}



/**
 * Class representing the User
 */
export class User {
    /**
	 * The constructor
     * @param email the email of the user
     * @param token the token
     */
    constructor(email, token) {
        userPrivates.set(this, {email, token})
    }

    /**
     * The email of the user
     */
    get email() {
        return userPrivates.get(this).email;
    }
    set email(email) {
        userPrivates.get(this).email = email;
    }

    /**
     * The token
     */
    get token() {
        return userPrivates.get(this).token;
    }
    set token(token) {
        userPrivates.get(this).token = token;
    }

    /**
	 * Checks if the user is logged in
     * @returns {boolean} True if logged in
     */
    isLoggedIn(){
    	if (this.token !== undefined && this.token.length > 0) {
    		return true;
		} else {
            return false;
		}
	}

    /**
	 * Logout the current user. Will delete the token
     */
	logout(){
    	this.token = undefined;
    	this.store();
	}

    /**
     * Stores the current list of notes to storage
     */
    store() {
        sessionStorage.setItem('token', JSON.stringify(this.toJSON()));
    }

    /**
     * converts to json format
     */
    toJSON() {
        return userPrivates.get(this);
    }

    /**
     * Static method to load the user from storage
     */
    static fromStorage() {
        let obj = JSON.parse(sessionStorage.getItem('token'));
        if (obj) {
            return new User(obj.email, obj.token);
        } else {
            return new User("", "");
		}
    }
}