const store = require("../services/noteStore.js");
const util = require("../util/security");


module.exports.getNotes = function(req, res)
{
    store.all(util.current(req), function (err, notes) {
        res.json(notes || {});
    })
};

module.exports.createNote = function(req, res)
{
    let note = store.add(req.body.note, util.current(req), function(err, note) {
        res.json(note);
    });
};

module.exports.showNote = function(req, res){
    store.get(req.params.id, util.current(req), function(err, note) {
        res.json(note);
    });
};

module.exports.updateNote =  function (req, res)
{
    store.updata(req.body.note, util.current(req), function(err, note) {
        res.json(note);
    });
};

module.exports.deleteNote =  function (req, res)
{
    store.delete(req.params.id, util.current(req), function(err, note) {
        res.json(note);
    });
};
