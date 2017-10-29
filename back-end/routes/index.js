var express = require('express');
var router = express.Router();
var User = require('../models/user');

// Get Homepage
router.get('/', function(req, res){
  res.render('index');
})

router.get('/profile', ensureAuthenticated, function(req, res){
  User.findById(req.user._id, function(err, foundUser){
    if (err) throw err;
    res.render('profile', {
      name: foundUser.name,
      balance: foundUser.balance,
      portfolio: foundUser.portfolio,
      username: foundUser.username
    })
  })
})

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  } else {
    req.flash('error_msg', 'Sorry, you are not logged in');
    res.redirect('/');
  }
}



module.exports = router;
