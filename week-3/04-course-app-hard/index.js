const express = require('express')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const DB_URL = 'mongodb://localhost:27017/course'
const SECRET_KEY = 'test123'

app.use(express.json())

// Define mongoose schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
})

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
})

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageLink: String,
  published: { type: Boolean },
})

const User = mongoose.model('User', userSchema)
const Admin = mongoose.model('Admin', adminSchema)
const Course = mongoose.model('Course', courseSchema)

const connectDB = async () => {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log('Connected to DB')
    })
    .catch(error => {
      console.log('Error while connecting to DB', error)
    })
}

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

connectDB()

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).send('Username and password are required')
  }
  const isAlreadyExists = await Admin.findOne({ username })
  if (isAlreadyExists) {
    return res.status(400).json({ message: 'Admin already exists' })
  }

  Admin.create({
    username,
    password,
  })

  const jwtToken = generateToken({ user: { username, password } })
  return res
    .status(201)
    .json({ message: 'Admin created successfully', token: jwtToken })
})

app.post('/admin/login', async (req, res) => {
  // logic to log in admin

  const { username, password } = req.headers

  if (!username || !password) {
    return res.status(400).send('Username and password are required')
  }

  const user = await Admin.findOne({ username })

  if (user) {
    const jwtToken = generateToken(user)
    return res
      .status(200)
      .json({ message: 'Logged in successfully', token: jwtToken })
  } else {
    return res.status(400).json({ message: 'Invalid username or password' })
  }
})

app.post('/admin/courses', verifyJwt, async (req, res) => {
  // logic to create a course

  const { title } = req.body

  const isCourseAlreadyExists = await Course.findOne({ title })

  if (isCourseAlreadyExists) {
    return res.status(400).json({ message: 'Course already exists' })
  }

  const newCourse = {
    ...req.body,
  }

  const newCourseAdded = await Course.create(newCourse)

  res.status(201).json({
    message: 'Course created successfully',
    courseId: newCourseAdded?._id,
  })
})

app.put('/admin/courses/:courseId', verifyJwt, async (req, res) => {
  // logic to edit a course

  const { courseId } = req.params

  const course = await Course.findOne({ _id: courseId })

  if (course) {
    await Course.findOneAndUpdate(
      {
        courseId,
      },
      {
        ...req.body,
      }
    )

    return res.status(200).json({ message: 'Course updated successfully' })
  } else {
    return res.status(400).json({ message: 'Course not found' })
  }
})

app.get('/admin/courses', verifyJwt, async (req, res) => {
  // logic to get all courses

  const courses = await Course.find({})

  res.status(200).json({ courses })
})

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).send('Username and password are required')
  }

  const isAlreadyExists = await User.findOne({
    username,
  })

  if (isAlreadyExists) {
    return res.status(400).send('User already exists')
  }

  const jwtToken = generateToken({ user: { username, password } })

  await User.create({
    username,
    password,
    purchasedCourses: [],
  })

  return res
    .status(201)
    .json({ message: 'User created successfully', token: jwtToken })
})

app.post('/users/login', async (req, res) => {
  // logic to log in user

  const { username, password } = req.headers

  if (!username || !password) {
    return res.status(400).send('Username and password are required')
  }

  const user = await User.findOne({ username })

  if (user) {
    const jwtToken = generateToken(user)
    return res
      .status(200)
      .json({ message: 'Logged in successfully', token: jwtToken })
  } else {
    return res.status(400).json({ message: 'Invalid username or password' })
  }
})

app.get('/users/courses', verifyJwt, async (req, res) => {
  // logic to list all courses

  const publishedCourses = await Course.find({ published: true })

  res.status(200).json({ courses: publishedCourses })
})

app.post('/users/courses/:courseId', verifyJwt, async (req, res) => {
  // logic to purchase a course

  try {
    const course = await Course.findOne({ _id: req.params.courseId })

    if (course) {
      const user = await User.findOne({ username: req.user.username })

      if (user) {
        user.purchasedCourses.push(course)
        await user.save()
      } else {
        return res.status(400).json({ message: 'Invalid username' })
      }

      res.status(200).json({
        message: 'Course purchased successfully',
      })
    } else {
      return res.status(400).json({ message: 'Invalid course id' })
    }
  } catch (error) {
    return res.status(400).json({ message: 'Invalid course id' })
  }
})

app.get('/users/purchasedCourses', verifyJwt, async (req, res) => {
  // logic to view purchased courses

  const user = await User.findOne({ username: req.user.username })

  res.status(200).json({
    courses: user.purchasedCourses,
  })
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
