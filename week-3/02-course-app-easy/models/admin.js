const {v4 : uuidv4} = require("uuid")

class Admin{
    constructor(username,password){
        this.user = username;
        this.pass = password;
        this.id = uuidv4();
    }
    getDetails(){
        return {
            id: this.id,
            username : this.user,
            password : this.pass
        }
    }
}

module.exports = Admin;