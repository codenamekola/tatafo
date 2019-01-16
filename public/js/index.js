//create object of io method, which we have access to via the socket.io.js file
var socket = io();//will handle opening up connections and keeping it open
//we can use the socket variable to listen for a connected event
socket.on('connect', function () {
    console.log('Connected to server..');
    //new create message event
    socket.emit('createMessage',{
        from:'client@example.com',
        text:'Hi this is your client'
    });
});
//likewise we can log a message when a connection drops
socket.on('disconnect', function () {
    console.log('Disconnected from server..');
});
//listen for new message event from server
socket.on('newMessage', function(message){
    console.log('message',message);
});