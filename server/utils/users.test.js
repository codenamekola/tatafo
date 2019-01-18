var expect = require('expect');

var {Users} = require('./users');

describe('Users',()=>{
    //add some seed data to an array of user objects for testing purposes
    var users;//defined out here so its accessbile to all our tests below
    //seed data before each test in this describe block
    beforeEach(()=>{
        users = new Users();
        users.users = [
            {id:'1',username:'Kola',room:'Chatroom'},
            {id:'2',username:'Kenny',room: 'Otherroom' },
            {id:'3',username:'Taiye',room: 'Chatroom' }
        ];
    });

    it('should add new user object',()=>{
        var users = new Users();
        //create a test user object
        var user = {
            id:'testid',
            username:'testname',
            room:'testroom'
        };
        //pass the user data to Users object
        var resUser = users.addUser(user.id,user.username,user.room);
        //assert that the users array in the users class now equals the user object
        expect(users.users).toEqual([resUser]);
    });

    it('should get user names from room',()=>{
        var room = 'Chatroom';
        var userlist = users.getUserList(room);
        expect(userlist).toEqual([users.users[0].username , users.users[2].username]);
    });

    it('should remove user from users array',()=>{
        var user = users.removeUser('1');
        expect(user.id).toEqual('1');
    });

    it('should get user by id',()=>{
        var user = users.getUser('3');
        expect(user.id).toEqual('3');
    });
});