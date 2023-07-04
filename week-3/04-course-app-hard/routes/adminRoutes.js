const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const courseController = require('../controllers/courseController')

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post(
  '/courses',
  authController.protect,
  authController.adminCheck,
  courseController.createCourse
)
router.get('/courses', authController.protect, courseController.getAllCourses)
router.put(
  '/courses/:courseId',
  authController.protect,
  authController.adminCheck,
  courseController.updateCourse
)

module.exports = router
