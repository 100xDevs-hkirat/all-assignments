const express = require('express')
const app = express()

app.use(express.json())

let ADMINS = []
let USERS = []
let COURSES = []

const protectAdminMiddleware = (req, res, next) => {
  const { username, password } = req.headers

  if (!username || !password) {
    return res.status(400).send('Username and password are required')
  }

  const isAdminExists = ADMINS.find(
    admin => admin.username === username && admin.password === password
  )

  if (isAdminExists) {
    req.admin = isAdminExists

    next()
  } else {
    return res.status(401).json({ message: 'UnAuthorized' })
  }
}
const protectUserMiddleware = (req, res, next) => {
  const { username, password } = req.headers

  if (!username || !password) {
    return res.status(400).send('Username and password are required')
  }

  const isUsersExists = USERS.find(
    user => user.username === username && user.password === password
  )

  if (isUsersExists) {
    req.user = isUsersExists

    next()
  } else {
    return res.status(401).json({ message: 'UnAuthorized' })
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
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

  return res.status(201).json({ message: 'Admin created successfully' })
})

app.post('/admin/login', (req, res) => {
  const { username, password } = req.headers

  if (!username || !password) {
    return res.status(400).send('Username and password are required')
  }

  const user = ADMINS.find(
    admin => admin.username === username && admin.password === password
  )

  if (user) {
    return res.status(200).json({ message: 'Logged in successfully' })
  } else {
    return res.status(400).json({ message: 'Invalid username or password' })
  }
})

app.post('/admin/courses', protectAdminMiddleware, (req, res) => {
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

app.put('/admin/courses/:courseId', protectAdminMiddleware, (req, res) => {
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

app.get('/admin/courses', protectAdminMiddleware, (req, res) => {
  res.status(200).json({ courses: COURSES })
})

// User routes
app.post('/users/signup', (req, res) => {
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

  USERS.push({
    username,
    password,
    purchasedCourses: [],
  })

  return res.status(201).json({ message: 'User created successfully' })
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
    return res.status(200).json({ message: 'Logged in successfully' })
  } else {
    return res.status(400).json({ message: 'Invalid username or password' })
  }
})

app.get('/users/courses', protectUserMiddleware, (_, res) => {
  // logic to list all courses

  const publishedCourses = COURSES.filter(course => course.published)

  res.status(200).json({ courses: publishedCourses })
})

app.post('/users/courses/:courseId', protectUserMiddleware, (req, res) => {
  // logic to purchase a course

  const { courseId } = req.params

  const publishedCourses = COURSES.filter(course => course.published)

  const courseIndex = publishedCourses.findIndex(
    course => course.id === Number(courseId)
  )

  if (courseIndex === -1) {
    return res.status(400).json({ message: 'Invalid course id' })
  }

  req.user.purchasedCourses.push(publishedCourses[courseIndex])

  res.status(200).json({
    message: 'Course purchased successfully',
  })
})

app.get('/users/purchasedCourses', protectUserMiddleware, (req, res) => {
  // logic to view purchased courses

  res.status(200).json({
    courses: req.user.purchasedCourses,
  })
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
