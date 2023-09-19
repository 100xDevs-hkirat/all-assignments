const express = require('express');


const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/courses',userController.getAllCourses);

router.get('/courses/:courseId',authController.verifyToken,  userController.buyCourse);

router.get('/buyedcourse/:id',authController.verifyToken, userController.getBuyedCourse);

module.exports = router;




