var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");
    
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: String,
    email: String,
    phone: String,
    profilePicture: String,
    backgroundPicture: String,
    isAdmin: {
        type: Boolean,
        default: false,
    }
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

module.exports = User;