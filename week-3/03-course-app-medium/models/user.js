const {v4 : uuidv4} = require("uuid")

class User{
    constructor(username,password){
        this.user = username;
        this.pass = password;
        this.courses = [];
        this.id = uuidv4();
    }
    getDetails(){
        return {
            id: this.id,
            username : this.user,
            password : this.pass,
            courses : this.courses
        }
    }
}

module.exports = User;