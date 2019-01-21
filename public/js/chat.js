//var moment = require('moment');
//create object of io method, which we have access to via the socket.io.js file
var socket = io();//will handle opening up connections and keeping it open
//function for autoscroll
function scrollToBottom(){
    //select chat containing element
    var messages = jQuery('#messages');
    //get newest chat in the list
    var newMessage = messages.children('li:last-child');
    //get height for calculations
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    //get conditions for scroll
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}
//we can use the socket variable to listen for a connected event
socket.on('connect', function () {
    console.log('Connected to server..');
    //begin process to join a chat room
    //get the entered name and chat room data submitted by user
    var params = jQuery.deparam(window.location.search);
    //emit an event to the server and pass the params
    //use an acknowldegment function to get response from server or output errors
    socket.emit('join',params,function(err){
        if(err){
            //if an error comes back in ack,send user back to root page and alert user on error
            alert(err);
            window.location.href = '/';
        }else{
            //if no errors
            console.log('No errors..');
        }
    });
    //listen for new messages from server
    socket.on('newMessage', function (message) {
        console.log('message', message);
        //format the time that comes in with the message
        var formattedTime = moment(message.createdAt).format('h:mm a');
        //use jquery to render incoming messages
        //crated required html tag using jquery
        var li = jQuery('<li class="list-group-item bg-dark text-white"></li>');
        //create small tags
        var small = jQuery('<small></small>');
        //assign the message into the small tags
        small.text(`${message.from} ${formattedTime}: ${message.text}`);
        //append the small tags into the list item
        li.append(small);
        //append the list item to the front end element
        jQuery('#messages').append(li);
        //call autoscroll
        scrollToBottom();
    });
    //listen for new users joining the chat room
    socket.on('updateUserList', function(users){
        console.log('Users',users);
        var ol = jQuery('<ol class="list-group"></ol>');
        users.forEach(function(user){
            ol.append(jQuery('<li class="list-group-item"></li>').text(user));
        });

        jQuery('#chat-users').html(ol);
    });
    //listen for new location messages from server
    socket.on('newLocationMessage', function(message){
        //create list item element
        var li = jQuery('<li class="list-group-item bg-dark text-white"></li>');
        var small = jQuery('<small></small>');
        //create element for the user location link
        var a = jQuery('<a target="_blank">New shared location</a>');
        //inject message into the small tags
        var formattedTime = moment(message.createdAt).format('h:mm a');
        small.text(`${message.from} ${formattedTime}: `);
        //set the link attribute of the a tag
        a.attr('href',message.url);
        //append the link tag with the small tags
        small.append(a);
        li.append(small);
        //append the full list item to the messages element
        jQuery('#messages').append(li);
        //call autoscroll
        scrollToBottom();
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
            //clear the chat input box by setting its value to an empty string
            jQuery('[name=message]').val('');
            console.log('Getting reply from server..: ', serverResponse);
        });
    });

    //code for getting user location
    var locationButton = jQuery('#send-location');
    locationButton.on('click',function(){
    //check if users browser has geolocation enabled
        if(!navigator.geolocation){
            return alert('Sorry your browser doesnt support this feature');
        }
        //if geolocation is enabled disable the button after the user clicked it
        //this is to ensure they do not click multiple times
        //also change what the button says
        locationButton.attr('disabled','disabled').text('sending location...');
        //if geolocation is working,get user position.
        //add one callback for success case and one for error case
        navigator.geolocation.getCurrentPosition(function(position){
            console.log(position);
            //once location data is received, reenable the location button
            locationButton.removeAttr('disabled').text('Beam your location');
            //emit a new message to the server with the coordinates
            socket.emit('createLocationMessage',{
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
                //add callback for server response
            }, function (serverResponse) {
                console.log('Getting reply from server..: ', serverResponse);
            });
        },function(){
                locationButton.removeAttr('disabled').text('Beam your location');
            //give error message if location not retrieved
            alert('Unable to fetch your location :(');
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
