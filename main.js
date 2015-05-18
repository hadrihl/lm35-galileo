var express = require('express');
var app = express();
var http = require('http').Server(app);
var socket = require('socket.io')(http);

http.listen(55555, function() {
    console.log("listening at *:55555");
});

// MRAA
var mraa = require('mraa');
console.log("MRAA version: " + mraa.getVersion());

var a = new mraa.Aio(0); // init analog pin 0

function captureTemperature(socket) {`
    var b = a.read();
    b *= 0.48826125;
    
    socket.emit('streaming', b);
    console.log("Celcius: " + b);
}

socket.on('connect', function(socket) {
    console.log("User connected");l

    
    var intervalId = setInterval(function() {
        captureTemperature(socket);
    }, 1000);
    
    socket.on('disconnect', function() {
        console.log("User disconnected.");
        clearInterval(intervalId);
    });
});

