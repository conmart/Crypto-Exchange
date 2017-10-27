var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')
var bcrypt = require('bcryptjs');

var UserSchema = new Schema({
  name: String,
  username: String,
  password: String,
  balance: Number,
});

UserSchema.plugin(passportLocalMongoose)

var User = mongoose.model('User', UserSchema);
module.exports = User;
