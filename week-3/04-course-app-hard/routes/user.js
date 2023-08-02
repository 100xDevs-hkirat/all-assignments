const express = require('express')
const mongoose = require('mongoose')
const { User, Course } = require('../db/index')
const jwt = require('jsonwebtoken')
const { SECRET2 } = require('../middleware/auth')
const { authenticateUserJwt } = require('../middleware/auth')

const router = express.Router()

// User routes

router.get('/me', authenticateUserJwt, async (req, res) => {
  res.json({
    username: req.user.username,
  })
})

router.post('/signup', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (user) {
    res.status(403).json({ message: 'User already exists' })
  } else {
    const newUser = new User({ username, password })
    await newUser.save()
    const token = jwt.sign({ username, role: 'user' }, SECRET2, {
      expiresIn: '1h',
    })
    res.json({ message: 'User created successfully', token: token })
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username, password })
  if (user) {
    const token = jwt.sign({ username, role: 'user' }, SECRET2, {
      expiresIn: '1h',
    })
    res.json({ message: 'User logged in successfully', token: token })
  } else {
    res.status(403).json({ message: 'Invalid Username or password' })
  }
})

router.get('/courses', authenticateUserJwt, async (req, res) => {
  const courses = await Course.find({ published: true })
  res.json({ Courses: courses })
})

router.post('/courses/:courseId', authenticateUserJwt, async (req, res) => {
  const course = await Course.findById(req.params.courseId)
  if (course) {
    const user = await User.findOne({ username: req.user.username })
    if (user) {
      user.purchasedCourse.push(course)
      await user.save()
      res.json({ message: 'Course purchased successfully' })
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } else {
    res.status(404).json({ message: 'Course not found' })
  }
})

router.get('/purchasedCourses', authenticateUserJwt, async (req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({ username: req.user.username }).populate(
    'purchasedCourse'
  )
  if (user) {
    res.json({ PurchasedCourses: user.purchasedCourse || [] })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})

module.exports = router
