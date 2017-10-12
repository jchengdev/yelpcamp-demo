var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware/index");       //REQUIRES index.js inside folder

//ROUTE: INDEX
router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("Something wrong with .find({})");
            console.log(err);
            res.send("Campgrounds search error...")
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
        }
    });
});

//ROUTE: NEW (form)
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//ROUTE: CREATE (new camp)
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.create({
        name: req.body.name,                    //REQUIRES BODY-PARSER
        image: req.body.image,                  //REQUIRES BODY-PARSER
        description: req.body.description,      //REQUIRES BODY-PARSER
        price: req.body.price,                  //REQUIRES BODY-PARSER
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }, function(err, newCampground){
        if(err || !newCampground){
            console.log("Create error: ");
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        } else {
            console.log("NEW CAMPGROUND: ");
            console.log(newCampground);
            //req.flash("success", "Campground added!");
            res.redirect("/campgrounds");
        }
    });
});

//ROUTE: SHOW (campground details)
router.get("/:id", function(req, res) {
    Campground.findById(req.params["id"]).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            console.log("Show error: ");
            console.log(req.params["id"]); //<<<TODO: some issue related to showing a newly added camp (double GET request)>>>
            console.log(err);
            req.flash("error", "Campground not found...");
            res.redirect("/campgrounds");
        } else {
            console.log("SHOW CAMPGROUND: ");
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//ROUTE: EDIT (form)
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    console.log("EDIT CAMPGROUND: ");
    console.log(req.campground);
    res.render("campgrounds/edit", {campground: req.campground});
});

//ROUTE: UPDATE (campground details)
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    //req.body.blog.body = req.sanitize(req.body.blog.body); //<<<DELETE?>>>
    Campground.findByIdAndUpdate(req.params["id"], req.body.campground, function(err, editCampground){ //REQUIRES BODY-PARSER (campground[name]+campground[image]+campground[description] collapsed into an object by BODY-PARSER syntax)
        if(err || !editCampground){
            console.log("Update error: ");
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        } else {
            console.log("UPDATED CAMPGROUND: ");
            console.log("id: "+req.params["id"]);
            //req.flash("success", "Campground updated!");
            res.redirect("/campgrounds/"+req.params["id"]);
        }
    });
});

//ROUTE: DELETE (selected campground)
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params["id"], function(err){
        if(err){
            console.log("Delete error: ");
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        } else {
            console.log("DELETED CAMPGROUND: ");
            console.log("id: "+req.params["id"]);
            //req.flash("success", "Campground deleted!");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;