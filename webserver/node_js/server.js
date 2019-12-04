'use strict'
var https = require('https');
var http = require('http');
var fs = require('fs');
var express = require('express');
var serveIndex = require('serve-index');
var app = express();
var socketIo = require('socket.io');
app.use(serveIndex('../../webserver'));
app.use(express.static('../../webserver'));
//http server
var http_server = http.createServer(app);
socketIo = listen(http_server);
http_server.listen(8008,'0.0.0.0');
//var options = {
//}
//https server
//var https_server = https.createServer(options,app);
//https_server.listen(443,'0.0.0.0')
