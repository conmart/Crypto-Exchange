var express = require('express');
var app = express();
var cryptoRouter = require('./config/routes.js');




var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cryptoRouter);

let port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log(`Listening on port ${port}`);
});
