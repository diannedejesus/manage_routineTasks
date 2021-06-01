const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const hbs = require('hbs');

require('dotenv').config({path: '.env'})
const passport = require('passport');
// Passport config
require('./bin/passport')(passport)


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const plannersRouter = require('./routes/planners');
const authRouter = require('./routes/auth');

const app = express();

// In-memory storage of logged-in users
  // For demo purposes only, production apps should store
  // this in a reliable storage
  //let users = {};

// Session middleware
// NOTE: Uses default in-memory session store, which is not
// suitable for production
app.use(session({
  secret: 'your_secret_value_here',
  resave: false,
  saveUninitialized: false,
  unset: 'destroy'
}));

// Flash middleware
app.use(flash());

// Set up local vars for template layout
app.use(function(req, res, next) {

  // Read any flashed errors and save
  // in the response locals
  res.locals.error = req.flash('error_msg');

  // Check for simple error string and
  // convert to layout's expected format
  let errs = req.flash('error');
  for (let i in errs){
    res.locals.error.push({message: 'An error occurred', debug: errs[i]});
  }
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));

//handlebars helpers
const { checkedOrNot, } = require('./helpers/hbs')
hbs.registerHelper('checkedOrNot', checkedOrNot);

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/calendar', plannersRouter);


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
