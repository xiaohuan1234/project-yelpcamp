var mongoose    = require("mongoose");

//step 1: create schema
var commentSchema = new mongoose.Schema({
    text: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: String,
    }
});

//step 2: link schema to collection, create class handle
var Comment = mongoose.model("Comment", commentSchema);

// step 3: export
module.exports = Comment;