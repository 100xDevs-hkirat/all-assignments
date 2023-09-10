const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(express.json());

let AdminSchema = new mongoose.Schema({
  username: {
    type:String,
  },
  password: {
    type: Number
  }
});

let UsersSchema = new mongoose.Schema({
  username: {
    type:String,
  },
  password: {
    type: Number
  },
  coursesPurchased: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses'
  }
});
let CoursesSchema = new mongoose.Schema({
  courseId: Number,
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UsersSchema);
const Courses = mongoose.model('Courses', CoursesSchema);

const adminAuth = (req,res,next) => {
  const username = req.body.username;
  const pass = req.body.pass;
  const admin = Admin.findOne({'username': username, 'password':pass});
  if(admin) {
    res.json({message: "Admin Authenticated Successfully"});
  } else {
    res.json({message: "Admin Failed Authenticatino"});
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const username = req.body.username;
  const pass = req.body.pass;
  const admin = new Admin({
    username: username,
    password: pass
  });
  admin.save();
});

app.post('/admin/login', adminAuth, (req, res) => {
  // logic to log in admin
  res.json({message: "Logged in successfully"})
});

app.post('/admin/courses', adminAuth, (req, res) => {
  // logic to create a course
  const newCourse = req.body;
  const course = new Courses({
    courseId: Courses.length + 1,
    title:newCourse.title,
    description:newCourse.description,
    price:newCourse.price,
    imageLink:newCourse.imageLink,
    published:newCourse.imageLink
  })
  course.save();
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
