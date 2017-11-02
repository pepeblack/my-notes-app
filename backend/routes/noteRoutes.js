const express = require('express');
const router = express.Router();
const notes = require('../controller/notesController.js');

router.get("/", notes.getNotes);
router.post("/", notes.createNote);
router.post("/:id/", notes.updateNote);
router.get("/:id/", notes.showNote);
router.delete("/:id/", notes.deleteNote);

module.exports = router;