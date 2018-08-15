var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    passport    = require("passport"),
    User        = require("../models/user"),
    Campground  = require("../models/campground"),
    Async       = require("async"),
    nodemailer  = require("nodemailer"),
    crypto      = require("crypto");

router.get("/login", function(req, res){
    res.render("login");
})

router.post("/login", 
         passport.authenticate("local", {
             successReturnToOrRedirect: "/campgrounds",
             failureRedirect: "/login",
             successFlash: "successfully logged in!!!",
             failureFlash: "failed to log in!",
         }),
         function(req, res){});

router.get("/register", 
        function(req, res) {
            res.render("register");
        });

router.post("/register", 
         function(req, res) {
             var newUser = req.body.newUser;
             newUser.isAdmin = req.body.adminCode === "secret";
             newUser.username = toTitleCase(newUser.username);
             User.register(newUser, req.body.password, function(err, registeredUser) {
                 if(err) {
                     console.log("error registering");
                     req.flash("error", err.message);
                     res.redirect("/register");
                 } else {
                     req.body.username = newUser.username;
                     passport.authenticate("local", {failureFlash: "failed to register!"})(req, res, function(){
                         req.flash("success", "successfully registered!");
                         res.redirect("/campgrounds");
                     });
                 }
             });
         });
         
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "successfully signed out!");
    res.redirect("/login");
});

// show

router.get("/users/:username", function(req, res) {
    User.findOne({username:req.params.username}, function(err, foundUser) {
        if(err) {
            req.flash("error", "can't find the user by name " + req.params.username);
            res.redirect("/");
        } else {
            Campground.find({"author.id": foundUser._id}, function(err, foundCampgrounds){
               if(err) {
                   console.log("can't find any campground by this user");
                   res.redirect("/campgrounds");
               } else {
                   console.log("this user has created these campgrounds:");
                   console.log(foundCampgrounds);
                   res.render("./user/show", {user: foundUser, campgrounds: foundCampgrounds});
               }
            });
            
        }
    })
})

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
module.exports = router;
