var db = require('../models');
var User = db.User;


//all
function index(req,res) {
  User.find({}, function(err, allUsers){
    res.json(allUsers);
    // res.send(`reached index`)
  });
};

//destroy
function destroy(req, res) {
	var userId = req.params.user_id;
	User.remove({_id:userId}, function(err, foundUser){
		if(err){res.send(err)}
		res.json('deleted a user');
	})
};


module.exports = {
  index: index,
  destroy: destroy
}
