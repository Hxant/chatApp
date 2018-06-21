// Establish connection on front end
var socket = io.connect('http://localhost:3000');

// Query DOM
var message_frnd = document.getElementById('message-friend'),
    handle_frnd = document.getElementById('username-friend'),
    button_frnd = document.getElementById('send-friend'),
    output_frnd = document.getElementById('output-friend'),
    feedback_frnd = document.getElementById('feedback-friend');

// Emit events
button_frnd.addEventListener('click', function(){
    socket.emit(
        'chat_to_friend',
        {
            message: message_frnd.value,
            username: handle_frnd.value,
        }
    );
    message_frnd.value = "";
});

message_frnd.addEventListener('keypress', function(){
    socket.emit('typing_frnd_',{username: handle_frnd.value});
});

// Listen for events
socket.on('typing_frnd',function(data){
    feedback_frnd.innerHTML = '<p><em>' + data.username + ' is typing... </em></p>';
});

socket.on('output_to_friend',function(data){
    feedback_frnd.innerHTML = '';
    output_frnd.innerHTML += '<p><strong>' + data.username + ':</strong> ' + data.message + '</p>';
});
