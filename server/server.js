//bring in the path module for easy access to other folders
//its an inbuilt module so requires no installation
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
//bring in the inbuilt http library
const http = require('http');
//configure a public path
const publicPath = path.join(__dirname,'../public');
//bring in function for creating messages
const {generateMessage,generateLocationMessage} = require('./utils/message');
//configuration for heroku
const port = process.env.PORT || 3000;
//get function for validating user entry for joining chat
const {isRealString} = require('./utils/validation');
//get class with user functions
const {Users} = require('./utils/users');

var app = express();
//create a server using http and pass the express app into it
var server = http.createServer(app);//main reason for using this technique is so socket.io can be integrated
//create a web sockets variable
var io = socketIO(server);//io would now serve as a socket server object
//create a new users object to have access to user methods
var users = new Users();
//use the express static middleware to point to the public path
app.use(express.static(publicPath));
//use io to listen out for new socket connections
io.on('connection',(socket)=>{//the socket argument stands for the single user connection that was just fired as an event
    //the connection argument specifies that io is listening for a connection
    //io.on will listen for connectino from all potential users
    //socket.on listens for an event from one particular socket
    console.log('New user connected..');
    //listen for the join event from the client
    socket.on('join',(params,callback)=>{
        //verify and validate user entry
        if(!isRealString(params.username) || !isRealString(params.room)){
            //if validation fails pass error message to callback
            return callback('Please provide valid username and room name');
        }
        //join the requested room
        socket.join(params.room);
        //remove this user from any previous rooms
        //users.removeUser(socket.id);//this gave issues in having current users list
        //call users function to add user to room
        users.addUser(socket.id,params.username,params.room);
        //emit event to update user list by getting all current users in room
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        /*
        to broadcast to everyone in room use io.to(roomname).emit()
        to broadcast to everyone execpt user use socket.broadcast.to(roomname).emit()
        to borasdcast to just one user remains socket.emit()
        */
        //send a welcome message event to new user
        socket.emit('newMessage', generateMessage('Tata$Bot', 'Connected..'));
        //inform other connected users of a new user just joining
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Tata$Bot',`${params.username} joined the room`));
        //if no errors still call callback but no need for any message
        callback();
    });
    //listen for messages from a client
    socket.on('createMessage',(message,callback)=>{
        //the callback argument represents a function that can be called 
        //as a way of the server giving an acknowloedgment back to the client
        console.log('message',message);
        //emit the message to other connected users
        //io.emit will broadcast to all connected users
        //socket.emit broadcasts to just one socket connection
        //get user instance 
        var user = users.getUser(socket.id);
        //if user is true then proceed
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.username, message.text));
        }
        callback('Received by server..');//callback is called an a string is passed as argument
        //emit a broadcast message to everyone else but the sender
        /*socket.broadcast.emit('newMessage',{
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()//get a time stamp
        });*/
    });
    //listen out for when a client beams their location
    socket.on('createLocationMessage',(coords,callback)=>{
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.username, coords.latitude, coords.longitude));
        }
        //send acknowledgement for the client
        callback('User location..received');
    });
    //listen out for when the client disconnects using the socket argument and on function
    socket.on('disconnect',()=>{
        console.log('User disconnected..');
        //create a variable to represent a disconnected user
        var user = users.removeUser(socket.id);
        //if user is true,emit two events
        if(user){
            //emit first event to update the userlist
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            //emit second event to inform other users of user leaving
            io.to(user.room).emit('newMessage',generateMessage('Tata$Bot',`${user.username} has left the room..`));
        }
    });
});

server.listen(port,()=>{
    console.log(`Server is up on port ${port}`);
});