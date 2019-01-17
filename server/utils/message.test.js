var expect = require('expect');
//bring in the function to be tested using es6 destructuring
var {generateMessage,generateLocationMessage} = require('./message');

describe('generateMessage',()=>{
    it('should generate correct message object',()=>{
        var from = 'Kola';
        var text = 'My test message';
        //get a returned value for the test case
        var message = generateMessage(from,text);
        //assert that cratedat is a number
        expect(message.createdAt).toBeA('number');
        //assert that from and text are included as properties in the returnd object
        expect(message).toInclude({from,text});
    });
});

describe('generateLocationMessage',()=>{
    it('should generate correct location object',()=>{
        var from = 'Kola';
        var longitude = 1;
        var latitude = 2;
        var message = generateLocationMessage(from,latitude,longitude);
        expect(message.url).toBe('https://www.google.com/maps?q=2,1');
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from});
    });
});

//run test using npm test