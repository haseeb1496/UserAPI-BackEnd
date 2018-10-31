var fs = require("fs");
var file = JSON.parse(fs.readFileSync("config.json"));
var host = process.env.HOST || file.host;
var port = process.env.PORT || file.port;

var app = require("express");

var bodyParser = require('body-parser');

var server = app();

server.all('*', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'/*'https://dbinno.com'*/);
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization, X-Mindflash-SessionID');
    next();
});

server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());

var router = app.Router();

Router = require('./route')();

server.use('/api/users', Router);

server.listen(port, host, function(){

    console.log('Listening to: ' + host + ':' + port);

});