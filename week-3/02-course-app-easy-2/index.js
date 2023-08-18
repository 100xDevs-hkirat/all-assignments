const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()

app.use(express.json())

let ADMINS = []
let USERS = []
let COURSES = []

const SECRET_KEY = 'test123'

const generateToken = user => {
  const payload = { username: user.username }
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
}
const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'UnAuthorized' })
  }

  const token = authHeader.split(' ')[1]

  return jwt.verify(token, SECRET_KEY, (err, data) => {
    if (err) {
      return res.status(401).json({ message: 'UnAuthorized' })
    }

    req.user = data
    next()
  })
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).send('Username and password are required')
  }

  const isAlreadyExists = ADMINS.find(
    admin => admin.username === username && admin.password === password
  )

  if (isAlreadyExists) {
    return res.status(400).send('Admin already exists')
  }

  ADMINS.push({
    username,
    password,
  })
  const jwtToken = generateToken({ user: { username, password } })

  return res
    .status(201)
    .json({ message: 'Admin created successfully', token: jwtToken })
})

app.post('/admin/login', (req, res) => {
  // logic to log in admin

  const { username, password } = req.headers

  if (!username || !password) {
    return res.status(400).send('Username and password are required')
  }

  const user = ADMINS.find(
    admin => admin.username === username && admin.password === password
  )

  if (user) {
    const jwtToken = generateToken(user)
    return res
      .status(200)
      .json({ message: 'Logged in successfully', token: jwtToken })
  } else {
    return res.status(400).json({ message: 'Invalid username or password' })
  }
})

app.post('/admin/courses', verifyJwt, (req, res) => {
  // logic to create a course

  const { title } = req.body

  const isCourseAlreadyExists = COURSES.find(course => course.title === title)

  if (isCourseAlreadyExists) {
    return res.status(400).json({ message: 'Course already exists' })
  }

  const newCourse = {
    ...req.body,
    id: COURSES.length + 1,
  }

  COURSES.push(newCourse)

  res
    .status(201)
    .json({ message: 'Course created successfully', courseId: newCourse?.id })
})

app.put('/admin/courses/:courseId', verifyJwt, (req, res) => {
  // logic to edit a course

  const { courseId } = req.params

  const courseIndex = COURSES.findIndex(
    course => course.id === Number(courseId)
  )
  if (courseIndex !== -1) {
    COURSES[courseIndex] = {
      ...COURSES[courseIndex],
      ...req.body,
    }

    return res.status(200).json({ message: 'Course updated successfully' })
  } else {
    return res.status(400).json({ message: 'Course not found' })
  }
})

app.get('/admin/courses', verifyJwt, (_, res) => {
  // logic to get all courses

  res.status(200).json({ courses: COURSES })
})

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).send('Username and password are required')
  }

  const isAlreadyExists = USERS.find(
    user => user.username === username && user.password === password
  )

  if (isAlreadyExists) {
    return res.status(400).send('User already exists')
  }

  const jwtToken = generateToken({ user: { username, password } })

  USERS.push({
    username,
    password,
    purchasedCourses: [],
  })

  return res
    .status(201)
    .json({ message: 'User created successfully', token: jwtToken })
})

app.post('/users/login', (req, res) => {
  // logic to log in user

  const { username, password } = req.headers

  if (!username || !password) {
    return res.status(400).send('Username and password are required')
  }

  const user = USERS.find(
    user => user.username === username && user.password === password
  )

  if (user) {
    const jwtToken = generateToken(user)
    return res
      .status(200)
      .json({ message: 'Logged in successfully', token: jwtToken })
  } else {
    return res.status(400).json({ message: 'Invalid username or password' })
  }
})

app.get('/users/courses', verifyJwt, (req, res) => {
  // logic to list all courses

  const publishedCourses = COURSES.filter(course => course.published)

  res.status(200).json({ courses: publishedCourses })
})

app.post('/users/courses/:courseId', verifyJwt, (req, res) => {
  // logic to purchase a course

  const { courseId } = req.params

  const publishedCourses = COURSES.filter(course => course.published)

  const courseIndex = publishedCourses.findIndex(
    course => course.id === Number(courseId)
  )

  if (courseIndex === -1) {
    return res.status(400).json({ message: 'Invalid course id' })
  }

  const user = USERS.find(u => u.username === req.user.username)

  if (!user) {
    return res.status(400).json({ message: 'Invalid user' })
  }

  if (!user.purchasedCourses) {
    user.purchasedCourses = []
  }

  user.purchasedCourses.push(publishedCourses[courseIndex])

  res.status(200).json({
    message: 'Course purchased successfully',
  })
})

app.get('/users/purchasedCourses', verifyJwt, (req, res) => {
  // logic to view purchased courses

  const user = USERS.find(u => u.username === req.user.username)
  res.status(200).json({
    courses: user.purchasedCourses,
  })
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
