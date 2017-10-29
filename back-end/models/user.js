var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')
var bcrypt = require('bcryptjs');

var PortfolioSchema = new Schema({
  bitcoin: Number,
  ethereum: Number
})

var UserSchema = new Schema({
  name: {
    type: String,
    index: true
  },
  username: String,
  password: String,
  balance: Number,
  portfolio: PortfolioSchema
});

UserSchema.plugin(passportLocalMongoose)

var User = mongoose.model('User', UserSchema);
module.exports = User;

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.balance = 10000;
      newUser.portfolio = { bitcoin: 1, ethereum: 1 };
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
