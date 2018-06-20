// Establish connection on front end
var socket = io.connect('http://localhost:3000');

// Query DOM
var message = document.getElementById('message'),
    handle = document.getElementById('username'),
    button = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');

// Emit events
button.addEventListener('click', function(){
    socket.emit(
        'chat_to_friend',
        {
            message: message.value,
            username: username.value,
        }
    );
    message.value = "";
});

message.addEventListener('keypress', function(){
    socket.emit('typing',{username: username.value});
});

// Listen for events
socket.on('typing',function(data){
    feedback.innerHTML = '<p><em>' + data.username + ' is typing... </em></p>';
});

socket.on('output',function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.username + ':</strong> ' + data.message + '</p>';
});
