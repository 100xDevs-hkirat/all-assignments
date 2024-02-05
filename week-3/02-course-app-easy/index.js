const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let userPurchases = [];

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var details = req.body;
  var flag = false;

  for(let i=0;i<ADMINS.length;i++){
    if(details.username == ADMINS[i].username && details.password == ADMINS[i].password){
      flag = true;
      break;
    }
  }

  if(flag){
    res.status(404).json('Admin already exists');
  }

  else{
    ADMINS.push(details);
    res.status(200).json('Admin created successfully')
  }
  
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  var usernameCheck = req.headers.username;
  var passwordCheck = req.headers.password;
  var flag = false;

  for(let i=0;i<ADMINS.length;i++){
    if(usernameCheck == ADMINS[i].username && passwordCheck == ADMINS[i].password){
      flag = true;
      break;
    }
  }

  if(flag){
    res.status(200).json('Logged in successfully');
  }

  else{
    res.status(404).json('Login Failed!');
  }

});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  var courseDetails = req.body;
  courseDetails.id = Date.now;

  COURSES.push(courseDetails);
  res.status(200).json('Course created successfully');
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  var cid = req.params.courseId;
  var updatedDetails = req.body;

  for(let i=0;i<COURSES.length;i++){
    if(COURSES[i].id == cid){
      COURSES[i] = updatedDetails;
      break;
    }
  }

  res.status(200).json('Course updated successfully');
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  res.status(200).json(COURSES);
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  var userDetails = req.body;
  var flag = false;

  for(let i=0;i<USERS.length;i++){
    if(USERS[i].username == userDetails.username && USERS[i].password == userDetails.password){
      flag = true;
      break;
    }
  }

  if(flag){
    res.status(404).json('User already exists');
  }

  else{
    res.status(200).json('User created successfully');
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  var usernameCheck = req.headers.username;
  var passwordCheck = req.headers.password;
  
  var flag = false;

  for(let i=0;i<USERS.length;i++){
    if(USERS[i].username == usernameCheck && USERS[i].password == passwordCheck){
      flag = true;
      break;
    }
  }

  if(!flag){
    res.status(404).json('Login Failed!');
  }

  else{
    res.status(200).json('Logged in successfully');
  }
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  res.status(200).json(COURSES);
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  var idOfCourse = req.params.courseId;

  for(let i=0;i<COURSES.length;i++){
    if(COURSES[i].id == idOfCourse){
      userPurchases.push(COURSES[i]);
      break;
    }
  }

  res.status(200).json('Course purchased successfully');
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  res.status(200).json(userPurchases);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
