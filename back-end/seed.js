var db = require('./models');

db.User.deleteMany({}, function(err){
  if (err) throw err;
})
