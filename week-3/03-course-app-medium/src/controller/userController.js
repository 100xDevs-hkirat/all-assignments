const path = require('path');
const Utils = require('../utils/utils');

const usersPath = path.join(__dirname, '../database/user.json');
const coursesPath = path.join(__dirname, '../database/course.json');
const purchasesPath = path.join(__dirname, '../database/purchase.json');

const userController = {
    signup: async (req, res) => {
        // logic to sign up user
        const { username, password } = req.body;
        const USERS = await Utils.readFile(usersPath);
        const user = USERS.find(user => {
            return user.username === username;
        });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        USERS.push({ username, password });
        await Utils.writeFile(usersPath, USERS);
        const token = Utils.getLoginToken(username);
        res.status(201).json({ message: 'User created successfully', token })
    },

    login: async (req, res) => {
        // logic to log in user
        const { username, password } = req.headers;
        const USERS = await Utils.readFile(usersPath);
        const user = USERS.find(user => {
            return user.username === username && user.password === password;
        });
        if (user) {
            const token = Utils.getLoginToken(username);
            return res.status(200).json({ message: 'Logged in successfully', token });
        } else {
            return res.status(400).json({ message: 'User doesn\'t exist' });
        }
    },

    listAllCourses: async (req, res) => {
        // logic to list all courses
        const COURSES = await Utils.readFile(coursesPath);
        return res.status(201).json(COURSES);
    },

    purchaseCourse: async (req, res) => {
        // logic to purchase a course
        const courseId = parseInt(req.params.courseId);
        const USERS = await Utils.readFile(usersPath);
        const COURSES = await Utils.readFile(coursesPath);
        const PURCHASES = await Utils.readFile(purchasesPath);

        const user = USERS.find(user => {
            return user.username === req.username;
        });
        const courseExists = COURSES.find(course => {
            return course.courseId === courseId
        })
        if (!courseExists) {
            return res.status(400).json({ message: 'Course doesn\'t exist' });
        }
        if (user && courseExists) {
            let purchaseInd = -1;
            for (let i = 0; i < PURCHASES.length; i++) {
                if (PURCHASES[i].username === req.username) {
                    purchaseInd = i;
                    break;
                }
            }
            if (purchaseInd === -1) {
                PURCHASES.push({ username: user.username, courses: [courseId] })
            } else {
                PURCHASES[purchaseInd].courses.push(courseId);
            }
            await Utils.writeFile(purchasesPath, PURCHASES);
            return res.status(201).json({ message: 'Course purchased' });
        }
        res.status(400).json({ message: 'User doesn\'t exist' });
    },

    getAllPurchasedCourses: async (req, res) => {
        // logic to view purchased courses
        const PURCHASES = await Utils.readFile(purchasesPath);
        const COURSES = await Utils.readFile(coursesPath);
        const purchases = PURCHASES.find(purchase => {
            return purchase.username === req.username;
        })
        const courses = COURSES.filter(course => {
            return purchases.courses.includes(course.courseId);
        })
        res.json(courses);
    },
};

module.exports = userController;