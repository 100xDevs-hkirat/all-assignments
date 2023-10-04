const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const userAuthentication = (req,res,next) => {
  const {username, password} = req.headers;

  const user = USERS.find(e=> e.username === username && e.password === password);
    if(user) {
      req.user = user;
      next();
    } else {
        return res.status(403).json({message: "User authentication failed"});
    }
}

const adminAuthentication = (req,res,next) => {
    const {username, password} = req.headers;
    
    const exists = ADMINS.find(e=> e.username === username && e.password === password);
    if(exists) {
        next();
    } else {
        return res.status(403).json({message: "Admin authentication failed"});
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
  const user = {...req.body, purchasedCourses: []};

  const exists = USERS.find(e => e.username === username);
  if (exists) {
    res.status(403).json({message: "User already exists"});
  } else {
    USERS.push(user);
    res.json({message: "User added successfully"});
  }
});

app.post('/users/login', userAuthentication, (req, res) => {
  res.json({message: "User logged In successfully"})
});

app.get('/users/courses', userAuthentication, (req, res) => {
  res.json({courses: COURSES.filter(e => e.published)});
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);

  const course = COURSES.find(e => e.courseId === courseId && e.published);
  if(course) {
    req.user.purchasedCourses.push(courseId);
    res.json({message: "Course purchase successful"});
  } else {
    res.status(404).json({message: "Course not found or not available"});
  }
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  const purchasedCourses = COURSES.filter(c => req.user.purchasedCourses.includes(c.courseId));

  res.json({courses: purchasedCourses});
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
