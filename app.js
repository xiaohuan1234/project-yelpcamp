var 
    // general requires (6)
    express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    methodOverride          = require("method-override"),
    flash                   = require("connect-flash"),
    
    // authentication requires (4)
    expressSession          = require("express-session"),
    passport                = require("passport"),
    localStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    
    // local requires including models and routes
    Campground              = require("./models/campground"),
    Comment                 = require("./models/comment"),
    User                    = require("./models/user"),
    Seed                    = require("./seed"),
    userRoutes              = require("./routes/users"),
    campgroundRoutes        = require("./routes/campgrounds"),
    commentRoutes           = require("./routes/comments");
    
mongoose.connect("mongodb://localhost/camp_website");

app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

app.use(expressSession({
    secret: "A statement",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    // console.log("calling midware1");
    // console.log(res.locals);
    res.locals.currentUser = req.user;
    // if(req.query.error) {
    //     req.flash("error", req.query.error);
    // }
    // res.locals.error = req.flash("error");
    // if(req.query.success) {
    //     req.flash("success", req.query.success);
    // }
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    // console.log("calling midware2");
    // console.log(res.locals);
    next();
});



app.use(userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Seed();

app.get("/", function(req, res){
    res.render("landing");
});

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("yelp camp server started...");
});