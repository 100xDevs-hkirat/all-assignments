const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

let PURCHASED = [];
let id = 0;
let jwtSecretKey = String(Math.floor(Math.random() * 10000000));

function adminAuthentication(req, res, next){
  username = req.headers.username;
  password = req.headers.password;

  let found = ADMINS.find((ele)=>{
    return (ele["username"]===username && ele["password"]===password)
  })

  if(found){
    next();
  } else{
    res.status(401).json({ "message": 'Wrong username or password!' })
  }
}

function tokenAuthentication(req, res, next){
  let token = req.headers.authorization;
  token = token.replace("Bearer ", "");
  const verified = jwt.verify(token, jwtSecretKey);

  if(verified){
    next();
  } else{
    res.status(401).json({ "message": 'You have been logged-out! Please login again.' })
  }
}

function userAuthentication(req, res, next){
  username = req.headers.username;
  password = req.headers.password;

  let found = USERS.find((ele)=>{
    return (ele["username"]===username && ele["password"]===password)
  })

  if(found){
    next();
  } else{
    res.status(401).json({ "message": 'Wrong username or password!' })
  }
}


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let adminDetails = {
    username : req.body.username,
    password : req.body.password
  }
  const token = jwt.sign(adminDetails, jwtSecretKey);

  ADMINS.push(adminDetails);
  res.json({ 
    message: 'Admin created successfully', 
    token: token
  });
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  let adminDetails = {
    username : req.headers.username,
    password : req.headers.password
  }

  // let jwtSecretKey = "ahgdshjav";
  const token = jwt.sign(adminDetails, jwtSecretKey);

  res.json({ 
    message: 'Admin created successfully', 
    token: token
  });
});

app.post('/admin/courses', tokenAuthentication, (req, res) => {
  // logic to create a course
  id += 1;
  COURSES.push({
    title : req.body.title,
    description : req.body.description,
    price : req.body.price,
    imageLink : req.body.imageLink,
    published : req.body.published,
    id:id
  })

  res.json({ message: 'Course created successfully', courseId: id})
});

app.put('/admin/courses/:courseId', tokenAuthentication, (req, res) => {
  // logic to edit a course
  let idNo = req.params.courseId;
  let found = COURSES.find((ele)=>{
    return (ele["id"] == idNo); // used '==' here instead of '===' as the typeof 'idNo' is string and 'id' is int
  })

  // console.log("found: ", found)
  if (found){
    Object.assign(found, req.body);
    // console.log("COURSES: ", COURSES)
    res.json({ message: 'Course updated successfully' });
  } else{
    // console.log("COURSES: ", COURSES)
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', tokenAuthentication, (req, res) => {
  // logic to get all courses
  res.json(COURSES);
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  let userDetails = {
    username : req.body.username,
    password : req.body.password
  }
  const token = jwt.sign(userDetails, jwtSecretKey);

  USERS.push(userDetails);
  res.json({ 
    message: 'User created successfully', 
    token: token
  });
});

app.post('/users/login', userAuthentication, (req, res) => {
  // logic to log in user
  let userDetails = {
    username : req.headers.username,
    password : req.headers.password
  }

  // let jwtSecretKey = "ahgdshjav";
  const token = jwt.sign(userDetails, jwtSecretKey);

  res.json({ 
    "message": 'Logged in successfully',
    "token": token
   })
});

app.get('/users/courses', tokenAuthentication, (req, res) => {
  // logic to list all courses
  res.json(COURSES);
});

app.post('/users/courses/:courseId', tokenAuthentication, (req, res) => {
  // logic to purchase a course
  let idNo = req.params.courseId;
  let found = COURSES.find((ele)=>{
    return (ele["id"] == idNo); // used '==' here instead of '===' as the typeof 'idNo' is string and 'id' is int
  })

  if (found){
    PURCHASED.push(found);
    res.json({ message: 'Course purchased successfully' });
  } else{
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', tokenAuthentication, (req, res) => {
  // logic to view purchased courses
  res.json(PURCHASED);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
