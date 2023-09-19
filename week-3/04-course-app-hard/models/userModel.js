const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    purchasedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        reg: 'Course'
    }]
})

const User = mongoose.model('User',userSchema);
