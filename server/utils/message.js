var moment = require('moment');
//utility function to generate a message using the passed arguments
var generateMessage = (from,text)=>{
    return {
        from:from,
        text:text,
        createdAt: moment().valueOf()
    };
};

var generateLocationMessage = (from,latitude,longitude)=>{
    return {
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    }
}

module.exports = {generateMessage,generateLocationMessage};

//npm install expect --save-dev
//npm install mocha --save-dev
//npm install nodemon --save-dev
//npm install moment --save