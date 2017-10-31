var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var PricesSchema = new Schema({
  bitcoin: Number,
  ethereum: Number,
  zcash: Number,
  dash: Number
})

var Prices = mongoose.model('Prices', PricesSchema);
module.exports = Prices;
