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

var app = express();
//create a server using http and pass the express app into it
var server = http.createServer(app);//main reason for using this technique is so socket.io can be integrated
//create a web sockets variable
var io = socketIO(server);//io would now serve as a socket server object
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
            callback('Please provide valid username and room name');
        }
        //join the requested room
        socket.join(params.room);
        /*
        to broadcast to everyone in room use io.to(roomname).emit()
        to broadcast to everyone execpt user use socket.broadcast.to(roomname).emit()
        to borasdcast to just one user remains socket.emit()
        */
        //send a welcome message event to new user
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to TataFo!'));
        //inform other connected users of a new user just joining
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.username} joined the room`));
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
        io.emit('newMessage',generateMessage(message.from,message.text));
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
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
        //send acknowledgement for the client
        callback('User location..received');
    });
    //listen out for when the client disconnects using the socket argument and on function
    socket.on('disconnect',()=>{
        console.log('User disconnected..');
    });
});

server.listen(port,()=>{
    console.log(`Server is up on port ${port}`);
});