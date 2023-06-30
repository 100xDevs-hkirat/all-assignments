const {Schema, model} = require('mongoose');

const CourseSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    imageLink: {
        type: String,
    },
    published: {
        type: Boolean,
        default: false,
    },
});

const Course = model('Course', CourseSchema);

module.exports = Course;