var express = require('express');
var bodyParser = require('body-parser');
var redirect = require("express-redirect");
var request = require('request');
var config = require("./config");

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

app.get('/', function (req, res) {
	res.redirect("/index.html");
});

app.post('/dialogflowAPI', function (req, res) {
	var options = {
		method: 'POST',
		url: config.dialogflowAPI,
		headers: {
			"Authorization": "Bearer " + config.accessToken
		},
		body: req.body,
		json: true
	};
	request(options, function (error, response, body) {
		if (error) {
			res.json({ error: "error in chat server api call" }).end();
		} else {
			
			if(body.result && body.result.action && body.result.action=='discount'){

				body.result.fulfillment.messages[2].speech = '<a class="pdfClass" data-toggle="modal" data-target="#fundModal">Click here</a> to refer the discount chart for more details'
				res.json(body).end();
			} else if(body.result && body.result.action && body.result.action =="riskClass"){
				
				let riskClass = body.result.parameters && body.result.parameters.RiskClass ? body.result.parameters.RiskClass : null;
				console.log('YEAH', riskClass, body.result.parameters);
				if(riskClass){

					var options = {
						method: 'POST',
						url: "http://10.76.1.53:7999/aa/industry",
						headers: {},
						body: {"code": riskClass},
						json: true
					};
					request(options, function (error, response, responseBody) {
						if (error) {
							console.log('ERROR IN GUIDEWIRE API CALL');
							res.json(body).end();
						} else {
							console.log('SUCCESS IN GUIDEWIRE API CALL', response, responseBody);
							if(responseBody && responseBody.description){
								body.result.fulfillment.messages[0].speech = body.result.fulfillment.messages[0].speech.replace('Candy & Confectionery Products Manufacturing', responseBody.description);
							}
							res.json(body).end();
						}
					});					
				} else {
					res.json(body).end();
				}
			} 
			else{
				res.json(body).end();
			}
		}
	});
});

var server = app.listen(port,function(){
	console.log("Application started listening port "+port);		
});