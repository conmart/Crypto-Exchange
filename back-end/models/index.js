var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/crypto-exchange");

module.exports.User = require("./user");
module.exports.Prices = require("./price");
