//https模块搭建web服务器

'use strict'
var https = require('https');
var fs = require('fs');
var options = {
    key:fs.readFileSync(),
    cert:fs.readFileSync(),
};
var app = https.createServer(options,function (req,res) {
    res.writeHeader(200,{'Content-Type':'text/plain'})
    res.end('HTTPS:hello world')
}).listen(443,'0.0.0.0');


var  ePromise = navigator.mediaDevices.enumerateDevices()
