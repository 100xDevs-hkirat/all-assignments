const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');

app.use(express.json());
// Middleware to parse JSON in the request body
app.use(bodyParser.json());
app.use(cors());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function check(admin, pass){
  for(let i=0;i<ADMINS.length;i++){
    if(ADMINS[i].username==admin&&ADMINS[i].password==pass){
      return false;
    }
  }
  return true;
}
//for user
function checkUser(user,pass){
  for(let i=0;i<USERS.length;i++){
    if(USERS[i].username==user&&USERS[i].password==pass){
      return false;
    }
  }
  return true;
}
function findIndex(arr, id){
  for(let i=0;i<arr.length;i++){
    if(arr[i].id==id)return id;
  }
  return -1;
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  if(check(req.body.username, req.body.password)){
    const newAdmin = {
      username: req.body.username,
      password: req.body.password
    }
    ASMINS.push(newAdmin);
    res.send("Admin created successfully");
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  //read username and password from headers
  const username=headers['username'];
  const password=headers['password'];
  if(!check(username,password)){
    res.status(200).send("Logged in successfully");
  }else{
    res.status(401).send("Invalid Credentials")
  }
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  const username=headers['username'];
  const password=headers['password'];
  if(!check(username,password)){
    const newCourse={
      id: Math.floor(Math.random()*1000000),
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imageLink: req.body.imageLink
    }
    COURSES.push(newCourse);
    res.status(200).send("Course created successfully");
  }
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const username=headers['username'];
  const password=headers['password'];
  if(!check(username,password)){
    const courseIndex=findIndex(COURSE, req.params.id);
    if(courseIndex!=-1){
      COURSES[courseIndex].title=req.body.title;
      COURSES[courseIndex].description=req.body.desription;
      COURSES[courseIndex].price=req.body.price;
      COURSES[courseIndex].imageLink=req.body.imageLink;
      COURSES[courseIndex].published=req.body.published;
      res.status(200).send("Course updated succesfully");
    }
  }
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  const username=headers['username'];
  const password=headers['password'];
  if(!check(username,password)){
    for(let i=0;i<COURSES.length;i++){
      console.log(COURSES[i]);
    }
  }
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const username=req.body.username;
  const password=req.body.password;
  if(checkUser(username, password)){
    const newUser={
      id:Math.floor(Math.random()*10000),
      username:username,
      password:password
    }
    USERS.push(newUser);
    res.status(200).send("User created succesfully");
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const username=req.headers['username'];
  const password=req.headers['password'];
  if(!checkUser(username, password)){
    res.status(200).send("Logged in successfully");
  }
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  const username=headers['username'];
  const password=headers['password'];
  if(!checkUser(username,password)){
    for(let i=0;i<COURSES.length;i++){
      console.log(COURSES[i]);
    }
  }
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const username=headers['username'];
  const password=headers['password'];
  if(!checkUser(username,password)){
    const courseIndex=findIndex(COURSES,parseInt(req.params.courseId));
    if(courseIndex!=-1){
      const newCourse={
        courseId:req.params.courseId,
      }
    }
    res.status(200).send("Course purchesed succesfully");
  }
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  const username=headers['username'];
  const password=headers['password'];
  res.json({courses: COURSES.filter(c=>req.user.purchasedCourses.includes(c.id))});
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
