// Initialize Server Dependencies
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var methodOverride = require('method-override');

var routes = require('./routes/index');
var users = require('./routes/users');

var fetchUrl = require("fetch").fetchUrl;

var moment = require('moment');
moment().format();

// leftover code from previous versions
var router = express.Router();
var controllers = require('./controllers');
var db = require('./models');
var User = db.User;

// Initialize App
var app = express();


// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// BodyParser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

// Method Override
app.use(methodOverride("_method"));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'secretsauce1900',
  resave: true,
  saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.');
    var root = namespace.shift();
    var formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Flash
app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users)


fetchUrl("https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,ZEC,DASH&tsyms=USD", function(error, meta, body){
    console.log('body from fetch', body);
    // console.log('fetch BTC', body.BTC.USD);
});



// fetch("https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,ZEC,DASH&tsyms=USD")
// .then(function(response) {
//   if(response.ok) {
//     console.log('response from fetch', response);
//     console.log('BTC from fetch', response.BTC.USD);
//   }
//   throw new Error('Network response was not ok.');
//   }).catch(function(error) {
//     console.log('There has been a problem with your fetch operation: ' + error.message);
//   });



// (function worker() {
//   $.ajax({
//     url: 'ajax/test.html',
//     success: function(data) {
//       $('.result').html(data);
//     },
//     complete: function() {
//       // Schedule the next request when the current one's complete
//       setTimeout(worker, 5000);
//     }
//   });
// })();

// Initialize Port
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
    console.log(`api running on port ${app.get('port')}`);
});
