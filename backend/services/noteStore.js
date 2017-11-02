const Datastore = require('nedb');
const db = new Datastore({ filename: './backend/data/note.db', autoload: true });


function publicAddNote(note, currentUser, callback)
{
    db.insert(note, function(err, newDoc){
        if(callback){
            callback(err, newDoc);
        }
    });
}

function publicUpdate(note, currentUser, callback)
{
    db.update({_id: note._id, user : currentUser}, note, {returnUpdatedDocs:true}, function (err, count, doc) {
        callback(err, doc);
    });
}

function publicRemove(id, currentUser, callback)
{
    db.remove({_id: id}, {  }, function (err, count) {
        callback(err, count);
    });
}

function publicGet(id, currentUser, callback)
{
    db.findOne({ _id: id, user : currentUser }, function (err, doc) {
        callback( err, doc);
    });
}

function publicAll(currentUser, callback)
{
    db.find({user : currentUser}).exec(function (err, docs) {
        callback( err, docs);
    });
}

module.exports = {add : publicAddNote, updata : publicUpdate, delete : publicRemove, get : publicGet, all : publicAll};