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
        'chat',
        {
            message: message.value,
            username: username.value
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

var io = socket(server);

// Connection event
io.on('connection',function(socket){
    console.log('socket connection made',socket.id);
    // Handle chat event
    socket.on('chat',function(data){
        io.sockets.emit('output',data);
    });
    // Handle typing event
    socket.on('typing',function(data){
        socket.broadcast.emit('typing',data);
    });

});