const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(express.json())

let ADMINS = []
let USERS = []
let COURSES = []

const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers

  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  )
  if (admin) {
    next()
  } else {
    res.status(403).json({ message: 'Admin authentication failed' })
  }
}

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers

  const user = USERS.find(
    (u) => u.username === username && u.password === password
  )
  if (user) {
    req.user = user
    next()
  } else {
    res.status(403).json({ message: 'User authentication failed' })
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body
  const exsistingAdmin = ADMINS.find(
    (obj) => obj.username === username && obj.password === password
  )
  if (exsistingAdmin) {
    res.status(403).json({ message: 'Admin already exists' })
  } else {
    ADMINS.push(admin)
    res.json({ message: 'Admin created successfully' })
  }
})

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({ message: 'Logged in successfully' })
})

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
  const course = req.body
  course.id = Date.now()
  COURSES.push(course)
  res.json({ meessage: 'Course created successfully' })
})

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId)
  const course = COURSES.find((c) => c.id === courseId)
  if (course) {
    Object.assign(course, req.body)
    res.json({ message: 'Course updated successfully' })
  } else {
    res.status(404).json({ message: 'Course not found' })
  }
})

app.get('/admin/courses', adminAuthentication, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES })
})

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = req.body
  user.purchasedCourses = []
  const exsistingUser = USERS.find(
    (obj) => obj.username === username && obj.password === password
  )
  if (exsistingUser) {
    res.status(403).json({ message: 'User already exists' })
  } else {
    USERS.push(user)
    res.json({ message: 'User created successfully' })
  }
})

app.post('/users/login', userAuthentication, (req, res) => {
  // logic to log in user
  res.json({ message: 'Logged in successfully' })
})

app.get('/users/courses', userAuthentication, (req, res) => {
  // logic to list all courses
  const course = COURSES.filter((c) => c.published === true)
  res.json({ Courses: course })
})

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId)
  const course = COURSES.filter((c) => c.id === courseId && c.published)
  if (course) {
    req.user.purchasedCourses.push(courseId)
    res.json({ message: 'Course purchased successfully' })
  } else {
    res.status(404).json({ message: 'Course not found' })
  }
})

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  // logic to view purchased courses
  const purchasedCourseId = req.user.purchasedCourses
  const purchasedCourses = COURSES.filter((c) =>
    purchasedCourseId.includes(c.id)
  )
  res.json({ 'Purchased Courses': purchasedCourses })
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
