var mongoose    = require("mongoose");

//step 1: create schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: String,
    }
});

//step 2: link schema to collection, create class handle
var Campground = mongoose.model("Campground", campgroundSchema);

// step 3: export
module.exports = Campground;