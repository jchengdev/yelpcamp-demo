var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
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
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    
    // if(req.body.adminCode === "secretcode") {
    //     newUser.isAdmin = true;
    // }
    
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
                                                                      successRedirect: "/campgrounds",              //MIDDLEWARE
                                                                      failureRedirect: "/login",                    //MIDDLEWARE
                                                                      failureFlash: "Invalid username or password"  //MIDDLEWARE
                                                                  }), function(req, res){
});

//ROUTE: LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You've logged out");
    res.redirect("/campgrounds");
});

//ROUTE: PASSWORD RESET REQUEST (form)
router.get("/forgot", middleware.isUnlogged, function(req, res){
    res.render("forgot");
});

//ROUTE: PASSWORD RESET REQUEST
router.post("/forgot", middleware.isUnlogged, function(req, res, next){
    asyncModule.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf){
                var token = buf.toString("hex");
                console.log("token: "+token);
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
                    console.log("user: "+user); //<<REMOVE>>
                    done(err, token, user);
                });
            })
        },
        function(token, user, done){
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "whaaataname@gmail.com",
                    pass: process.env.GMAILPW
                    // type: "login"
                }
                // service: "Gmail",
                // auth: {
                //     XOAuth2: {
                //         user: "whaaataname@gmail.com", // Your gmail address.
                //                                         // Not @developer.gserviceaccount.com
                //         clientId: "249992494218-bismd8f7po3esjrpilhacf5ou78ai62o.apps.googleusercontent.com",
                //         clientSecret: "L5XOiJ_1BteopD8-uqNP2j59",
                //         refreshToken: "1/cKiF2p4Ys1h7UWvaYOu_o_X3-GwLSx3l9GvCwwfNU3s"
                //     }
                // }
            });
            var mailOptions = {
                from: "'YelpCamp Support' <whaaataname@gmail.com>", // sender address
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
                    req.flash("success", "Reset token: "+token);
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
                    resetPasswordToken: req.params.token,
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
                            resetPasswordToken: req.params.token,
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
                                            req.logIn(user, function(err) {
                                                done(err, user);
                                            });
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
                    user: "whaaataname@gmail.com",
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                from: "'YelpCamp Support' <whaaataname@gmail.com>",
                to: user.email,
                subject: "[YelpCamp] Your password has been changed",
                text:   "Hello,\n\n" +
                        "This is a confirmation that the password for your account "+user.email+" has just been changed.\n"
            };
            smtpTransport.sendMail(mailOptions, function(err) {
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


module.exports = router;