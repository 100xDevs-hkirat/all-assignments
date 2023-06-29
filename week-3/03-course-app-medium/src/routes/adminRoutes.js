const express = require('express');

const adminController = require('../controller/adminController');
const { auth } = require('../middleware/middleware');

const router = express.Router();

router.post('/signup', adminController.signup);
router.post('/login', adminController.login);
router.post('/courses', auth, adminController.addCourse);
router.put('/courses/:courseId', auth, adminController.updateCourse);
router.get('/courses', auth, adminController.getAllCourses);

module.exports = router;