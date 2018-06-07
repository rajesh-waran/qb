var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes');
var redirect = require("express-redirect");
var app = express();
var session = require('express-session');
var port = process.env.PORT || 4500;
app.use(session({ secret: 'this-is-a-secret-token',resave: true, saveUninitialized: true, cookie: { maxAge: 60000 }}));
redirect(app);

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect    
	res.setHeader('Access-Control-Allow-Origin','*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
})
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json());
app.use(routes);

var server = app.listen(port,function(){
	console.log("Application started listening port "+port);		
});