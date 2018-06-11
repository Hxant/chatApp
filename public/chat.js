// Make connection
var socket = io.connect('http://localhost:8080');

// Query the DOM
var feedback = document.getElementById('feedback'),
    output = document.getElementById('output'),
    username = document.getElementById('username'),
    message = document.getElementById('message'),
    button = document.getElementById('sendButton');

// 1. Emit events to server

// Button clik event
button.addEventListener(
    'click',
    function() {
        // Chat event
        socket.emit('chat',{ username:username.value,message:message.value });
        // Clear message field
        message.value = '';
    }
);

// Typing event
message.addEventListener(
    'keypress',
    function() {
        // Typing event to server
        socket.emit('typing',username.value);
    }
);

// 2. Handle events from server

// chat event
socket.on(
    'chat',
    function(data){
        // Clear feedback field
        feedback.innerHTML = '';
        // Append data to output field
        output.innerHTML += '<p><strong>' + data.username + ': </strong>' + data.message + '</p>';
    }
);

// typing event
socket.on(
    'typing',
    function(data) {
        feedback.innerHTML = '<p><em>' + data +' is typing...</em></p>';
    }
);
