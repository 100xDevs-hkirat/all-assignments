const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
  const {username, password} = req.headers;

  const validAdmin = ADMINS.find(a => a.username === username && a.password === password);
  if(validAdmin) {
    next();
  } else {
    res.status(403).json({message: 'Admin authentication failed'});
  }

}

const userAuthentication = (req, res, next) => {
  const {username, password} = req.headers;

  const validUser = USERS.find(u => u.username === username && u.password === password);
  if(validUser) {
    req.user = validUser; // add user object to the request. 
    next();
  } else {
    res.status(403).json({message: 'User authentication failed'});
  }

}

// Admin routes
app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  const adminAlreadyExists = ADMINS.find(a => a.username === admin.username); 

  if(adminAlreadyExists) {
    res.status(403).json({message: 'Admin already exists'});
  } else {
    ADMINS.push(admin);
    res.status(200).json({message: 'Admin created successfully'});
  }

});

app.post('/admin/login', adminAuthentication, (req, res) => {
  res.status(200).json({message: 'Admin Logged in successfully'});
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  const course = req.body;
  course.id = Math.floor(Math.random() * 100) + 1;

  COURSES.push(course);
  res.status(200).json({message: 'Course created successfully,', courseId: course.id});
  
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if(course) {
    Object.assign(course, req.body);
    res.status(200).json({message: 'Course updated successfully'})
  } else {
    res.status(403).json({message: 'courseId does not exists'});
  }
});

app.get('/admin/courses', adminAuthentication, (req, res) => {
  res.json({courses: COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    purchasedCourses: []
  }
  const userAlreadyExists = USERS.find(u => u.username === user.username); 

  if(userAlreadyExists) {
    res.status(403).json({message: 'User already exists'});
  } else {
    USERS.push(user);
    res.status(200).json({message: 'User created successfully'});
  }
});

app.post('/users/login', userAuthentication, (req, res) => {
  res.status(200).json({message: 'User Logged in successfully'});
});

app.get('/users/courses', userAuthentication, (req, res) => {
  let filteredCourses = [];
  for(let i = 0; i < COURSES.length; i += 1) {
    if(COURSES[i].published) {
      filteredCourses.push(COURSES[i]);
    }
  }
  res.json({courses: filteredCourses});
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  let courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId && c.published);
  if(course) {
    req.user.purchasedCourses.push(courseId);
    res.status(200).json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  var purchasedCourseIds = req.user.purchasedCourses;
  var purchasedCourses = [];
  for(let i = 0; i < COURSES.length; i += 1) {
    if(purchasedCourseIds.indexOf(COURSES[i].id) != -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }
  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});