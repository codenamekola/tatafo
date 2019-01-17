var expect = require('expect');
//bring in the function to be tested using es6 destructuring
var {generateMessage} = require('./message');

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

//run test using npm test