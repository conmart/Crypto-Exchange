var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  balance: String,
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
