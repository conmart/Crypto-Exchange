var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/cryto-exchange");

module.exports.User = require("./user");
