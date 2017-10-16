var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");             //REQUIRES index.js inside folder

//ROUTE: NEW (form)
router.get("/new", middleware.isLoggedIn, middleware.checkCampgroundPath, function(req, res) {
    //req.campground FROM MIDDLEWARE
    res.render("comments/new", {campground: req.campground});
});

//ROUTE: CREATE (new comment)
router.post("/", middleware.isLoggedIn, middleware.checkCampgroundPath, function(req, res) {
    //req.campground FROM MIDDLEWARE
    Comment.create(req.body.comment,                //REQUIRES BODY-PARSER
        function(err, newComment){
            if(err || !newComment){
                console.log("Create error: ");
                console.log(err);
                req.flash("error", "Something went wrong");
                res.redirect("/campgrounds/"+req.params["id"]);
            } else {
                newComment.author.id = req.user._id;
                newComment.author.username = req.user.username;
                newComment.save();
                req.campground.comments.push(newComment);
                req.campground.save();
                console.log("NEW COMMENT: ");
                console.log(newComment);
                //req.flash("success", "Comment added!");
                res.redirect("/campgrounds/"+req.params["id"]);
            }
    });
});

//ROUTE: EDIT (form)
router.get("/:comment_id/edit", middleware.checkCommentOwnership, middleware.checkCampgroundPath, function(req, res) {
    //req.comment FROM MIDDLEWARE
    console.log("EDIT COMMENT: ");
    console.log(req.comment);
    res.render("comments/edit", {campground_id: req.params["id"], comment: req.comment});
});

// //ROUTE: UPDATE (comment text)
router.put("/:comment_id", middleware.checkCommentOwnership, middleware.checkCampgroundPath, function(req, res) {
    //req.body.blog.body = req.sanitize(req.body.blog.body); //<<<DELETE?>>>
    Comment.findByIdAndUpdate(req.params["comment_id"], req.body.comment, function(err, editComment){ //REQUIRES BODY-PARSER (campground[name]+campground[image]+campground[description] collapsed into an object by BODY-PARSER syntax)
        if(err || !editComment){
            console.log("Update error: ");
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds/"+req.params["id"]);
        } else {
            console.log("UPDATED COMMENT: ");
            console.log("comment_id: "+req.params["comment_id"]);
            //req.flash("success", "Comment updated!");
            res.redirect("/campgrounds/"+req.params["id"]);
        }
    });
});

//ROUTE: DELETE (selected comment)
router.delete("/:comment_id", middleware.checkCommentOwnership, middleware.checkCampgroundPath, function(req, res) {
    //req.campground FROM MIDDLEWARE
    Comment.findByIdAndRemove(req.params["comment_id"], function(err){
        if(err){
            console.log("Delete error: ");
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds/"+req.params["id"]);
        } else {
            console.log("DELETED COMMENT: ");
            console.log("comment_id: "+req.params["comment_id"]);
            var commentIndex = req.campground.comments.findIndex(function(comment){
                return comment.toString() === req.params["comment_id"];
            });
            req.campground.comments.splice(commentIndex,1);
            req.campground.save();
            //req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/"+req.params["id"]);
        }
    });
});

module.exports = router;