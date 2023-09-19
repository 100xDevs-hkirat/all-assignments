const express = require('express');

const router = express.Router();
const adminController = require('./../controllers/adminController');
const authController = require('./../controllers/authController');

router.post('/createcourse',adminController.createCourse);

router.patch('/updatecourse/:courseId',adminController.updateCourse);

router.get('/courses', adminController.getAllCourses);

router.delete('/delete/:id', adminController.deleteCourse);

router.get('/getcourse/:id', adminController.getCourse);


module.exports = router;