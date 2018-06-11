// Import express and socket libraries
var express = require('express');
var socket = require('socket.io');

// Application setup
var app = express();
var server = app.listen(
    8080,
    function() {
        console.log("Listening to requests on loopback address 'http://localhost:8080'");
    }
);

// Accessing static files
app.use(express.static('public'));

// Socket setup
var io = socket(server);

// Handle connection event from client
io.on(
    'connection',
    function(socket) {

        console.log("Socket connection made ", socket.id);

        // 1. Handle chat event from client
        socket.on(
            'chat',
            function(data) {
                // emit output event to client
                io.sockets.emit('chat',data);
            }
        );

        // 2. Handle typing event from client
        socket.on(
            'typing',
            function (data) {
            // Broadcast typing event and emit feedback event to client
                socket.broadcast.emit('typing',data);
            }
        );
    }
);
