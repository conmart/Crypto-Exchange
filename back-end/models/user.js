var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')
var bcrypt = require('bcryptjs');

var PortfolioSchema = new Schema({
  bitcoin: Number,
  ethereum: Number,
  zcash: Number,
  dash: Number,
  litecoin: Number
})

var AvgCostSchema = new Schema({
  bitcoin: Number,
  ethereum: Number,
  zcash: Number,
  dash: Number,
  litecoin: Number
})

var UserSchema = new Schema({
  name: {
    type: String,
    index: true
  },
  username: String,
  password: String,
  balance: Number,
  startingValue: Number,
  portfolio: PortfolioSchema,
  costs: AvgCostSchema
});

UserSchema.plugin(passportLocalMongoose)

var User = mongoose.model('User', UserSchema);
module.exports = User;

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.balance = 20000;
      newUser.startingValue = 20000;
      newUser.portfolio = { bitcoin: 0, ethereum: 0, zcash: 0, dash: 0, litecoin: 0};
      newUser.costs = { bitcoin: 0, ethereum: 0, zcash: 0, dash: 0, litecoin: 0};
      newUser.save(callback);
    });
  });
}

module.exports.getUserByUsername = function(username, callback) {
  var query = {username: username};
  User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.comparePassword = function(userPassword, hash, callback) {
  bcrypt.compare(userPassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
}
