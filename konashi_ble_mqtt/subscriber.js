var http = require("http");
var express = require('express');

var port = process.env.PORT || 8080;
var app = express();
app.use(express.static(__dirname + '/public'));
var server = http.createServer(app)
server.listen(port)
