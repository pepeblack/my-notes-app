import { NoteList } from '/js/model.js';
import { MainControler, NewNoteControler } from '/js/controler.js';

/**
 * define controler as global variable 
 */
var controler; 	

/**
 * Initialize the controller 
 */
window.onload = function () {
	var model = NoteList.fromStorage();
	var pageName = location.pathname.substring(1)
	
	switch (pageName) {
	case "newNote.html":
		window.controler = new NewNoteControler(model, document);
		break;
	default:
		window.controler = new MainControler(model, document);
		break;
	}
	window.controler.renderrUI();
}
