const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const courseController = require('../controllers/courseController')

router.post('/signup', authController.userSignup, authController.signup)
router.post('/login', authController.login)
router.get('/courses', authController.protect, courseController.getAllCourses)
router.post(
  '/courses/:courseId',
  authController.protect,
  courseController.buyCourse
)

router.get(
  '/purchasedCourses',
  authController.protect,
  courseController.getPurchasedCourses
)

module.exports = router
