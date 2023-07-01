const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
    username :{
        type: String,
        required: true
    },
    password:{
        type: String,
        required : true
    },
    date:{
        type: Date,
        default : Date.now
    }
})

module.exports = mongoose.model('admin',AdminSchema);