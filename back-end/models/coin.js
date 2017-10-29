var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var PricesSchema = new Schema({
  bitcoin: Number,
  ethereum: Number
})

var Prices = mongoose.model('Prices', PricesSchema);
module.exports = Prices;
