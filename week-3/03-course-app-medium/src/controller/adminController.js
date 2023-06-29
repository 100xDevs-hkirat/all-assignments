const path = require('path');
const Utils = require('../utils/utils');

const adminPath = path.join(__dirname, '../database/admin.json');
const coursesPath = path.join(__dirname, '../database/course.json');

const adminController = {
    signup: async (req, res) => {
        // logic to sign up admin 03-course-app-medium\src\database\admin.json
        const ADMINS = await Utils.readFile(adminPath);
        const { username, password } = req.body;
        const admin = ADMINS.find(admin => {
            return admin.username === username;
        });
        if (admin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        ADMINS.push({ username, password });
        await Utils.writeFile(adminPath, ADMINS);
        const token = Utils.getLoginToken(username);
        res.status(201).json({ message: 'Admin created successfully', token })
    },

    login: async (req, res) => {
        // logic to log in admin
        const { username, password } = req.headers;
        const ADMINS = await Utils.readFile(adminPath)
        const admin = ADMINS.find(admin => {
            return admin.username === username && admin.password === password;
        });
        if (admin) {
            const token = Utils.getLoginToken(username);
            return res.status(200).json({ message: 'Logged in successfully', token });
        } else {
            res.status(400).json({ message: 'Admin doesn\'t exist' });
        }
    },

    addCourse: async (req, res) => {
        // logic to create a course
        const { title, description, price, imageLink, published } = req.body;
        const COURSES = await Utils.readFile(coursesPath);
        COURSES.push({ title, description, price, imageLink, published, courseId: COURSES.length + 1 });
        await Utils.writeFile(coursesPath, COURSES);
        return res.status(201).json({ message: 'Course created successfully', courseId: COURSES.length });
    },

    updateCourse: async (req, res) => {
        // logic to edit a course
        const courseId = parseInt(req.params.courseId);
        const { title, description, price, imageLink, published } = req.body;
        const COURSES = await Utils.readFile(coursesPath);
        let ind = -1;
        for (let i = 0; i < COURSES.length; i++) {
            if (COURSES[i].courseId === courseId) {
                ind = i
                break;
            }
        }
        if (ind === -1) {
            return res.status(400).json({ message: 'Course doesn\'t exist' });
        }
        COURSES[ind] = { ...COURSES[ind], ...{ title, description, price, imageLink, published } };
        await Utils.writeFile(coursesPath, COURSES);
        return res.status(201).json({ message: 'Course updated successfully' });
    },

    getAllCourses: async (req, res) => {
        // logic to get all courses
        const COURSES = await Utils.readFile(coursesPath);
        return res.status(201).json(COURSES);
    }
};

module.exports = adminController;