var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Prices = require('../models/price');

// Get Homepage
router.get('/', function(req, res){
  res.render('pages/index');
})

// JSON response for all current users
router.get('/api/users', function(req, res){
  User.find({}, function(err, allUsers){
    res.json(allUsers);
  })
})

router.get('/profile', ensureAuthenticated, function(req, res){
  findAndReturnUser(req, res, 'pages/profile', 'none');
})

router.get('/:coin/show', ensureAuthenticated, function(req, res){
  findAndReturnUser(req, res, 'pages/coinShow', req.params.coin)
})

// Execute cryptocurrency purchase
router.put('/:coin/:price/buy', ensureAuthenticated, function(req, res){
  var coin = req.params.coin
  var amount = parseInt(req.body.numCoins);
  User.findById(req.user._id, function(err, user){
    if (err) throw err;
    let purchaseTotal = parseFloat((req.params.price * amount).toFixed(2));
    user.balance = user.balance - purchaseTotal;
    let newAvgNum = (parseFloat(user.costs[coin]) * parseInt(user.portfolio[coin])
      + purchaseTotal);
    let newAvgDenom = (parseInt(amount) + parseInt(user.portfolio[coin]));
    let newAvg = parseFloat((newAvgNum/newAvgDenom).toFixed(2));
    user.costs[coin] = newAvg;
    user.portfolio[coin] += amount;
    user.save(function(err, savedUser){
      if (err) throw err;
      Prices.find({}, function(err, foundPrices){
        if (err) throw err;
        res.redirect(`/${coin}/show`)
      })
    })
  })
})

// Execute cryptocurrency sale
router.put('/:coin/:price/sell', ensureAuthenticated, function(req, res){
  var coin = req.params.coin
  var amount = parseInt(req.body.numCoins);
  User.findById(req.user._id, function(err, foundUser){
    if (err) throw err;
    foundUser.balance += parseFloat((parseFloat(req.params.price) * amount).toFixed(2));
    foundUser.portfolio[coin] = foundUser.portfolio[coin] - amount;
    if (foundUser.portfolio[coin] <= 0){
      foundUser.costs[coin] = 0;
    }
    foundUser.save(function(err, savedUser){
      if (err) throw err;
      Prices.find({}, function(err, foundPrices){
        if (err) throw err;
        res.redirect(`/${coin}/show`)
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

function findAndReturnUser(req, res, page, coin){
  User.findById(req.user._id, function(err, foundUser){
    if (err) throw err;
    Prices.find({}, function(err, foundPrices){
      if (err) throw err;
      res.render(page, {
        user: foundUser,
        prices: foundPrices[0],
        coin: coin
      })
    })
  })
}

module.exports = router;
