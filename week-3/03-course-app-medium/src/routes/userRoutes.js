const express = require('express');

const userController = require('../controller/userController');
const { auth } = require('../middleware/middleware');

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/courses', auth, userController.listAllCourses);
router.post('/courses/:courseId', auth, userController.purchaseCourse);
router.get('/purchasedCourses', auth, userController.getAllPurchasedCourses);

module.exports = router;