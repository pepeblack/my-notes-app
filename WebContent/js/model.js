/**
 * The model
 */

/**
 * Variable to hold class properties privacy
 */
let notePrivates = new WeakMap();
let noteListPrivates = new WeakMap();
let ratingPrivates = new WeakMap();

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
		let note = new Note(noteList.length , "", "", new Rating(5, 0), "", new Date(), "");
		noteList.push(note);
		return note;
	}
	
	/**
	 * Finds the note with the given id
	 */
	find(id){
		return this.notes.find((note, i) => {
			return note.id == id;
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
		JSON.stringify();
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
		for (var i in objList) {
			noteList.push(Note.fromJSON(objList[i]));
		}
		
		return new NoteList(noteList);
	}
	
}

/**
 * Class represents a single node
 */
export class Note {
	constructor(id, titel, description, rating, doDate, createDate, done) {
		notePrivates.set(this, {id, titel, description, rating, doDate, createDate, done})
	}
	
	/**
	 * The id of this note
	 */
	get id() {
		return notePrivates.get(this).id;
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
		notePrivates.get(this).doDate = doDate;rating
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
	 * conferts to json format
	 */
	toJSON() {
		return notePrivates.get(this);
	}

	static fromJSON(json) {
		return new Note (json.id, json.titel, json.description, json.rating, json.doDate, json.createDate, json.done);
	}
};


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
	 * conferts to json format
	 */
	toJSON() {
		return ratingPrivates.get(this);
	}

	static fromJSON(json) {
		return new Rating (json.max, json.current);
	}
};