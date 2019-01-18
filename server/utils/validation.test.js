var expect = require('expect');

var {isRealString} = require('./validation');

describe('isRealString',()=>{
    it('should validate properly',()=>{
        var test1 = '   ';
        var test2 = 1;
        var test3 = '  LOTR';

        var case1 = isRealString(test1);
        var case2 = isRealString(test2);
        var case3 = isRealString(test3);

        expect(case1).toBe(false);
        expect(case2).toBe(false);
        expect(case3).toBe(true);
    });
});