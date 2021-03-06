var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    Campground  = require("../models/campground"),
    User        = require("../models/user"),
    middleware  = require("../middleware"),     //REQUIRES index.js inside folder
    asyncModule = require("async"),
    nodemailer  = require("nodemailer"),
    crypto      = require("crypto");
    

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
    User.find({email: req.body.email}, function(err, users){                    //UNIQUE EMAIL CHECK
        if(err || !users){
            req.flash("error", "Something went wrong");
            return res.redirect("/register");
        } else {
            if(users.length > 0){
                req.flash("error", "Another user registered with that email");
                return res.redirect("/register");
            } else {
                var newUser = new User({
                    username: req.body.username,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    avatar: req.body.avatar
                });
                if(req.body.adminCode === "admin") {
                    newUser.isAdmin = true;
                }
                
                User.register(newUser, req.body.password, function(err, user){  //UNIQUE USERNAME CHECK INCLUDED IN PASSPORTLOCALMONGOOSE
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
            }
        }
    });
});

//ROUTE: LOGIN (form)
router.get("/login", middleware.isUnlogged, function(req, res){
    res.render("login", {page: "login"});
});

//ROUTE: LOGIN (access)
router.post("/login", middleware.isUnlogged, passport.authenticate("local", {
                                                                      successRedirect: "/campgrounds",              //MIDDLEWARE
                                                                      failureRedirect: "/login",                    //MIDDLEWARE
                                                                      failureFlash: "Invalid username or password"  //MIDDLEWARE
                                                                  }), function(req, res){
                                                                      //res.redirect("/campgrounds" + req.user.username); //SAME AS SUCCESSREDIRECT
});

//ROUTE: LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You've logged out");
    res.redirect("/campgrounds");
});

//ROUTE: PASSWORD RESET REQUEST (form)
router.get("/forgot", function(req, res){
    res.render("forgot");
});

//ROUTE: PASSWORD RESET REQUEST
router.post("/forgot", function(req, res, next){
    asyncModule.waterfall([
        function(done) {
            if(req.isAuthenticated() && (req.body.email !== req.user.email)){
                req.flash("error", "Enter your email address");
                return res.redirect("/forgot");
            }
            crypto.randomBytes(20, function(err, buf){
                var token = buf.toString("hex");
                done(err, token);
            });
        },
        function(token, done){
            User.findOne({email: req.body.email}, function(err, user) {
                if(err) console.log("error: "+err);
                if(!user) {
                    req.flash("error", "No account with that email address");
                    return res.redirect("/forgot");
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 600000; //10 minutes
                
                user.save(function(err){
                    done(err, token, user);
                });
            })
        },
        function(token, user, done){
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "sample@example.com",
                    pass: process.env.GMAILPW
                    // type: "login"
                }
                // service: "Gmail",
                // auth: {
                //     XOAuth2: {
                //         user: "sample@example.com", // Your gmail address.
                //                                         // Not @developer.gserviceaccount.com
                //         clientId: "249992494218-bismd8f7po3esjrpilhacf5ou78ai62o.apps.googleusercontent.com",
                //         clientSecret: "L5XOiJ_1BteopD8-uqNP2j59",
                //         refreshToken: "1/cKiF2p4Ys1h7UWvaYOu_o_X3-GwLSx3l9GvCwwfNU3s"
                //     }
                // }
            });
            var mailOptions = {
                from: "'YelpCamp Support' <sample@example.com>", // sender address
                to: user.email,
                subject: "[YelpCamp] Password reset", // Subject line
                text:   "You are receiving this because you (or someone else) have requested the reset of the password"+"\n\n"+
                        "Please click on the following link, or paste this into your browser to complete the process:"+"\n\n"+
                        "https://"+req.headers.host+"/reset/"+token+"\n\n"+
                        "If you did not request this, please ignore this email and your password will remain unchanged"+"\n\n", 
                //html: '<b>Hello world?</b>' // html body
            };
            smtpTransport.sendMail(mailOptions, function(err){ // CHANGE TO ,info){
                if(err){ // || CHANGE TO !info){
                    //req.flash("error", "Some error occurred when sending to that email address");
                    req.flash("success", "(NODEMAILER INTEGRATION INCOMPLETE) Reset token: "+token);
                    return res.redirect("/forgot");
                }
                //console.log('Message sent: %s', info.messageId);
                //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                req.flash("success", "An e-mail has been sent to "+user.email+"with further instructions");
                done(err, "done");
            });
        }
    ], function(err){
        if(err) return next(err);
        res.redirect("/forgot");
    });
});

