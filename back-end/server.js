
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

var routes = require('./routes/index');
var users = require('./routes/users');

// leftover code from previous versions
var router = express.Router();
var controllers = require('./controllers');
var db = require('./models');
var User = db.User;

// Initialize App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

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

// Initialize Port
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
    console.log(`api running on port ${app.get('port')}`);
});





//
// //passport config
// passport.use(new LocalStrategy(db.User.authenticate()));
// passport.serializeUser(db.User.serializeUser());
// passport.deserializeUser(db.User.deserializeUser());
//
// //Prevent CORS errors
// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//
//   //Remove caching
//   res.setHeader('Cache-Control', 'no-cache');
//   next();
// });


// // routes
//
// //auth routes copied over from other project
// app.get('/api/users', controllers.user.index);
// app.delete('/api/users/:user_id',controllers.user.destroy);
// app.post('/signup', function signup(req, res) {
//   console.log(`${req.body.username} ${req.body.password}`);
//   User.register(new User({ username: req.body.username, name: req.body.name, balance: req.body.balance }), req.body.password,
//     function (err, newUser) {
//       passport.authenticate('local')(req, res, function() {
//         res.send(newUser);
//       });
//     }
//   )});
// app.post('/login', passport.authenticate('local'), function (req, res) {
//   console.log(JSON.stringify(req.user));
//   res.send(req.user);
// });
// app.get('/logout', function (req, res) {
//   console.log("BEFORE logout", req);
//   req.logout();
//   res.send(req);
//   console.log("AFTER logout", req);
// });
