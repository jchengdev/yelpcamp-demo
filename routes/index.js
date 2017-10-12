var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user"),
    middleware  = require("../middleware");     //REQUIRES index.js inside folder

//ROUTE: LANDING PAGE
router.get("/", function(req, res){
    res.render("landing");
});

//ROUTE: REGISTER (form)
router.get("/register", middleware.isUnlogged, function(req, res){
    res.render("register", {page: "register"});
});

//ROUTE: REGISTER (new)
router.post("/register", middleware.isUnlogged, function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Yelpcamp "+user.username);
            res.redirect("/campgrounds");
        });
    });
});

//ROUTE: LOGIN (form)
router.get("/login", middleware.isUnlogged, function(req, res){
    res.render("login", {page: "login"});
});

//ROUTE: LOGIN (access)
router.post("/login", middleware.isUnlogged, passport.authenticate("local", {
                                                                      successRedirect: "/campgrounds",    //MIDDLEWARE
                                                                      failureRedirect: "/login"           //MIDDLEWARE
                                                                  }), function(req, res){
});

//ROUTE: LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You've logged out");
    res.redirect("/campgrounds");
});

module.exports = router;