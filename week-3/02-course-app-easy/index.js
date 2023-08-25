const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function adminAuthentication(req, res, next) {
  const {username, password} = req.headers;
  const adminExist = ADMINS.find(a => a.username===username && a.password===password)
  if(adminExist) {
    next();
  } else {
    res.status(403).json({message: "Admin authentication failed "})
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find((a) => a.username === admin.username)
  if(existingAdmin) {
    res.status(403).json({message : 'Admin already exists'})
  } else {
    ADMINS.push(admin)
    res.json({message : 'Admin created successfully'})
  }

});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({ message: 'Logged in successfully' })
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
  const course = req.body
  const title = COURSES.find(c => c.title === course.title)
  if(title) {
    res.status(409).json({message: "Course already exist"})
  } else {
    course.id = Date.now()
    COURSES.push(course)
    res.json({message: 'Course created successfully', courseId: course.id})
  }
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId)
  const courseExist = COURSES.find(c => c.id===courseId)
  if(courseExist) {
    Object.assign(courseExist, req.body)
    res.json({message: 'Course updated successfully'})
  } else {
    res.status(404).json({ message: 'Course not found' });
  }

});

app.get('/admin/courses', adminAuthentication, (req, res) => {
  // logic to get all courses
  res.json({courses : COURSES})
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

app.listen(3004, () => {
  console.log('Server is listening on port 3004');
});
