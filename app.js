var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Configure Passport.js for Google OAuth authentication
passport.use(new GoogleStrategy({
    clientID: "140550704929-4a4rnuvdhac78d59fb566qp9luubs74e.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://santodelgado.onrender.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Here you can handle the user information returned by Google
    return cb(null, profile);
  }
));

// Configure Express sessions to store Passport authentication information
app.use(session({
  secret: 'YOUR_SECRET_HERE',
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport.js and Express sessions
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Route to show the login page
app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/index', function(req, res) {
  res.render('index');
});

// Route to initiate Google OAuth authentication
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

// Route to handle Google OAuth response after authentication
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Here you can redirect the user to a welcome page
    res.redirect('/');
  });

// Protect routes that require authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.get('/profile', ensureAuthenticated, function(req, res) {
  res.render('profile', { user: req.user });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
