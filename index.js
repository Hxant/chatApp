const app= require('express')();
const server= require('http').Server(app);
const io = require('socket.io')(server);


server.listen(8080, function(){
	console.log('server is running on 8080');
});

app.get('/', function(req,res){
	res.sendFile(__dirname + '/public/index.html');
});

app.use(require('express').static(__dirname + '/public'));

app.get('/javascript', function(req,res){
	res.sendFile(__dirname + '/public/javascript.html');
});

app.get('/react', function(req,res){
	res.sendFile(__dirname + '/public/react.html');
});

app.get('/node', function(req,res){
	res.sendFile(__dirname + '/public/node.html');
});
app.get('/business', function(req,res){
	res.sendFile(__dirname + '/public/business.html');
});

app.get('/public', function(req,res){
	res.sendFile(__dirname + '/public/public.html');
});

app.get('/css/city.css', function(req,res){
	res.sendFile(__dirname + '/css/city.css');
});

app.get('/css/main.css', function(req,res){
	res.sendFile(__dirname + '/css/main.css');
});

// tok namespace
const tok = io.of('/tok');

tok.on('connection', function(socket){
	socket.on('join',(data)=>{
		socket.join(data.room);
		tok.in(data.room).emit('message_user',`New user in ${data.room} room`)
	});
	console.log('user connected');
socket.on('type', (data)=>{
	
	socket.broadcast.emit('typing', `${data.User} is typing `);
console.log(data.User+' typing');
	});

	//socket.emit('message',{iso:'heyy'});
socket.on('message', (data)=>{
console.log(`message: ${data.userName}`);
	tok.in(data.room).emit('message',{msg:data.msg,userName:data.userName});
	});
	//socket.on('disconnect', () => {
		//console.log('user disconnected');
		
		//tok.emit('message','user disconnected');
	//})
	
	//socket.on('message', function(data){
		//console.log('message:' + data);	
	//})
});


//io.on('disconnection', function(socket){
	//console.log('user disconnected');
	//socket.emit('message',{iso:'heyy'});
//socket.on('message', (msg)=>{
//console.log(`message: ${msg}`);
	//io.emit('message',msg);
	//})
	
	//socket.on('message', function(data){
		//console.log('message:' + data);	
	//})
//});




