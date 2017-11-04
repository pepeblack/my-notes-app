import { NoteList, Note, Rating, User } from '/js/model.js';
import { Utils, RATING_MAX, DATE_FORMAT_SHORT } from '/js/utils.js';

/**
 * The controler of the nodes app
 */

/**
 * Variable to hold class properties privacy
 */
let mainControlerPrivates = new WeakMap();
let newNodeControlerPrivates = new WeakMap();

/**
 * Represent the main controler 
 */
export class MainControler {
	/**
	 * Constructor
	 */
	constructor(model, restClient, view) {
		mainControlerPrivates.set(this, {model,restClient,
			                             notesList: document.getElementById("notes"),
			                             notesListSorter: (a,b) => {return a._id - b._id;},
			                             notesListFilter: (a) => {return (a.state === "NEW");},
			                             noteTemplate: document.getElementById('note_template').innerHTML,
			                             ratingTemplate: document.getElementById('rating_template').innerHTML,
            							 loginButton: view.getElementById('login'),
							             logoutButton: view.getElementById('logout'),
			                             newNoteButton: view.getElementById('newNote'),
			                             styleButton : view.getElementById('style'),
			                             styleSheet : view.getElementById('stylesheet'),
			                             byFinishDateButton: view.getElementById('byFinishDate'),
			                             byCreationDateButton: view.getElementById('byCreationDate'),
			                             byImportanceBotton: view.getElementById('byImportance'),
			                             showFinishedButton: view.getElementById('showFinished')});
	};
	
	/**
	 * Render the UI
	 */
	renderUI(){
		let privates = mainControlerPrivates.get(this);
		privates.newNoteButton.onclick = function () {
			window.location.href = "./newNote.html";
        };

        privates.loginButton.onclick = function () {
            privates.restClient.login("user", "password").then( () => {
                window.controler.updateStatus();
			});
        };

        privates.logoutButton.onclick = function () {
            privates.restClient.logout();
            window.controler.updateStatus();
        };

        privates.styleButton.onclick = function () {
            Utils.switchStyle(privates.styleSheet, privates.styleButton)
        };
        Utils.loadStyle(privates.styleSheet, privates.styleButton);

        privates.byFinishDateButton.onclick = function () {
        	privates.notesListSorter = (a,b) => {return moment(a.doDate).diff(moment(b.doDate));};
			window.controler.renderNotes();
        };

        privates.byCreationDateButton.onclick = function () {
        	privates.notesListSorter = (a,b) => {return moment(a.createDate).diff(moment(b.createDate));};
			window.controler.renderNotes();
        };

        privates.byImportanceBotton.onclick = function () {
        	privates.notesListSorter = (a,b) => {return b.rating.current - a.rating.current;};
			window.controler.renderNotes();
        };

        privates.showFinishedButton.onclick = function () {
        	if (privates.showFinishedButton.checked) {
                privates.notesListFilter = (a) => {return a.state === "DONE";}
			} else {
                privates.notesListFilter = (a) => {return a.state === "NEW";}
			}
			window.controler.renderNotes();
        };

        // set default sorter
        privates.byFinishDateButton.checked = true;
        privates.notesListSorter = (a,b) => {return moment(a.doDate).diff(moment(b.doDate));};

        this.updateStatus();
	};

    /**
	 * Update the status of the User
     */
	updateStatus() {
        let privates = mainControlerPrivates.get(this);

		let user = User.fromStorage();
        let jsUser = document.getElementsByClassName('js-user');
        for (let i = 0; i < jsUser.length; i++) {
            jsUser[i].style.display = user.isLoggedIn() ? "grid" : "none";
            jsUser[i].style.visibility = user.isLoggedIn() ? "visible" : "hidden";
        }

        let jsNoUser = document.getElementsByClassName('js-no-user');
        for (let i = 0; i < jsNoUser.length; i++) {
            jsNoUser[i].style.display = user.isLoggedIn() ? "none" : "grid";
        }

        if (user.isLoggedIn()) {
            privates.restClient.getNotes().then( (noteList) => {
                privates.model = NoteList.fromJSON(noteList);
                this.renderNotes();
            });
		}
	};

    /**
     * Render the Notes
     */
    renderNotes() {
        let privates = mainControlerPrivates.get(this);

        let noteTemplateData = {
            "notes": privates.model.filter(privates.notesListFilter).sort(privates.notesListSorter),
            "renderr_rating": function () {
                let isActive = [];
                let isNotActive = [];
                for (let i = 0; i < this.rating.max; i++) {
                    i < this.rating.current ? isActive.push({"data-index": i}) : isNotActive.push({"data-index": i})
                }
                return Mustache.render(privates.ratingTemplate, {"isActive": isActive, "isNotActive": isNotActive});
            },
            "renderr_description": function () {
                return Utils.cutText(this.description, 2);
            },
            "renderr_doDate": function () {
                if (this.state === "NEW") {
                    return Utils.getFormatedDateLong(this.doDate);
                }
            },
            "renderr_reminig": function () {
                if (this.state === "DONE") {
                    return Utils.getDaysPased(this.done);
                } else {
                    return Utils.getDaysRemining(this.doDate);
                }
            },
            "renderr_done": function () {
                return this.done ? "checked" : "";
            }
        };
        privates.notesList.innerHTML = Mustache.render(privates.noteTemplate, noteTemplateData);

        // add handler for finished button
        let finishedButton = document.querySelectorAll('input[name="finished"]');
        for (let i = 0; i < finishedButton.length; i++) {
            finishedButton[i].addEventListener("click", function (event) {
                let note = privates.model.find([event.target.dataset.index]);
                if (event.target.checked) {
                    note.done = moment().toDate();
                    note.state = "DONE"
                } else {
                    note.done = "";
                    note.state = "NEW"
                }
                privates.restClient.updateNote(note).then(() => {
                    window.controler.renderUI();
                });
            });
        }

        // add handler for delete button
        let deleteButton = document.querySelectorAll('button[name="delete"]');
        for (let i = 0; i < deleteButton.length; i++) {
            deleteButton[i].addEventListener("click", function (event) {
                let note = privates.model.find([event.target.dataset.index]);
                privates.restClient.deleteNote(note).then(() => {
                    window.controler.renderUI();
                });
            });
        }
    }
}


