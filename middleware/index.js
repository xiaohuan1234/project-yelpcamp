var Campground = require("../models/campground"),
    Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "please log in");
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
    }
}

middlewareObj.campgroundIsAuthorized = function(req, res, next) {
    console.log("checking if campgroundIsAuthorized");
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err) {
           console.log("error campgroundIsAuthorized");
           req.flash("error", "can't find the campground");
           res.redirect("/campgrounds");
       } else {
           console.log("no error campgroundIsAuthorized");
           if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
               console.log("yes campgroundIsAuthorized");
               return next();
           } else {
               console.log("campground not authorized");
               req.flash("error", "you are not authorized to change or delete this campground");
               res.redirect("/campgrounds");
           }
       }
    });
};

middlewareObj.commentIsAuthorized = function(req, res, next) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err) {
           req.flash("error", "can't find the comment");
           res.redirect("/campgrounds/"+req.params.id);
       } else {
           if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
               return next();
           } else {
               req.flash("error", "you are not authorized to change or delete this comment");
               res.redirect("/campgrounds/"+req.params.id);
           }
       }
    });
};

module.exports = middlewareObj;