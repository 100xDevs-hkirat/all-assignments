const express = require('express')
const mongoose = require('mongoose')
const { Admin, Course } = require('../db/index')
const jwt = require('jsonwebtoken')
const { SECRET1 } = require('../middleware/auth')
const { authenticateAdminJwt } = require('../middleware/auth')

const router = express.Router()

router.get('/me', authenticateAdminJwt, async (req, res) => {
  res.json({
    username: req.user.username,
  })
})

// Admin routes
router.post('/signup', async (req, res) => {
  const { username, password } = req.body
  const admin = await Admin.findOne({ username })
  if (admin) {
    res.status(403).json({ message: 'Admin already exists' })
  } else {
    const newAdmin = new Admin({ username, password })
    await newAdmin.save()
    const token = jwt.sign({ username, role: 'admin' }, SECRET1, {
      expiresIn: '1h',
    })
    res.json({ message: 'Admin created successfully', token: token })
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const admin = await Admin.findOne({ username, password })
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, SECRET1, {
      expiresIn: '1h',
    })
    res.json({ message: 'Admin logged in successfully', token: token })
  } else {
    res.status(403).json({ message: 'Invalid Username or password' })
  }
})

router.post('/courses', authenticateAdminJwt, async (req, res) => {
  const course = new Course(req.body)
  await course.save()
  res.json({ message: 'Course created successfully', course: course })
})

router.put('/course/:courseId', authenticateAdminJwt, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
  })
  if (course) {
    res.json({ message: 'Course updated successfull', course: course })
  } else {
    res.status(404).json({ message: 'Course not found' })
  }
})

router.get('/courses', authenticateAdminJwt, async (req, res) => {
  const courses = await Course.find()
  res.json({ Courses: courses })
})

router.get('/course/:courseId', authenticateAdminJwt, async (req, res) => {
  const course = await Course.findById(req.params.courseId)
  if (course) {
    res.json({ Course: course })
  } else {
    res.status(404).json({ message: 'Course not found' })
  }
})

router.delete('/course/:courseId',authenticateAdminJwt,async (req,res)=>{
    const courseId = req.params.courseId

    try {
      // Use findByIdAndDelete to find and remove the course by ID
      const deletedCourse = await Course.findByIdAndDelete(courseId)

      if (!deletedCourse) {
        return res.status(404).json({ message: 'Course not found' })
      }

      // Return a success response
      res.json({ message: 'Course deleted successfully' })
    } catch (error) {
      // Handle any errors that occur during the deletion process
      res
        .status(500)
        .json({ message: 'Error deleting course', error: error.message })
    }
})

module.exports = router
