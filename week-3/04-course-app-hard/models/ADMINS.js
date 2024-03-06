const mongoose = require("mongoose");


const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

const Admin = new mongoose.model("Admin", adminSchema);
module.exports = Admin;