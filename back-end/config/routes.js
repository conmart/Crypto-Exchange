var express = require('express');
var router = express.Router();
var usersController = require('../controllers/users.js');

// User Routes

// index
router.get('/api/users', usersController.index);




module.exports = router;
