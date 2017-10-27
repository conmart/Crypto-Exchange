var express = require('express');
var router = express.Router();

// Get register
router.get('/register', function(req, res){
  res.render('register');
})

// Get login
router.get('/login', function(req, res){
  res.render('login');
})

module.exports = router;
