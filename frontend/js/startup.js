import { NoteList } from '/js/model.js';
import { RestClient } from '/js/request.js';
import { MainControler, NewNoteControler } from '/js/controler.js';

/**
 * Initialize the controller 
 */
window.onload = function () {
	let model = NoteList.fromStorage();
    let restClient = new RestClient();
    let pageName = location.pathname.substring(1);
	
	switch (pageName) {
    case "newNote.html":
         window.controler = new NewNoteControler(model, restClient, document);
         break;
	default:
		window.controler = new MainControler(model, restClient, document);
		break;
	}
	window.controler.renderUI();
}
