const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const mongoose = require('mongoose')
app.use(express.json());

const secretKey = "S3CR3T_K3Y"

mongoose.connect('mongodb+srv://joy14082000:joy14082000@cluster0.vyxe3np.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });
// schema defination for users , admin and course

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);





// authorize Jwt token

const authoriozeJwt = (req, res, next) => {
  const authToken = req.headers.authorization
  if (authToken) {
    const token = authToken.split(" ")[1]
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        res.status(403).json({ message: "Authentication error" })
      } else {
        req.user = user
        next();
      }
    })
  } else {
    res.status(401).send("Auth token wrong")
  }
}

// Admin routes
app.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body
  var adminExists = await Admin.findOne({ username })
  if (adminExists) {
    res.status(403).json({ message: "Admin already exists" })
  } else {
    const newAdmin = new Admin({ username, password })
    newAdmin.save()
    const token = jwt.sign({ username, role: 'admin' }, secretKey, { expiresIn: '1h' })
    res.json({ message: "Admin created successfully", token })
  }
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.headers
  var adminExists = await Admin.findOne({ username, password })
  if (!adminExists) {
    res.status(403).json({ message: "Admin does not exists" })
  } else {
    const token = jwt.sign({ username, role: 'admin' }, secretKey, { expiresIn: '1h' })
    res.json({ message: "Logged in successfully", token })
  }
});

app.post('/admin/courses', authoriozeJwt, async (req, res) => {
  const course = new Course(req.body)
  await course.save()
  res.json({ message: "Course created successfully", courseId: course.id })
});

app.put('/admin/courses/:courseId', authoriozeJwt, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true })
  if (course) {
    res.json({ message: "Course updated successfully" })
  } else {
    res.send(404).json({ message: "Course not found" })
  }
});

app.get('/admin/courses', authoriozeJwt, async (req, res) => {
  const courses = await Course.find({});
  res.json({ courses })
});

// User routes
app.post('/users/signup', async (req, res) => {
  const { username, password } = req.body
  var userExists = await User.findOne({ username })
  if (userExists) {
    res.status(403).json({ message: "User already exists" })
  } else {
    const newUser = new User({ username, password })
    newUser.save()
    const token = jwt.sign({ username, role: 'user' }, secretKey, { expiresIn: '1h' })
    res.json({ message: "User created successfully", token })
  }
});

app.post('/users/login', async (req, res) => {
  const { username, password } = req.headers
  var userExists = await User.findOne({ username, password })
  if (!userExists) {
    res.status(403).json({ message: "User does not exists" })
  } else {
    const token = jwt.sign({ username, role: 'user' }, secretKey, { expiresIn: '1h' })
    res.json({ message: "Logged in successfully", token })
  }
});

app.get('/users/courses', authoriozeJwt, async (req, res) => {
  const courses = await Course.find({ published: true })
  res.json({ courses })
});

app.post('/users/courses/:courseId', authoriozeJwt, async (req, res) => {
  const course = await Course.findById(req.params.courseId)
  if (course) {
    const user = await User.findOne({ username: req.user.username })
    console.log(req.user)
    if (user) {
      user.purchasedCourses.push(course)
      await user.save()
      res.json({ message: "Course purchased successfully" })
    } else {
      res.status(401).json({ message: "User not found" })
    }
  } else {
    res.status(404).json({ message: "Course not found" })
  }

});

app.get('/users/purchasedCourses', authoriozeJwt, async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses')
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses })
  } else {
    res.status(401).json({ message: "User not found" })
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});