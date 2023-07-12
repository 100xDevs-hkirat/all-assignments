const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const adminSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    email : {
        type: String,
       required: true,
        unique: true,
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
  
})

adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
  
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // Skip validation for passwordConfirm field if it's undefined
    next();
  });

const Admin = mongoose.model('Admin',adminSchema);

module.exports = Admin;