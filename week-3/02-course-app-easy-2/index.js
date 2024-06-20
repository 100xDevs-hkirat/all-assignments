const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

let ADMINS = []
let USERS = []
let COURSES = []

const secretKeyAdmin = 'Misti'
const secretKeyUser = 'Secret'

const generateAdminToken = (admin) => {
  const payload = { username: admin.username }
  return jwt.sign(payload, secretKeyAdmin, { expiresIn: '10min' })
}

const generateUserToken = (user) => {
  const payload = { username: user.username }
  return jwt.sign(payload, secretKeyUser, { expiresIn: '10min' })
}

const authenticateAdminJwt = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    jwt.verify(token, secretKeyAdmin, (err, admin) => {
      if (err) {
        return res.sendStatus(403)
      }
      req.user = admin
      next()
    })
  } else {
    res.sendStatus(401)
  }
}

const authenticateUserJwt = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    jwt.verify(token, secretKeyUser, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }
      req.user = user
      next()
    })
  } else {
    res.sendStatus(401)
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  const admin = req.body
  const exsistingAdmin = ADMINS.find(
    (obj) => obj.username === admin.username && obj.password === admin.password
  )
  if (exsistingAdmin) {
    res.status(403).json({ message: 'Admin already exists' })
  } else {
    ADMINS.push(admin)
    const token = generateAdminToken(admin)
    res.json({ message: 'Admin created successfully', token: token })
  }
})

app.post('/admin/login', (req, res) => {
  const admin = req.body
  const exsistingAdmin = ADMINS.find(
    (obj) => obj.username === admin.username && obj.password === admin.password
  )
  if (exsistingAdmin) {
    const token = generateAdminToken(admin)
    res.json({ message: 'Logged in successfully', token: token })
  } else {
    res.status(403).json({ message: 'Authentication failed' })
  }
})

app.post('/admin/courses', authenticateAdminJwt, (req, res) => {
  const course = req.body
  course.id = COURSES.length + 1
  COURSES.push(course)
  res.json({ message: 'Course created successfully', courseId: course.id })
})

app.put('/admin/courses/:courseId', authenticateAdminJwt, (req, res) => {
  const courseId = parseInt(req.params.courseId)
  const course = COURSES.find((c) => c.id === courseId)
  if (course) {
    Object.assign(course, req.body)
    res.json({ message: 'Course updated successfully' })
  } else {
    res.status(404).json({ message: 'Course not found' })
  }
})

app.get('/admin/courses', authenticateAdminJwt, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES })
})

// User routes
app.post('/users/signup', (req, res) => {
  const user = req.body
  const existingUser = USERS.find((u) => u.username === user.username)
  if (existingUser) {
    res.status(403).json({ message: 'User already exists' })
  } else {
    USERS.push(user)
    const token = generateUserToken(user)
    res.json({ message: 'User created successfully', token })
  }
})

app.post('/users/login', (req, res) => {
  const user = req.body
  const existingUser = USERS.find((u) => u.username === user.username)
  if (existingUser) {
    const token = generateUserToken(user)
    res.json({ message: 'User Logged in successfully', token })
  } else {
    res.status(403).json({ message: 'Authentication failed' })
  }
})

app.get('/users/courses', authenticateUserJwt, (req, res) => {
  const course = COURSES.filter((c) => c.published === true)
  res.json({ Courses: course })
})

app.post('/users/courses/:courseId', authenticateUserJwt, (req, res) => {
  const courseId = parseInt(req.params.courseId)
  const course = COURSES.filter((c) => c.id === courseId && c.published)
  if (course) {
    const user = USERS.find((u) => u.username === req.user.username)
    if (user) {
      if (!user.purchasedCourses) {
        user.purchasedCourses = []
      }
      user.purchasedCourses.push(course)
      res.json({ message: 'Course purchased successfully' })
    } else {
      res.status(403).json({ message: 'User not found' })
    }
  } else {
    res.status(404).json({ message: 'Course not found' })
  }
})

app.get('/users/purchasedCourses', authenticateUserJwt, (req, res) => {
  const user = USERS.find((u) => u.username === req.user.username)
  if (user && user.purchasedCourses) {
    res.json({ purchasedCourses: user.purchasedCourses })
  } else {
    res.status(404).json({ message: 'No courses purchased' })
  }
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
