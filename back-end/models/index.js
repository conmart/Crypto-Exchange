var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cryto-exchange");

module.exports.User = require("./user");
