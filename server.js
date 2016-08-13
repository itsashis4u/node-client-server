"use strict";

var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var api = require('./routes/router');
var app = express();
var DeviceData = require('./models/model');

//Server certificates
var options = {
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt')
};

var server = https.createServer(options, app);
http.createServer(function(req, res){
    res.writeHead(301, {"Location" : "https://" + req.headers['host'] + req.url});
    res.end();
}).listen(80);

//SOCKET
var io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log('user connected');
    socket.on('message', function(msg) {
        //io.emit('message', msg);
        msg.time = formatDateTime(msg.date, msg.time);
        delete msg.date;
        var data = new deviceData(msg);
        // deviceSchema.pre('save', function(next){
        // 	// this.datetime = this.time + this.date;
        // 	next();
        // })
        data.save(function(err){
        	if(err) throw err;
        	console.log("Data saved successfully");
        });
        console.log(msg);
    })
    socket.on('disconnect', function() {
        console.log('user disconnected');
    })
});

function formatDateTime(date, time){
	var datetime = date.toString() + time.toString();
	var match = datetime.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/)
	var unix = new Date("20" + match[1], match[2] - 1, match[3], match[4], match[5], match[6]).getTime()/1000;
	return unix;
}

//Initialize app
server.listen(443, function() {
    console.log('Listening to https://localhost:443');
});

//App server
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use('/api', api);

app.get('/socket', function(req, res) {
    res.sendFile(__dirname + '/socket.html');
});