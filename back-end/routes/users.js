var express = require('express');
var router = express.Router();

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
    console.log("PASSED");
  }


})

// Login
router.get('/login', function(req, res){
  res.render('login');
})

module.exports = router;
