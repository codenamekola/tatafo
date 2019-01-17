//create object of io method, which we have access to via the socket.io.js file
var socket = io();//will handle opening up connections and keeping it open
//we can use the socket variable to listen for a connected event
socket.on('connect', function () {
    console.log('Connected to server..');
    //listen for new messages from server
    socket.on('newMessage', function (message) {
        console.log('message', message);
        //use jquery to render incoming messages
        //crated required html tag using jquery
        var li = jQuery('<li></li>');
        //give data to the created html tag
        li.text(`${message.from}: ${message.text}`);
        //append the created tag to an existing frontend element
        jQuery('#messages').append(li);
    });

    //jquery for chat form manipulation
    jQuery('#message-form').on('submit',function(e){
        //prevent default refresh behavior on submit
        e.preventDefault();
        //retrive data entered in chat from
        socket.emit('createMessage',{
            from:'User',
            text: jQuery('[name=message]').val()
            //add callback to retrieve server response
        }, function (serverResponse) {
            console.log('Getting reply from server..: ', serverResponse);
        });
    });
    //sample emitted message
    /*socket.emit('createMessage', {
        from:'Kola',
        text:'This is a message from a client'
        //add a callback that can receive an argument which is a response from the server
    }, function (serverResponse){
        console.log('Getting reply from server..: ',serverResponse);
    });*/
});
//likewise we can log a message when a connection drops
socket.on('disconnect', function () {
    console.log('Disconnected from server..');
});
