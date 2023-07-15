const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
console.log(ADMINS);
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if(admin){
    next();
  }else{
    res.status(403).send("Admin Authentication failed");
  }
}

const userAuthentication = (req, res, next) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const user = USERS.find(a => a.username === username && a.password === password);
  if(user){
    next();
  }else{
    res.status(403).send("User Authentication failed");
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = ADMINS.find(a => a.username === req.body.username);
  if(admin){
    res.status(403).json({ message: 'Admin already exists' });
  }else{
    ADMINS.push(req.body);
    res.json({message:"Admin created successfully"})
  }
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({message:"Logged in successfully"})
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = Date.now();
  COURSES.push(course);
  res.json({message:"Course created successfully", courseId: course.id});
  
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(a => a.id === courseId);
  if(course){
    Object.assign(course, req.body);
    res.json({messege: "Course updated successfully"});
  }else{
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', adminAuthentication, (req, res) => {
  // logic to get all courses
  res.json({courses: COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = USERS.find(a => a.username === req.body.username);
  if(user){
    res.status(403).json({ message: 'Admin already exists' });
  }else{
    USERS.push(req.headers);
    res.json({message:"Admin created successfully"})
  }
});

app.post('/users/login', userAuthentication, (req, res) => {
  // logic to log in user
  res.json({message:"Logged in successfully"})
});

app.get('/users/courses', userAuthentication, (req, res) => {
  // logic to list all courses
  const filteredCourses = [];
  for(var i = 0;i <COURSES.length;i++){
    if(COURSES[i].published){
      filteredCourses.push(COURSES[i]);
    }
  }
  res.json({courses: filteredCourses});

});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  // logic to purchase a course
  const courseId = Number(req.params.courseId);
  const course = COURSES.find(a => a.id === courseId && a.published);
  if(course){
    req.user.purchasedCourses.push(courseId);
    res.json({ message: 'Course purchased successfully' });
  }else{
    res.status(401).send({messege: 'Course not found or not available'});
  }
});

app.get('/users/purchasedCourses',userAuthentication, (req, res) => {
  // logic to view purchased courses
  var purchasedCourseIds = req.user.purchasedCourses; [1, 4];
  var purchasedCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (purchasedCourseIds.indexOf(COURSES[i].id) !== -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }

  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
