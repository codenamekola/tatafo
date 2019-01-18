class Users{
    //define constructor
    constructor(){
        //initialze and set users to an empty array
        this.users = [];
    }

    addUser(id,name,room){
        //create an object out of the supplied arguments
        var user = {id:id,username:name,room:room};
        //add user into array of users
        this.users.push(user);
        //return user object
        return user;
    }

    getUserList(room){
        //filter users from users array based on room name
        var users = this.users.filter((user)=>{
            return user.room === room;
        });
        //retrive the names of the users collected from above
        //map function will retrive the specified property and save them as array
        var namesArray = users.map((user)=>{
            return user.username;
        });

        return namesArray;
    }

    removeUser(id){
        var user = this.users.filter((user)=>{
            return user.id === id;
        })[0];//specify the first and only object in the result
        //remove the filtered user from the users array
        this.users.pop(user);
        return user;//return deleted user
    }

    getUser(id){
        var user = this.users.filter((user)=>{
            return user.id === id;
        })[0];//specify the first and only subject in the result

        return user;
    }
}

module.exports = {Users};