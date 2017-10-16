var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    methodOverride          = require("method-override"),
    flash                   = require("connect-flash"),
    passport                = require("passport"),
    localStrategy           = require("passport-local"),
    User                    = require("./models/user"),
    seedDB                  = require("./seeds");

var campgroundRoutes        = require("./routes/campgrounds"),
    commentRoutes           = require("./routes/comments"),
    indexRoutes             = require("./routes/index");

//APP CONFIG
app.use(express.static(__dirname+"/public"));       //FOR GOOD DIRECTORY ORGANIZATION
app.use(bodyParser.urlencoded({extended: true}));   //STANDARD PACKAGE CALL
app.set("view engine", "ejs");                      //FOR IGNORING ".ejs" IN RENDER METHODS
app.use(methodOverride("_method"));                 //SIMULATES PUT HTTP REQUESTS
app.use(flash());                                   //FOR FLASH MESSAGES

//DB CONNECTION
var url = process.env.DATABASEURL || "mongodb://localhost/yelpcamp";
// EXECUTE ON CLI "export DATABASEURL=mongodb://localhost/yelpcamp" AND "heroku config:set DATABASEURL=mongodb://<dbuser>:<dbpassword>@ds113785.mlab.com:13785/yelpcamp_123"
mongoose.connect(url, {useMongoClient: true});                                      //FOR MONGODB CONNECTION
mongoose.Promise = global.Promise;                                                  //FIX FOR PACKAGE DEPRECATION
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));  //ON CONNECTION ERROR
mongoose.connection.once('open', function() {
    console.log("MongoDB -> \'yelpcamp\' database connected!");
    //seedDB();
});

//MOMENT.JS INCLUSION
app.locals.moment = require("moment");

//AUTHENTICATION AND SESSION CONFIG
app.use(require("express-session")({
    secret: "Anything that we want",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());                         //FOR PLUGIN
app.use(passport.session());                            //FOR PLUGIN
passport.use(new localStrategy(User.authenticate()));   //PLUGIN 'passport-local-mongoose' PATTERN
passport.serializeUser(User.serializeUser());           //PLUGIN 'passport-local-mongoose' PATTERN
passport.deserializeUser(User.deserializeUser());       //PLUGIN 'passport-local-mongoose' PATTERN

//MIDDLEWARE FOR USER SESSION
app.use(function(req, res, next){
    res.locals.currentUser  = req.user;             //DEFINES COMMON USER DATA FOR EJS TEMPLATES
    res.locals.error        = req.flash("error");   //DEFINES GLOBAL FLASH MESSAGE
    res.locals.success      = req.flash("success"); //DEFINES GLOBAL FLASH MESSAGE
    next();
});

//ROUTES SETUP
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

//ROUTE: UNKNOWN PATH REDIRECT
app.get("*", function(req, res) {
    res.redirect("/");
});

//SERVER START
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp server started...");
});