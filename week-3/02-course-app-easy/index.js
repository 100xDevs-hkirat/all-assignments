const express = require('express');
const crypto = require("crypto"); //built in library in nodejs
const app = express();

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
    res.send('Logged in successfully')
  }else{
    res.status(401).send("Invalid credentials");
  }
});

app.post('/admin/courses', (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  if(ADMINS.some((admin) => admin.username === username && admin.password === password)){
    const { title, description,  price, imageLink, published } = req.body;
    const id = crypto.randomUUID();
    COURSES.push({ id, title, description,  price, imageLink, published });
    res.json({ message: 'Course created successfully', courseId: id });
  }else{
    res.status(401).send("Invalid credentials");
  }
});

app.put('/admin/courses/:courseId', (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  if(ADMINS.some((admin) => admin.username === username && admin.password === password)){
    const courseId = req.params.courseId;
    const { title, description,  price, imageLink, published } = req.body;
    let course = COURSES.find(course => course.id === courseId);
    
    if(course === undefined){
      res.status(404).send('Invalid course id');
      return;
    }

    Object.assign(course, { title, description,  price, imageLink, published });
    res.send('Course updated successfully');
  }else{
    res.status(401).send("Invalid credentials");
  }
});

app.get('/admin/courses', (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  
  if(ADMINS.some((admin) => admin.username === username && admin.password === password)){
    res.json({courses:COURSES});
  }else{
    res.status(401).send("Invalid credentials");
  }
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
    res.send('Logged in successfully')
  }else{
    res.status(401).send("Invalid credentials");
  }
});

app.get('/users/courses', (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  
  if(USERS.some((user) => user.username === username && user.password === password)){
    res.json({courses:COURSES});
  }else{
    res.status(401).send("Invalid credentials");
  }
});

app.post('/users/courses/:courseId', (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  if(USERS.some((user) => user.username === username && user.password === password)){
    const courseId = req.params.courseId;
    if(!purchasedCourses.has(username)){
      purchasedCourses.set(username,[]);
    }
    const course = COURSES.find(course => course.id === courseId);
    purchasedCourses.get(username).push(course);
    res.send('Course purchased successfully')
  }else{
    res.status(401).send("Invalid credentials");
  }
});

app.get('/users/purchasedCourses', (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  if(USERS.some((user) => user.username === username && user.password === password)){
    res.json({purchasedCourses : purchasedCourses.get(username)});
  }else{
    res.status(401).send("Invalid credentials");
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
