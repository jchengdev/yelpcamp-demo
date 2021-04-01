require('dotenv').config();
var http = require('http'),
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  methodOverride = require('method-override'),
  flash = require('connect-flash'),
  passport = require('passport'),
  localStrategy = require('passport-local'),
  User = require('./models/user');
//seedDB                  = require("./seeds");

var campgroundRoutes = require('./routes/campgrounds'),
  commentRoutes = require('./routes/comments'),
  indexRoutes = require('./routes/index');

//APP CONFIG
app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
// app.set('views', './views');
app.set('view engine', 'ejs');
app.use(methodOverride('_method')); // * simulates HTTP PUT/DELETE requests
app.use(flash());

//DB CONNECTION
var url = process.env.DATABASE_URL || 'mongodb://localhost/yelpcamp_123';

mongoose.Promise = global.Promise; //FIX FOR PACKAGE DEPRECATION
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
});
mongoose.connection.on(
  'error',
  console.error.bind(console, 'connection error:')
);
mongoose.connection.once('open', function () {
  console.log("MongoDB -> 'yelpcamp_123' database connected!");
  //seedDB();
});

//MOMENT.JS INCLUSION
app.locals.moment = require('moment');

//AUTHENTICATION AND SESSION CONFIG
app.use(
  require('express-session')({
    secret: 'Anything that we want',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())); // 'passport-local-mongoose' pattern
passport.serializeUser(User.serializeUser()); // 'passport-local-mongoose' pattern
passport.deserializeUser(User.deserializeUser()); // 'passport-local-mongoose' pattern

//MIDDLEWARE FOR USER SESSION
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

//ROUTES SETUP
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

//DEVELOPER NOTES PAGE
app.get('/about', function (req, res) {
  res.render('about');
});

//ROUTE: UNKNOWN PATH REDIRECT
app.get('*', function (req, res) {
  res.redirect('/');
});

//SERVER START
var server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log(`YelpCamp server started on port ${app.get('port')} ...`);
});

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint() {
  console.info('Got SIGINT. Graceful shutdown ', new Date().toISOString());
  shutdown();
});

// quit properly on docker stop
process.on('SIGTERM', function onSigterm() {
  console.info('Got SIGTERM. Graceful shutdown ', new Date().toISOString());
  shutdown();
});

// shut down server
const shutdown = () => {
  server.close(function onServerClosed(err) {
    if (err) {
      console.error(err);
      process.exitCode = 1;
    }
    process.exit();
  });
};
