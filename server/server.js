//bring in the path module for easy access to other folders
//its an inbuilt module so requires no installation
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
//bring in the inbuilt http library
const http = require('http');
//configure a public path
const publicPath = path.join(__dirname,'../public');
//configuration for heroku
const port = process.env.PORT || 3000;

var app = express();
//create a server using http and pass the express app into it
var server = http.createServer(app);//main reason for using this technique is so socket.io can be integrated
//create a web sockets variable
var io = socketIO(server);//io would now serve as a socket server object
//use the express static middleware to point to the public path
app.use(express.static(publicPath));
//use io to listen out for new socket connections
io.on('connection',(socket)=>{//thr socket argument stands for the single user connection that was just fired as an event
    //the connection argument specifies that io is listening for a connection
    console.log('New user connected..');
    //listen out for when the client disconnects using the socket argument and on function
    socket.on('disconnect',()=>{
        console.log('User disconnected..');
    });
});

server.listen(port,()=>{
    console.log(`Server is up on port ${port}`);
});