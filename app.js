var express = require('express');

var app = express();

var fortune= require('./lib/fortune.js');

var formidable= require('formidable');

var credentials= require('./credentials');

var socket = require('socket.io');

var handlebars= require('express3-handlebars').create({defaultLayout: 'main'});

var useremail='';

 app.engine('handlebars',handlebars.engine);

 app.set('view engine','handlebars');

 app.set('port',process.env.PORT || 3000);

 app.use(express.static(__dirname + '/public'));

 app.use(require('body-parser')());

 app.use(require('cookie-parser')(credentials.cookieSecret));

 app.use(require('express-session')());

 app.use(function(req,res,next){
 	res.locals.flash = req.session.flash;
 	res.locals.username = req.session.user;
  res.locals.userlname = req.session.userlname;
  res.locals.useremail = req.session.usermail;

 	delete req.session.flash, req.session.user, req.session.userlname;

 	next();
 });




 app.get('/', function(req, res){
		// res.type('text/plain');
		// res.send('Meadowlark Travel');
		res.render('home',{csrf:'new token'});
});

app.get('/createaccount',function(req, res){

	res.render('createaccount');
});

var User = require('./models/usermodel.js');

app.post('/process-create', function(req,res){
	var form2 = new formidable.IncomingForm();
	form2.parse(req, function(err,fields,files){


		if(err){
			return res.redirect(303,'createaccount');
		}


			new User({

				fname: fields.fname,
				lname: fields.lname,
				email: fields.useremail,
				password : fields.password,

			}).save();

			 res.redirect(303,'/');

			 // User.find(function(err,users){
       //
			 // 		console.log(users.length);
			 // 		console.log(users);
       //
			 // });


	});
});


 app.post('/process-home',function(req,res){

 	var form = new formidable.IncomingForm();

 	form.parse(req,function(err,fields,files){

 		if(err) return res.redirect(303,'/about');


	 	if (!(fields.email)||(fields.email)==" ") {
	 		req.session.flash={

	 			intro:'validation error',

	 			message:'The emal address you entered was not valid.',

	 		};
	 		return res.redirect(303, '/');
	 	}

	 	// Authentication/////

	 	User.find({email : fields.email, password:fields.password },function(err,users){
	 		// users.toArray(function(err,result){

	 			if (users.length===0) {
	 				req.session.flash = {message : 'Wrong email or password', intro : 'Authentication FAILED'};
	 				return res.redirect(303,'/');
	 			}

	 			var this_user = users[0];
	 			delete this_user._id;
	 			delete this_user.password;
        req.session.userlname = this_user.lname;
	 			req.session.user = this_user.fname;
	 			req.session.usermail= this_user.email;
	 				return res.redirect(303, 'chathome');

	 		// });
	 	});

	 });
 	// console.log('form (from querystring): ' + req.query.form);
 });

app.get('/chathome', function(req,res){

  if(res.locals.username && !(res.locals.username == " ")){


    		 User.find({email:req.session.usermail},function(err,users){

    						var currentFriends = users[0].friends;

    			User.find({_id:{$in : currentFriends} },function(err, users){

    				//console.log(users);

    				var context_friends = {

    					users: users.map(function(user){

    						return {

    							name: user.fname,
    							lname: user.lname,
    							id : user._id,

    						}
    					delete user.password;
    					})
    			};
    				res.render('chathome', context_friends);
    			});

    			});

   return;
  }
  res.redirect(303,'/')

});

app.get('/chatfriends',function(req,res){
  res.render('chatfriends');
});


 // app.get('/findfriends',function(req,res){
 // 	res.render('findfriends');
 // })

var Vacation = require('./connection.js');

 app.get('/findfriends', function(req, res){

 	var excludedEmails = [req.session.usermail," ","" ];


		 User.find({email:req.session.usermail},function(err,users){

						var currentFriends = users[0].friends;

			User.find({email:{$nin : excludedEmails}, _id:{$nin : currentFriends} },function(err, users){

				//console.log(users);

				var context = {

					users: users.map(function(user){

						return {

							name: user.fname,
							lname: user.lname,
							id : user._id,

						}
					delete user.password;
					})
			};
				res.render('findfriends', context);
			});

			});
	});


app.get('/add/:id',function(req,res){

	 User.update(
				{email: req.session.usermail},
				{$push : {friends: req.params.id}},
				{upsert : true},function(err){
					if (err) {console.log('FAILED to ADD FRIEND!');}
				}
				);
	 // User.find({email: req.session.usermail},function(err,users){
	 // 	console.log(users);
	 // });


	 res.redirect(303,'/findfriends');

});




app.get('/about', function(req, res){

		res.render('about',{fortune : fortune.getFortune()});
});


	//middleware
 app.use(function (request, response) {
 		//response.type('text/plain');
 		response.status(404);
 		//response.send('404- Not found');
 		response.render('404');
 });

 app.use(function (err,request, response,next) {
 		console.error(err.stack);
 		response.type('text/plain');
 		response.status(500);
 		//response.send('500- Server Error');
 		response.render('500');
 });


 var server= app.listen(app.get('port'),function(){
 	console.log('Express started:......');
 });


var io = socket(server);

  var users=[],grpmessages=[];

// Connection event
io.on('connection',function(socket){
var userId;
    console.log('socket connection made',socket.id);
    // Handle chat event

    socket.on('chat',function(data){
      grpmessages.push('<p><strong>' + data.username + ':</strong> ' + data.message + '</p>');
        io.sockets.emit('output',{grpmessage : grpmessages});
        console.log(grpmessages);
    });
    socket.on('chat_to_friend',function(data){



      User.find({fname:data.username},function(err, result) {
         userId = (result[0]._id).toString();

           users[userId] = {
            friends:result[0].friends,
              socket: socket,
              };
              var user = users[userId];
          if(user && user.friends && user.friends.length > 0) {

              user.socket.emit('output_to_friend', data);

                for(var i = 0; i < user.friends.length;i++){

                  var friendId = user.friends[i].toString();

                  var friend = users[friendId];

                  console.log(result[0].fname+' sent to ' + friend);

                  if(friend && friend.socket) {

                        friend.socket.emit('output_to_friend', data);
                      }
                }
    } else {
      console.log('cant send ' + data.message);
    }
      });

});
    // Handle typing event

    socket.on('typing',function(data){

        socket.broadcast.emit('typing',data);

    });

    socket.on('typing_frnd_',function(data){

        socket.broadcast.emit('typing_frnd',data);

    });

    socket.on('disconnect',function(){
      console.log('disconnected' + socket.id);
      console.log(userId);
      users[userId] = null;
    })

});



//////////////////////////////
