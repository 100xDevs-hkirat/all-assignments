
const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },

    username: {

        type: String,
        required: true,
    }
    ,
    password: {
        type: String,
        required: true,
    }
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
    }
    ,
    password: {
        type: String,
        required: true,
    }
    ,
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]

});

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
});

const Admin =  mongoose.model("Admin", adminSchema);
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);

module.exports = {
    Admin,
    User,
    Course
}