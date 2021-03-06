var middlewareObj   = {},
    Campground      = require("../models/campground"),
    Comment         = require("../models/comment");

//MIDDLEWARE: campground path check
middlewareObj.checkCampgroundPath = function(req, res, next) {
    Campground.findById(req.params["id"], function(err, foundCampground){
        if(err || !foundCampground){
            console.log("Unknown path: ");
            console.log(err);
            req.flash("error", "Campground not found...");
            res.redirect("/campgrounds");
        } else {
            req.campground = foundCampground;
            next();
        }
    });
}

//MIDDLEWARE: campground permission check
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params["id"], function(err, foundCampground){
            if(err || !foundCampground){
                console.log(err);
                req.flash("error", "Campground not found...");
                res.redirect("/campgrounds");
            } else {
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    req.campground = foundCampground;
                    next();
                } else {
                    req.flash("error", "You don\'t have permission to do that");
                    res.redirect("/campgrounds");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/campgrounds");
    }
}

//MIDDLEWARE: comment permission check
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params["comment_id"], function(err, foundComment){
            if(err || !foundComment){
                console.log(err);
                req.flash("error", "Comment not found...");
                res.redirect("/campgrounds/"+req.params["id"]);
            } else {
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    req.comment = foundComment;
                    next();
                } else {
                    req.flash("error", "You don\'t have permission to do that");
                    res.redirect("/campgrounds/"+req.params["id"]);
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

//MIDDLEWARE: session up
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

//MIDDLEWARE: session down
middlewareObj.isUnlogged = function(req, res, next){
    if(req.isAuthenticated()){
        req.flash("error", "You are already logged in as "+req.user.username);
        return res.redirect("/campgrounds");
    }
    next();
}

module.exports = middlewareObj;