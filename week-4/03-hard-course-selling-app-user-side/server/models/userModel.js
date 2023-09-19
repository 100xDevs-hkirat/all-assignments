const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    email : {
        type: String,
       required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    role: {
        type: String,

    },
    passwordConfirm: {
        type: String, 
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        },
    },
    purchasedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }]
})


// using mongoose  middle ware to encrypt the password before saving to the database 
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
  
    this.password =  bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  });

const User = mongoose.model('User',userSchema);
module.exports = User;
