const Course = require('../models/course.model');
const Admin = require('../models/admin.model');

const createCourse = async (req, res) => {
    try {
        const { title, description, price, imageLink, published } = req.body;
        const course = await Course.create({ title, description, price, imageLink, published });
        res.status(201).json({ message: 'Course created successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const editCourse = async (req, res) => {
    try {
        const { title, description, price, imageLink, published } = req.body;
        const { courseId } = req.params;
        const course = await Course.findByIdAndUpdate(courseId, { title, description, price, imageLink, published }, { new: true });
        res.status(200).json({ message: 'Course updated successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json({ courses });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    createCourse,
    editCourse,
    getCourses,
}