//ROUTE: PASSWORD RESET
router.get("/reset/:token", function(req, res){
    User.findOne({
                    resetPasswordToken: req.params.token,   //TECHNICALLY, THIS DOESN'T AVOID USERS SIMULTANEOUS RESET CONFLICT (but random token big enough)
                    resetPasswordExpires: {$gt: Date.now()}
                 }, function(err, user){
                    if(err || !user) {
                        req.flash("error", "Password reset token is invalid or has expired");
                        return res.redirect("/forgot");
                    }
                    res.render("reset", {token: req.params["token"]});
    });
});

//ROUTE: PASSWORD RESET (effective)
router.post("/reset/:token", function(req, res) {
    asyncModule.waterfall([
        function(done) {
            User.findOne({
                            resetPasswordToken: req.params.token,   //TECHNICALLY, THIS DOESN'T AVOID USERS SIMULTANEOUS RESET CONFLICT (but random token big enough)
                            resetPasswordExpires: {$gt: Date.now()}
                         }, function(err, user) {
                                if (err || !user) {
                                    req.flash("error", "Password reset token is invalid or has expired");
                                    return res.redirect("/forgot");
                                }
                                if(req.body.password === req.body.confirm) {
                                    user.setPassword(req.body.password, function(err) {
                                        if(err) console.log("error: "+err);
                                        user.resetPasswordToken = undefined;
                                        user.resetPasswordExpires = undefined;
                                        user.save(function(err) {
                                            if(err) console.log("error: "+err);
                                            if(!req.isAuthenticated()){
                                                req.logIn(user, function(err) {
                                                    done(err, user);
                                                });
                                            } else {
                                                return res.redirect("/users/"+req.user._id);
                                            }
                                        });
                                    });
                                } else {
                                    req.flash("error", "Passwords do not match");
                                    return res.redirect('/reset/'+req.params["token"]);
                                }
                            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "sample@example.com",
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                from: "'YelpCamp Support' <sample@example.com>",
                to: user.email,
                subject: "[YelpCamp] Your password has been changed",
                text:   "Hello,\n\n" +
                        "This is a confirmation that the password for your account "+user.email+" has just been changed.\n"
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                //NODEMAILER INTEGRATION INCOMPLETE
                //TODO: ERROR HANDLING
                req.flash("success", "Your password has been changed");
                done(err);
            });
        }
    ], function(err) {
        if(err) console.log("error: "+err);
        res.redirect("/campgrounds");
    });
});

//ROUTE: USER PROFILE
router.get("/users/:id", function(req, res) {
    User.findById(req.params["id"], function(err, foundUser){
        if(err || !foundUser) {
            req.flash("error", "User not found");
            return res.redirect("/campgrounds");
        } else {
            Campground.find().where("author.id").equals(foundUser._id).exec(function(err, foundCampgrounds) {   //ASSUMING 'foundUser' ALWAYS FOUND
                if(err || !foundCampgrounds) {
                    req.flash("error", "Something went wrong");
                    return req.redirect("/campgrounds");
                }
                var loginStatus = undefined;
                if(req.isAuthenticated()){
                    loginStatus = true;
                }
                res.render("users/show", {user: foundUser, campgrounds: foundCampgrounds, loginStatus: loginStatus});
            });
        }
    });
});


module.exports = router;