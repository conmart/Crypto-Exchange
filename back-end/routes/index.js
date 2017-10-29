var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Prices = require('../models/coin');

// Get Homepage
router.get('/', function(req, res){
  res.render('index');
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

router.get('/profile', ensureAuthenticated, function(req, res){
  findAndReturnUser(req, res, 'profile');
})

router.get('/bitcoin', ensureAuthenticated, function(req, res){
  findAndReturnUser(req, res, 'bitcoin');
})

router.put('/bitcoin/buy', ensureAuthenticated, function(req, res){
  User.findByIdAndUpdate(req.body)
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
      let totalBitcoin = foundUser.portfolio.bitcoin * foundPrices[0].bitcoin;
      let totalEthereum = foundUser.portfolio.ethereum * foundPrices[0].ethereum;
      let totalValue = foundUser.balance + totalEthereum + totalBitcoin;
      res.render(page, {
        name: foundUser.name,
        balance: foundUser.balance,
        portfolio: foundUser.portfolio,
        username: foundUser.username,
        prices: foundPrices[0],
        totalBitcoin: totalBitcoin,
        totalValue: totalValue
      })
    })
  })
}


module.exports = router;
