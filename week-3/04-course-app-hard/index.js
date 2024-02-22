const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();

const SECRETKEY = "abcdef";

async function main() {
  await mongoose.connect("mongodb+srv://InfernoStinger:wP3Gv5zpfLRmEJjQ@cluster0.30b2oeh.mongodb.net/");
  console.log("We have connected to the server");
}
main();

// Define the schemas

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imgaeLink: String,
  published: Boolean
});

// Define the models

const Admin = mongoose.model('Admin', adminSchema);
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);

app.use(express.json());

const authenticateJWT = (req, res, next) => {
  const header = req.headers.authorization;
  if (header !== undefined) {
    const token = header.split(' ')[1];
    jwt.verify(token, SECRETKEY, (err, data) => {
      if (err) {
        res.send("Could not complete authentication");
      } else {
        req.user = data;
        next();
      }
    })
  } else {
    res.send("Invalid authorization headers");
  }
}

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  var body = req.body;
  var username = body.username;
  var password = body.password;
  var admin = await Admin.findOne({ username });
  if (admin) {
    res.send(403).json({ message: "Admin already exits" });
  } else {
    const obj = {
      username: username,
      password: password
    };
    const newObj = new Admin(obj);
    await newObj.save();
    var token = jwt.sign({ username: username, password: password }, SECRETKEY, { expiresIn: '1hr' });
    res.json({ message: "Admin created successfully", token });
  }
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  var { username, password } = req.headers;
  var admin = await Admin.findOne({ username, password });
  if (admin) {
    var token = jwt.sign({ username: username, role: 'admin' }, SECRETKEY, { expiresIn: '1hr' });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.send("Unsuccessful log in attempt");
  }
});

app.post('/admin/courses', authenticateJWT, async (req, res) => {
  // logic to create a course
  var body = req.body;
  var course = await Course.findOne(body);
  if (course) {
    res.send("This course already exists");
  } else {
    var obj = body;
    var newObj = new Course(obj);
    await newObj.save();
    res.json({ message: "Course created successfully", courseId: newObj.id });
  }
});

app.put('/admin/courses/:courseId', authenticateJWT, async (req, res) => {
  // logic to edit a course
  var course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
  if (course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authenticateJWT, async (req, res) => {
  // logic to get all courses
  var courses = await Course.find({ published: true });
  res.send({ courses });
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  var body = req.body;
  var username = body.username;
  var password = body.password;
  var user = await User.findOne({ username, password });
  if (user) {
    res.send("Username and password already exist");
  } else {
    var obj = { username, password };
    var newObj = new User(obj);
    await newObj.save();
    var token = jwt.sign({ username, password }, SECRETKEY, { expiresIn: '1hr' });
    res.json({ message: "User Created successfully", token });
  }
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  var { username, password } = req.headers;
  var user = await User.findOne({ username, password });
  if (user !== undefined) {
    var token = jwt.sign({ username, password }, SECRETKEY, { expiresIn: '1hr' });
    res.json({ message: "User logged in successfully", token });
  } else {
    res.send("Unsuccessful login attempt");
  }
});

app.get('/users/courses', authenticateJWT, async (req, res) => {
  // logic to list all courses
  var courses = await Course.find({ published: true });
  res.json(courses);
});

app.post('/users/courses/:courseId', authenticateJWT, async (req, res) => {
  // logic to purchase a course
  var course = await Course.findById(req.params.courseId);
  if (course !== undefined) {
    var user = await User.findOne({ username: req.user.username });
    if (user) {
      console.log(user);
      user.purchasedCourses.push(course._id);
      await user.save();
      console.log(user);
      res.send({ message: "Course purchased successfully" });
    } else {
      res.send("User not found");
    }
  } else {
    res.send("Course not found");
  }
});

app.get('/users/purchasedCourses', authenticateJWT, async (req, res) => {
  // logic to view purchased courses
  var user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
  if (user) {
    console.log(user);
    res.send({ courses: user.purchasedCourses || [] });
  } else {
    res.send("User not found")
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
