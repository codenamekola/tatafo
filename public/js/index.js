var moment = require('moment');
//create object of io method, which we have access to via the socket.io.js file
var socket = io();//will handle opening up connections and keeping it open
//we can use the socket variable to listen for a connected event
socket.on('connect', function () {
    console.log('Connected to server..');
    //listen for new messages from server
    socket.on('newMessage', function (message) {
        console.log('message', message);
        //format the time that comes in with the message
        var formattedTime = moment(message.createdAt).format('h:mm a');
        //use jquery to render incoming messages
        //crated required html tag using jquery
        var li = jQuery('<li class="list-group-item bg-dark text-white"></li>');
        //give data to the created html tag
        li.text(`${message.from} ${formattedTime}: ${message.text}`);
        //append the created tag to an existing frontend element
        jQuery('#messages').append(li);
    });
    //listen for new location messages from server
    socket.on('newLocationMessage', function(message){
        //create list item element
        var li = jQuery('<li class="list-group-item bg-dark text-white"></li>');
        //create element for the user location link
        var a = jQuery('<a target="_blank">New sent location</a>');
        //inject message into the list item
        var formattedTime = moment(message.createdAt).format('h:mm a');
        li.text(`${message.from} ${formattedTime}: `);
        //set the link attribute of the a tag
        a.attr('href',message.url);
        //append the link tag with the list item tag
        li.append(a);
        //append the full list item to the messages element
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
