var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Prices = require('../models/coin');

// Get Homepage
router.get('/', function(req, res){
  res.render('pages/index');
})

router.post('/:anything/setprices', function(req, res){
  Prices.deleteMany({}, function(err){
    if (err) throw err;
    Prices.create(req.body, function(err, prices){
      if (err) throw err;
      // console.log(prices);
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
  findAndReturnUser(req, res, 'pages/profile', 'none');
})

router.get('/bitcoin', ensureAuthenticated, function(req, res){
  findAndReturnUser(req, res, 'pages/bitcoin', 'bitcoin');
})

router.get('/:coin/show', ensureAuthenticated, function(req, res){
  findAndReturnUser(req, res, 'pages/coinShow', req.params.coin)
})

router.put('/:coin/:price/buy', ensureAuthenticated, function(req, res){
  var coin = req.params.coin
  var amount = parseInt(req.body.numCoins);
  User.findById(req.user._id, function(err, user){
    if (err) throw err;
    user.balance = user.balance - (req.params.price * amount);
    user.portfolio[coin] += amount;
    user.save(function(err, savedUser){
      if (err) throw err;
      Prices.find({}, function(err, foundPrices){
        if (err) throw err;
        res.render('pages/coinShow', {
          coin: coin,
          user: savedUser,
          prices: foundPrices[0],
        })
      })
    })
  })
})

router.put('/:coin/:price/sell', ensureAuthenticated, function(req, res){
  var coin = req.params.coin
  var amount = parseInt(req.body.numCoins);
  User.findById(req.user._id, function(err, foundUser){
    if (err) throw err;
    foundUser.balance += (parseInt(req.params.price) * amount);
    foundUser.portfolio[coin] = foundUser.portfolio[coin] - amount;
    foundUser.save(function(err, savedUser){
      if (err) throw err;
      Prices.find({}, function(err, foundPrices){
        if (err) throw err;
        res.render('pages/coinShow', {
          coin: coin,
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



function findAndReturnUser(req, res, page, coin){
  User.findById(req.user._id, function(err, foundUser){
    if (err) throw err;
    Prices.find({}, function(err, foundPrices){
      if (err) throw err;
      // console.log( 'sending prices', foundPrices);
      res.render(page, {
        user: foundUser,
        prices: foundPrices[0],
        coin: coin
      })
    })
  })
}


module.exports = router;
