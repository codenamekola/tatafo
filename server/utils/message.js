//utility function to generate a message using the passed arguments
var generateMessage = (from,text)=>{
    return {
        from:from,
        text:text,
        createdAt: new Date().getTime()
    };
};

module.exports = {generateMessage};

//npm install expect --save-dev
//npm install mocha --save-dev
//npm install nodemon --save-dev