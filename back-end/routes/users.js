var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Registration
router.get('/register', function(req, res){
  res.render('register');
})

router.post('/register', function(req, res){
  var name = req.body.name;
  var username = req.body.username;
  var password = req.body.password;

  req.checkBody('name', 'name is required').notEmpty();
  req.checkBody('username', 'username is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors: errors
    });
  } else {
    var newUser = new User({
      name: name,
      username: username,
      password: password,
    })
  }
  User.createUser(newUser, function(err, user){
    if (err) throw err;
    console.log(user);
  })
  req.flash('success_msg', 'Registration successful');
  res.redirect('/users/login');
})

// Login
router.get('/login', function(req, res){
  res.render('login');
})


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if (err) throw err;
      if (!user) {
        return done(null, false, {message: "Unknown User"})
      }
      User.comparePassword(password, user.password, function(err, isMatch){
        if (err) throw err;
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, {message: "Invalid Password"})
        }
      })
    })
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// this used to have a callback function - I took it out
router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/profile',
    failureRedirect: '/users/login',
    failureFlash: true
  }));

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', 'Successfully logged out');
  res.redirect('/');
});

module.exports = router;
