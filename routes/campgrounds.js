var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");

// Index
router.get("/", function(req, res){
    Campground.find({}, function(err, results) {
        if(!err) {
            res.render("index", {campgrounds: results});
        } else {
            req.flash("error", err.message);
        }
    });
});

// New
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("./campground/new");
});

// Create
router.post("/", middleware.isLoggedIn, function(req, res){
    var author = {
        id: req.user._id,
        name: req.user.username,
    };
    Campground.create(req.body.campground, function(err, createdCampground) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            createdCampground.author = author;
            createdCampground.save();
            req.flash("success", "successfully created the campground.");
            res.redirect("/campgrounds");
        }
    });
    
});

// Show

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err) {
           req.flash("error", err.message);
           res.redirect("back");
       } else {
           res.render("campground/show", {campground: foundCampground});
       }
    });
});


// Edit

router.get("/:id/edit", middleware.isLoggedIn, middleware.campgroundIsAuthorized, function(req, res){
    //console.log("retrieving id = "+req.params.id);
   Campground.findById(req.params.id, function(err, foundCampground) {
       if(err) {
           req.flash("error", err.message);
           res.redirect("/campgrounds");
       } else {
           res.render("../views/campground/edit", {campground: foundCampground});
       }
   }) 
});

// Update

router.put("/:id", middleware.isLoggedIn, middleware.campgroundIsAuthorized, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "successfully udpated the campground!")
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

// Destroy

router.delete("/:id", middleware.isLoggedIn, middleware.campgroundIsAuthorized, function(req, res) {
    Campground.findByIdAndDelete(req.params.id, function(err, result) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "successfully deleted the campground!");
            res.redirect("/campgrounds");
        }
    })
});


module.exports = router;