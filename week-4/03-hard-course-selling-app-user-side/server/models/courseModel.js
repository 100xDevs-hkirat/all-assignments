const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    instructor: {
        type: String,
        required: true,
        trim: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    description : {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageLink: {
        type: String,
        required: true,
    },
    rating : {
        type: Number,
        required: true,
        max: 5,
        min: 1
    }
})

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;