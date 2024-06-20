const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
//Step1:- use the mongoose library
const mongoose = require('mongoose')

app.use(express.json())

const secretKey1 = 'secret17'
const secretKey2 = 'secret29'

//Step2:- Define the schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourse: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
})

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
})

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
})

//Step3:- Define the models
const User = mongoose.model('User', userSchema)
const Admin = mongoose.model('Admin', adminSchema)
const Course = mongoose.model('Course', courseSchema)

//Step4:- Connect with the mongodb database using the connection string
mongoose.connect(
  'mongodb+srv://tina:9123053629@cluster0.iz0rmjm.mongodb.net/CourseApp',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

const authenticateAdminJwt = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, secretKey1, (err, user) => {
      if (err) {
        res.status(403).json({ message: 'Unauthorized' })
      } else {
        req.user = user
        next()
      }
    })
  } else {
    res.status(401)
  }
}

const authenticateUserJwt = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, secretKey2, (err, user) => {
      if (err) {
        res.status(403).json({ message: 'Unauthorized' })
      } else {
        req.user = user
        next()
      }
    })
  } else {
    res.status(401)
  }
}

// Admin routes
app.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body
  const admin = await Admin.findOne({ username })
  if (admin) {
    res.status(403).json({ message: 'Admin already exists' })
  } else {
    const newAdmin = new Admin({ username, password })
    await newAdmin.save()
    const token = jwt.sign({ username, role: 'admin' }, secretKey1, {
      expiresIn: '1h',
    })
    res.json({ message: 'Admin created successfully', token: token })
  }
})

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body
  const admin = await Admin.findOne({ username, password })
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, secretKey1, {
      expiresIn: '1h',
    })
    res.json({ message: 'Admin logged in successfully', token: token })
  } else {
    res.status(403).json({ message: 'Invalid Username or password' })
  }
})

app.post('/admin/courses', authenticateAdminJwt, async (req, res) => {
  const course = new Course(req.body)
  await course.save()
  res.json({ message: 'Course created successfully', CourseId: course.id })
})

app.put('/admin/courses/:courseId', authenticateAdminJwt, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
  })
  if (course) {
    res.json({ message: 'Course updated successfull', Course: course })
  } else {
    res.status(404).json({ message: 'Course not found' })
  }
})

app.get('/admin/courses', authenticateAdminJwt, async (req, res) => {
  const courses = await Course.find()
  res.json({ Courses: courses })
})

// User routes
app.post('/users/signup', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (user) {
    res.status(403).json({ message: 'User already exists' })
  } else {
    const newUser = new User({ username, password })
    await newUser.save()
    const token = jwt.sign({ username, role: 'user' }, secretKey2, {
      expiresIn: '1h',
    })
    res.json({ message: 'User created successfully', token: token })
  }
})

app.post('/users/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username, password })
  if (user) {
    const token = jwt.sign({ username, role: 'user' }, secretKey2, {
      expiresIn: '1h',
    })
    res.json({ message: 'User logged in successfully', token: token })
  } else {
    res.status(403).json({ message: 'Invalid Username or password' })
  }
})

app.get('/users/courses', authenticateUserJwt, async (req, res) => {
  const courses = await Course.find({ published: true })
  res.json({ Courses: courses })
})

app.post('/users/courses/:courseId', authenticateUserJwt, async (req, res) => {
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

app.get('/users/purchasedCourses', authenticateUserJwt, async (req, res) => {
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

app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
