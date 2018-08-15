var express         = require("express"),
    router          = express.Router({mergeParams: true}),
    Comment         = require("../models/comment"),
    Campground      = require("../models/campground"),
    middleware      = require("../middleware");

//new

router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("./comment/new", {campground: foundCampground});
        }
    });
})

//create

router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            req.flash("error", err.messge);
            res.redirect("back");
        } else {
            Comment.create(req.body.comment, function(err, createdComment) {
                if(err) {
                    req.flash("error", err.messge);
                    res.redirect("back");
                } else {
                    createdComment.author.id = req.user._id;
                    createdComment.author.name = req.user.username;
                    createdComment.save();
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    req.flash("success", "successfully created your comment!");
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });

});


// Edit

router.get("/:comment_id/edit", middleware.isLoggedIn, middleware.commentIsAuthorized, function(req, res){
    //console.log("retrieving id = "+req.params.id);
   Comment.findById(req.params.comment_id, function(err, foundComment) {
       if(err) {
           req.flash("error", err.messge);
           res.redirect("back");
       } else {
           //console.log("found: ");
           //console.log(result);
           res.render("../views/comment/edit", {comment: foundComment, campground_id: req.params.id});
       }
   }) 
});

// Update

router.put("/:comment_id", middleware.isLoggedIn, middleware.commentIsAuthorized, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            req.flash("error", err.messge);
        } else {
            req.flash("success", "successfully updated the comment");
        }
        res.redirect("/campgrounds/"+req.params.id);
    })
});

// Destroy

router.delete("/:comment_id", middleware.isLoggedIn, middleware.commentIsAuthorized, function(req, res) {
    Comment.findByIdAndDelete(req.params.comment_id, function(err, deletedComment) {
        if(err) {
            req.flash("error", err.messge);
        } else {
            req.flash("success", "successfully deleted the comment.");
        }
        res.redirect("/campgrounds/"+req.params.id);
    })
});

module.exports = router;