/**
 * Represent the main controler 
 */
export class NewNoteControler {
	/**
	 * Constructor
	 */
	constructor(model, restClient, view) {
        newNodeControlerPrivates.set(this, {model,restClient,
        									note : null,
                                            picker : null,
                                            logoutButton: view.getElementById('logout'),
								            styleButton : view.getElementById('style'),
								            styleSheet : view.getElementById('stylesheet'),
        									cancelButton: view.getElementById('cancel'),
        									saveButton: view.getElementById('save'),
        									titelInput: view.getElementById('titel'),
                                            titelError: view.getElementById('titel-error'),
        									descriptionInput: view.getElementById('description'),
        									ratingControl: rating(view.querySelector('.c-rating'), 0, RATING_MAX, function(rating) {}),
        									doDateInput: view.getElementById('datepicker'),
        									doDateSelected: view.getElementById('selected'),
                                            doDateError: view.getElementById('dodate-error'),
        });
	};
	
	/**
	 * Render the UI
	 */
	renderUI(){
		let privates = newNodeControlerPrivates.get(this);
		let id = Utils.getQueryVar("id");

        privates.logoutButton.onclick = function () {
            privates.restClient.logout();
            window.location.href = "./index.html";
        };

        Utils.loadStyle(privates.styleSheet, privates.styleButton);

        privates.styleButton.onclick = function () {
            Utils.switchStyle(privates.styleSheet, privates.styleButton)
        };

        Utils.loadStyle(privates.styleSheet, privates.styleButton);

        privates.cancelButton.onclick = function () {
			window.location.href = "./index.html";
        };
		privates.saveButton.onclick = function () {
            if (window.controler.validateInput()){
                window.controler.writeNote(id);
            }
        };

        privates.picker = new Pikaday(
	    {
	        field: privates.doDateInput,
	        minDate: new Date(),
	        format: DATE_FORMAT_SHORT,
	        onSelect: function() {
	        	privates.doDateSelected.innerHTML =  Utils.getDaysRemining(this.getMoment().toDate());
	        }
	    });

        this.loadNote(id);
	};

    /**
     * validates the input
     */
	validateInput(){
	    let error = true;
        let privates = newNodeControlerPrivates.get(this);
        let className = "";

        // At least the titel must be given
        if (privates.titelInput.value.length === 0) {
            className = privates.titelError.className.replace("input-valid", "input-not-valid");
            error = false;
        } else {
            className = privates.titelError.className.replace("input-not-valid", "input-valid");
        }
        privates.titelError.className = className;

        // A valid due date is required
        if (!moment(privates.doDateInput.value, DATE_FORMAT_SHORT).isValid()){
            className = privates.doDateError.className.replace("input-valid", "input-not-valid");
            error = false;
        } else {
            className = privates.doDateError.className.replace("input-not-valid", "input-valid");
        }
        privates.doDateError.className = className;

        return error;
    }


    /**
     * Writes the note
     */
	writeNote(id){
        let privates = newNodeControlerPrivates.get(this);

        privates.note.titel = privates.titelInput.value;
        privates.note.description = privates.descriptionInput.value;
        privates.note.rating.max = RATING_MAX;
        privates.note.rating.current = privates.ratingControl.getRating();
        privates.note.doDate = moment(privates.doDateInput.value, DATE_FORMAT_SHORT).toDate();

        if (id) {
            privates.restClient.updateNote(privates.note).then( () => {
                window.location.href = "./index.html";
            });
        } else {
            privates.restClient.addNote(privates.note).then( () => {
                window.location.href = "./index.html";
            });
        }
    }

    /**
     * Laods the note of the given id
     * @param id
     */
    loadNote(id){
        let privates = newNodeControlerPrivates.get(this);

        if (!id) {
            privates.note = new Note();
            return
        }

        privates.restClient.getNote(id).then( (note) => {
            privates.note = Note.fromJSON(note);
            privates.titelInput.value = privates.note.titel;
            privates.descriptionInput.value = privates.note.description;
            privates.ratingControl.setRating(privates.note.rating.current);
            privates.doDateInput.value = Utils.getFormatedDateShort(privates.note.doDate);
            privates.doDateSelected.innerHTML = Utils.getDaysRemining(privates.note.doDate);
            privates.picker.setDate(Utils.getFormatedDateLong(privates.note.doDate));
        });

    }
}