require('dotenv').config()
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
const purchasedCourses = new Map();

// Admin routes
app.post('/admin/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  ADMINS.push({username,password});
  res.send('Admin created successfully');
});

app.post('/admin/login', (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  
  if(ADMINS.some((admin) => admin.username === username && admin.password === password)){
    const accessToken = generateAccessToken({username});
    res.json({ message: 'Logged in successfully', token: accessToken });
  }else{
    res.status(401).send("Invalid credentials");
  }
});

app.post('/admin/courses', validateAuthToken, (req, res) => {
  const { title, description,  price, imageLink, published } = req.body;
  const id = crypto.randomUUID();
  COURSES.push({ id, title, description,  price, imageLink, published });
  res.json({ message: 'Course created successfully', courseId: id });
});

app.put('/admin/courses/:courseId', validateAuthToken, (req, res) => {
  const courseId = req.params.courseId;
  const { title, description,  price, imageLink, published } = req.body;
  let course = COURSES.find(course => course.id === courseId);
  
  if(course === undefined){
    res.status(404).send('Invalid course id');
    return;
  }

  Object.assign(course, { title, description,  price, imageLink, published });
  res.send('Course updated successfully');
});

app.get('/admin/courses', validateAuthToken, (req, res) => {
  res.json({courses:COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  USERS.push({username,password});
  res.send('User created successfully');
});

app.post('/users/login', (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  
  if(USERS.some((user) => user.username === username && user.password === password)){
    const accessToken = generateAccessToken({username});
    res.json({ message: 'Logged in successfully', token: accessToken });
  }else{
    res.status(401).send("Invalid credentials");
  }
});

app.get('/users/courses', validateAuthToken, (req, res) => {
  res.json({courses:COURSES});
});

app.post('/users/courses/:courseId', validateAuthToken, (req, res) => {
  const courseId = req.params.courseId;
  const username = req.username;
  if(!purchasedCourses.has(username)){
    purchasedCourses.set(username,[]);
  }
  const course = COURSES.find(course => course.id === courseId);
  purchasedCourses.get(username).push(course);
  res.json({ message: 'Course purchased successfully' })
});

app.get('/users/purchasedCourses', validateAuthToken, (req, res) => {
  const username = req.username;
  res.json({purchasedCourses : purchasedCourses.get(username)});
});

function validateAuthToken(req, res, next){
  const authHeader = req.headers.authorization;
  const authToken = authHeader && authHeader.split(' ')[1];
  console.log(`authToken is ${authToken}`)
  if(authToken === null) return res.status(401).send("Invalid user");

  jwt.verify(authToken, process.env.ACCESS_SECRET_TOKEN, (err, username) => {
    if(err) return res.send('Invalid Token').status(403);
    req.username = username;
    next();
  })
}

function generateAccessToken(payload){
  return jwt.sign(payload,process.env.ACCESS_SECRET_TOKEN, {expiresIn: '30s'});
}

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
