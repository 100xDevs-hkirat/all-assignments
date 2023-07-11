const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

//middleware for authentication of Admin
const adminAuthenticator=(req,res,next)=>{
  let { username, password } = req.headers;

  const adminCheck = ADMINS.find(admin => admin.username === username && admin.password === password);
  if (adminCheck) {
    next();
  } else {
    res.status(403).send({ message: 'Admin authentication failed' });
  }
}
const userAuthenticator=(req,res,next)=>{
  let { username, password } = req.headers;

  const userCheck = USERS.find(user => user.username === username && user.password === password);
  if (userCheck) {
    req.user = userCheck; //will hold reference to the user which got authenticated
    next();
  } else {
    res.status(403).send({ message: 'User authentication failed' });
  }
}
// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const adminCredentials=req.body;
  const checkAdminUsername=ADMINS.find(admin=>admin.username===adminCredentials.username);
  if(checkAdminUsername){
    res.status(403).send({ message: 'Admin already exists' });
  }
  else{
    ADMINS.push(adminCredentials);
    res.send({ message: 'Admin created successfully' });
  }

  
});

app.post('/admin/login',adminAuthenticator, (req, res) => {
  // logic to log in admin
  res.send({ message: 'Logged in successfully' });
});

app.post('/admin/courses',adminAuthenticator, (req, res) => {
  // logic to create a course
  const courseDetails = req.body;
  if(courseDetails.title && courseDetails.description && courseDetails.price && courseDetails.published){

  courseDetails.id = Math.floor(Math.random()*1000000)
  COURSES.push(courseDetails);
  res.send({ message: 'Course created successfully', courseId: courseDetails.id });
  }
  else{
    res.status(400).send({ message: 'No proper details of course. Hence not added' });
  }
});

app.put('/admin/courses/:courseId',adminAuthenticator, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const existingCourse = COURSES.find(course => course.id === courseId);
  if (existingCourse) {
    Object.assign(existingCourse, req.body);
    res.send({ message: 'Course updated successfully' });
  } else {
    res.status(404).send({ message: 'Course not found' });
  }
});

app.get('/admin/courses',adminAuthenticator, (req, res) => {
  // logic to get all courses
  res.send({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const userCredentials=req.body;
  const checkUserExists=USERS.find(user=>user.username===userCredentials.username);
  if(checkUserExists) res.status(403).send({ message: 'User already exists' });
  else{
    const userDetails = {...req.body, purchasedCourses: []};
    USERS.push(userDetails);
    res.send({ message: 'User created successfully' });
  }
});

app.post('/users/login',userAuthenticator, (req, res) => {
  // logic to log in user
  res.send({ message: 'Logged in successfully' });
});

app.get('/users/courses',userAuthenticator, (req, res) => {
  // logic to list all courses
  const filteredCourses=COURSES.filter(course=>course.published);//user can only see the published courses
  res.send({ courses: filteredCourses });
});

app.post('/users/courses/:courseId',userAuthenticator, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId && c.published);
  if(course){
    req.user.purchasedCourses.push(courseId);
    res.send({ message: 'Course purchased successfully' });
  } 
  else 
    res.status(404).send({ message: 'Course not found or not available' });
});

app.get('/users/purchasedCourses',userAuthenticator, (req, res) => {
  // logic to view purchased courses
  res.send({ purchasedCourses:COURSES.filter(c=>req.user.purchasedCourses.includes(c.id))})
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
