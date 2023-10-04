const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req,res,next) => {
    const {username, password} = req.headers;
    
    const exists = ADMINS.find(e=> e.username === username && e.password === password);
    if(exists) {
        next();
    } else {
        return res.status(403).json({message: "User authentication failed"});
    }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  
  const exists = ADMINS.find(e => e.username === admin.username);
  if (exists) {
    res.status(403).json({message: "Admin already exists"});
  } else {
    ADMINS.push(admin);
    res.json({message: "Admin created successfully"});
  }
});

app.post('/admin/login', (req, res) => {
  res.json({message: "Logged In successfully"});
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
    const course = Object.assign(req.body, { courseId: COURSES.length + 1});

    const exists  = COURSES.find(e => e.title === course.title);
    if (exists) {
        res.status(403).json({message: "Course title already exists"});
    } else {
        COURSES.push(course);
        res.json({message: "Course created successfully", courseId: course.courseId})
    }
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);

  const courses = COURSES.find(e => e.courseId === courseId);
  if(courses) {
    Object.assign(courses,req.body);
    res.json({message: "Course updated successfully"})
  } else {
    res.status(404).json({message: "Course not found"});
  }
});

app.get('/admin/courses', adminAuthentication, (req, res) => {
  res.json(COURSES);
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
