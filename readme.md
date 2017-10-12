#YelpCamp

* Add Landing Page
* Add Campgrounds Page that lists all campgrounds
* 
Each Campground has:
* Name
* Image
* 

#Layout and Basic Styling
* Create our header and footer partials
* Add in Bootstrap
* 

#Creating New Campgrounds
* Setup new campground POST route
* Add in body-parser
* Setup route to show form
* Add basic unstyled form
* 

#Style Campgrounds Page
* Add better header/title
* Make campgrounds display in a grid
* 

#Style the Navbar and Form
* Add a navbar to all templates
* Style the new campground form
* 

#Add Mongoose
* Install and configure mongoose
* Setup campground model
* Use campground model inside of our routes!
* 

#Show Page
* Review the RESTful routes we've seen so far
* Add description to our campground model
* Show db.collection.drop()
* Add a show route/template
* 

RESTFUL ROUTES
name        url         verb    description
====================================================================
INDEX       /dogs       GET     Display a list of all dogs
NEW         /dogs/new   GET     Displays form to make a new dog
CREATE      /dogs       POST    Add new dog to DB
SHOW        /dogs/:id   GET     Shows info about one dog


#Refactor Mongoose Code
* Create a models directory
* Use module.exports
* Require everything correctly!
* 

#Add Seeds File
* Add a seeds.js file
* Run the seeds file every time the server starts
* 

#Add the Comment model!
* Make our errors go away!
* Display comments on campground show page
* 

#Comment New/Create
* Discuss nested routes
* Add the comment new and create routes
* Add the new comment form
* 

#Style Show Page
* Add sidebar to show page
* Display comments nicely
*

#Finish Styling Show Page
* Add public directory
* Add custom stylesheet
* 

#Auth pt.1 - Add User Model
* Install all packages needed for auth
* Define User Model
* 

#Auth pt.2 - Register
* Configure passport
* Add register routes
* Add register template
* 

#Auth pt.3 - Login
* Add login routes
* Add login template
* 

#Auth pt.4 - Logout/Navbar
* Add logout route
* Prevent user from adding a comment if not signed in
* Add links to navbar
* Show/hide auth links correctly
* 

#Auth pt.5 - Show/Hide Links
* Show/hide auth links in navbar correctly
* 

#Refactor The Routes
* User Express router to reorganize all routes
*

#Users + Comments
* Associate users and comments
* Save author's name to a comment automatically
* 

#Users + Campgrounds
* Prevent an unauthenticated user from creating a campground
* Save username+id to newly created campground
* 

#Editing Campgrounds
* Add method-override
* Add edit route for campgrounds
* Add link to edit page
* Add update route
* 

#Deleting Campgrounds
* Add destroy route
* Add delete button
* 

#Authorization
* User can only edit his/her campgrounds
* User can only delete his/her campgrounds
* Hide/show edit and delete buttons
* 

#Editing Comments
* Add edit route for comments
* Add edit button
* Add update route
* 

#Deleting Comments
* Add destroy route
* Add delete button
* 

#Authorization Part 2: Comments
* User can only edit his/her comments
* User can only delete his/her comments
* Hide/Show edit and delete buttons
* Refactor Middleware
* 

#Adding in Flash!
* Demo working version
* Install and configure connect-flash
* Add bootstrap alerts to header
* 

#Landing Page Refactor
* HTML refactor
* CSS animation configuration
* 

#Dynamic Price Feature
* Campground model change (add price key)
* Views and routes change