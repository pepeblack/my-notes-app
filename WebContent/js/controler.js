import { NoteList, Note, Rating } from '/js/model.js';
import { getQueryVar, getFormatedDateLong, getFormatedDateShort, getDaysRemining, getDaysPased, cutText, RATING_MAX, DATE_FORMAT_SHORT } from '/js/utils.js';

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
	constructor(model, view) {
		let newNoteButton = view.getElementById('newNote');
		let styleButton = view.getElementById('style');
		let byFinishDateButton = view.getElementById('byFinishDate');
		let byCreationDateButton = view.getElementById('byCreationDate');
		let byImportanceBotton = view.getElementById('byImportance');
		let showFinishedButton = view.getElementById('showFinished');
		let ratingTemplate = document.getElementById('rating_template').innerHTML;
		let noteTemplate = document.getElementById('note_template').innerHTML;
		let notesList = document.getElementById("notes");
		let notesListSorter = function(a,b){
			return a.id - b.id;
		}
		let notesListFilter = function(a,b){
			return true;
		}
		
		mainControlerPrivates.set(this, {model, 
			                             notesList, 
			                             notesListSorter,
			                             notesListFilter,
			                             noteTemplate, 
			                             ratingTemplate,
			                             newNoteButton,
			                             styleButton, 
			                             byFinishDateButton, 
			                             byCreationDateButton,
			                             byImportanceBotton,
			                             showFinishedButton});
	};
	
	/**
	 * Render the UI
	 */
	renderrUI(){
		var privates = mainControlerPrivates.get(this);
		privates.newNoteButton.onclick = function () {
			window.location.href = "./newNote.html";
        };
        privates.styleButton.onclick = function () {
			window.controler.renderrUI();
        };privates.notes
        privates.byFinishDateButton.onclick = function () {
        	privates.notesListSorter = function(a,b){
        		return moment(a.doDate).diff(moment(b.doDate));
    		}
			window.controler.renderrUI();
        };
        privates.byCreationDateButton.onclick = function () {
        	privates.notesListSorter = function(a,b){
        		return moment(a.createDate).diff(moment(b.createDate));
    		}
			window.controler.renderrUI();
        };
        privates.byImportanceBotton.onclick = function () {
        	privates.notesListSorter = function(a,b){
    			return a.rating.current - b.rating.current;
    		}
			window.controler.renderrUI();
        };
        privates.showFinishedButton.onclick = function () {
        	privates.notesListFilter = function(a){
    			return a.done;
    		}
			window.controler.renderrUI();
        };

		let noteTemplateData = {"notes"  : privates.model.filter(privates.notesListFilter).sort(privates.notesListSorter),
	            				"renderr_rating" : function () {
	            						let isActive = [];
	            						let isNotActive = [];
	            						for (let i = 0; i < this.rating.max; i++) {
	            							i < this.rating.current ? isActive.push({"data-index" : i}) : isNotActive.push({"data-index" : i}) 
	            						}	
	            						return Mustache.render(privates.ratingTemplate, {"isActive" : isActive , "isNotActive" : isNotActive});
	            					},
	            				"renderr_description" : function () {
	            						return cutText(this.description, 2);
	            					},
		            			"renderr_doDate" : function () {
	            						return getFormatedDateLong(this.doDate);
	            					},
		            			"renderr_reminig" : function () {
	            						if (this.done) {
	            							return getDaysPased(this.done);
	            						} else {
	            							return getDaysRemining(this.doDate);
	            						}
	            					},
			            		"renderr_done" : function () {
	            						return this.done?"checked" :"";
	            					}
			   				   };	
		privates.notesList.innerHTML = Mustache.render(privates.noteTemplate, noteTemplateData);
		
		var finished = document.querySelectorAll('input[name="finished"]');
		for (var i = 0; i < finished.length; i++) {
			finished[i].addEventListener("click", function() {
				if (this.checked) {
					privates.model.find([this.dataset.index]).done=moment().toDate();
				} else {
					privates.model.find([this.dataset.index]).done="";
				}
				privates.model.store();
				window.controler.renderrUI();
			});
		}
	};
};getFormatedDateLong


/**
 * Represent the main controler 
 */
export class NewNoteControler {
	/**
	 * Constructor
	 */
	constructor(model, view) {
		let cancelButton = view.getElementById('cancel');
		let saveButton = view.getElementById('save');
        let titelInput = view.getElementById('titel');
        let descriptionInput = view.getElementById('description');
        let ratingControl = rating(view.querySelector('.c-rating'), 0, RATING_MAX, function(rating) {});
        let doDateInput = view.getElementById('datepicker');
        let doDateSelected = view.getElementById('selected');
        let note;

        newNodeControlerPrivates.set(this, {model, 
        									note, 
        									cancelButton, 
        									saveButton, 
        									titelInput, 
        									descriptionInput, 
        									ratingControl, 
        									doDateInput,
        									doDateSelected
        									});
	};
	
	/**
	 * Render the UI
	 */
	renderrUI(){
		let privates = newNodeControlerPrivates.get(this);
		let id = getQueryVar("id");
	    
		privates.cancelButton.onclick = function () {
			window.location.href = "./index.html";
        };
		privates.saveButton.onclick = function () {
			if (!privates.note) { 
				privates.note = privates.model.createNote();
			}
			privates.note.titel = privates.titelInput.value;
			privates.note.description = privates.descriptionInput.value;
			privates.note.rating.max = RATING_MAX;
			privates.note.rating.current = privates.ratingControl.getRating();
			privates.note.doDate = moment(privates.doDateInput.value, DATE_FORMAT_SHORT).toDate();
			privates.model.store();
			window.location.href = "./index.html";
        };
		
	    let picker = new Pikaday(
	    {
	        field: privates.doDateInput,
	        minDate: new Date(),
	        format: DATE_FORMAT_SHORT,
	        onSelect: function() {
	        	privates.doDateSelected.innerHTML =  getDaysRemining(this.getMoment().toDate());
	        }
	    });

        if (id) {
        	privates.note = privates.model.find(id);
            privates.titelInput.value = privates.note.titel;
            privates.descriptionInput.value = privates.note.description;
            privates.ratingControl.setRating(privates.note.rating.current)
            privates.doDateInput.value = getFormatedDateShort(privates.note.doDate);
            privates.doDateSelected.innerHTML = getDaysRemining(privates.note.doDate);
    	    picker.setDate(getFormatedDateLong(privates.note.doDate));
        };
	};
};