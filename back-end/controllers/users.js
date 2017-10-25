var db = require('../models');
var User = db.User;

function index(req, res) {
  res.send("reached user index")
}


module.exports.index = index;
