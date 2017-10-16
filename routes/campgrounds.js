var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware/index"),       //REQUIRES index.js inside folder
    geocoder    = require("geocoder");

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//ROUTE: INDEX
router.get("/", function(req, res) {
    if(req.query.search) { //CHANGE TO && req.xhr) {
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
        Campground.find({name: regex}, function(err, allCampgrounds){
            if(err){
                console.log("Something wrong with .find({name:"+regex+"})");
                console.log(err);
                res.send("Campgrounds search error...")
            } else {
                //res.status(200).json(allCampgrounds);
                res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
            }
        });
    } else {
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log("Something wrong with .find({})");
                console.log(err);
                res.send("Campgrounds search error...")
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
            }
        });
    }
});

//ROUTE: NEW (form)
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//ROUTE: CREATE (new camp)
router.post("/", middleware.isLoggedIn, function(req, res) {
    geocoder.geocode(req.body.location, function(err, data){    //REQUIRES BODY-PARSER
        var lat         = 0.0,
            lng         = 0.0,
            location    = "";
        if(err || !data){
            console.log("Geocoder error: ");
            console.log(err);
        }
        else {
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;
            location = data.results[0].formatted_address;
        }
        Campground.create({
            name: req.body.name,                    //REQUIRES BODY-PARSER
            image: req.body.image,                  //REQUIRES BODY-PARSER
            description: req.body.description,      //REQUIRES BODY-PARSER
            price: req.body.price,                  //REQUIRES BODY-PARSER
            author: {
                        id: req.user._id,
                        username: req.user.username
                    },
            location: location,
            lat: lat,
            lng: lng
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
    //req.campground FROM MIDDLEWARE
    console.log("EDIT CAMPGROUND: ");
    console.log(req.campground);
    res.render("campgrounds/edit", {campground: req.campground});
});

//ROUTE: UPDATE (campground details)
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    //req.body.blog.body = req.sanitize(req.body.blog.body); //<<<DELETE?>>>
    geocoder.geocode(req.body.campground.location, function(err, data){    //REQUIRES BODY-PARSER
        var lat         = 0.0,
            lng         = 0.0,
            location    = "";
        if(err || !data || data.results.length === 0){
            console.log("Geocoder error: ");
            console.log(err);
        }
        else {
            // console.log("GEOCODER:")
            // console.log(data);
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;
            location = data.results[0].formatted_address;
        }
        Campground.findByIdAndUpdate(req.params["id"], {
            name: req.body.campground.name,
            image: req.body.campground.image,
            description: req.body.campground.description,
            price: req.body.campground.price,
            // author: {
            //             id: req.user._id,
            //             username: req.user.username
            //         },
            location: location,
            lat: lat,
            lng: lng
        }, function(err, editCampground){ //REQUIRES BODY-PARSER (campground[name]+campground[image]+campground[description] collapsed into an object by BODY-PARSER syntax)
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