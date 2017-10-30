var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Prices = require('../models/coin');

// Get Homepage
router.get('/', function(req, res){
  res.render('pages/index');
})

router.post('/setprices', function(req, res){
  Prices.deleteMany({}, function(err){
    if (err) throw err;
    Prices.create(req.body, function(err, prices){
      if (err) throw err;
      console.log(prices);
      res.send("Set Prices")
    })
  })
})

router.get('/api/users', function(req, res){
  User.find({}, function(err, allUsers){
    res.json(allUsers);
  })
})

router.get('/profile', ensureAuthenticated, function(req, res){
  findAndReturnUser(req, res, 'pages/profile');
})

router.get('/bitcoin', ensureAuthenticated, function(req, res){
  findAndReturnUser(req, res, 'pages/bitcoin');
})

router.put('/bitcoin/:price/buy', ensureAuthenticated, function(req, res){
  console.log('price from params', req.params.price);
  console.log('user ID', req.user._id);
  User.findById(req.user._id, function(err, user){
    if (err) throw err;
    user.balance = user.balance - req.params.price;
    user.portfolio.bitcoin += 1;
    user.save(function(err, savedUser){
      if (err) throw err;
      console.log(savedUser);
      Prices.find({}, function(err, foundPrices){
        if (err) throw err;
        res.render('pages/bitcoin', {
          user: savedUser,
          prices: foundPrices[0],
        })
      })
    })
  })
})

router.put('/bitcoin/:price/sell', ensureAuthenticated, function(req, res){
  console.log('sell price from params', req.params.price);
  console.log('sell user ID', req.user._id);
  User.findById(req.user._id, function(err, foundUser){
    if (err) throw err;
    foundUser.balance += req.params.price;
    foundUser.portfolio.bitcoin = foundUser.portfolio.bitcoin + 1;
    foundUser.save(function(err, savedUser){
      if (err) throw err;
      console.log(savedUser);
      Prices.find({}, function(err, foundPrices){
        if (err) throw err;
        res.render('pages/bitcoin', {
          user: savedUser,
          prices: foundPrices[0],
        })
      })
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



function findAndReturnUser(req, res, page){
  User.findById(req.user._id, function(err, foundUser){
    if (err) throw err;
    Prices.find({}, function(err, foundPrices){
      if (err) throw err;
      console.log( 'sending prices', foundPrices);
      res.render(page, {
        user: foundUser,
        prices: foundPrices[0],
      })
    })
  })
}


module.exports = router;
