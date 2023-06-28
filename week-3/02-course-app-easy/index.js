const express = require('express');
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(express.json());

let PURCHASED = []
let ADMINS = [{
  username: "geeky",
  password: 1234
}];
let USERS = [];
let COURSES = [{
  title: 'Mein Kampf',
  description: 'Heil',
  price: 333,
  imageLink: 'bals',
  published: true
},
{
  title: 'Gita',
  description: 'Ram',
  price: 33222,
  imageLink: 'Om',
  published: true
}];

// Admin routes
app.post('/admin/signup', (req, res) => {
  for (let i = 0; i < ADMINS.length; i++) {
    if(req.body.username == ADMINS[i].username ){
      res.status(404).send("already exists");
      return;
    }
  }
  let signupDetails = {
    username: req.body.username,
    password: req.body.password
  }
  ADMINS.push(signupDetails)
  res.status(200).send("Admin created successfully")
  
});

app.post('/admin/login', (req, res) => {
  let adminExists
  for (let i = 0; i < ADMINS.length; i++) {
    if(req.headers.username == ADMINS[i].username && req.headers.password == ADMINS[i].password){
      adminExists = true;
      break
    }
  }
  if(adminExists){
    res.status(200).send("Logged in Successfully")
  }
  else  
    res.status(404).send("Unauthorized Login!")
});

app.post('/admin/courses', (req, res) => {
  let adminExists
  for (let i = 0; i < ADMINS.length; i++) {
    if(req.headers.username == ADMINS[i].username && req.headers.password == ADMINS[i].password){
      adminExists = true;
      break
    }
  }
  if(adminExists){
    let courseData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imageLink: req.body.image,
      published: true
    }
    COURSES.push(courseData)
    res.status(200).send("Course Created Successfully")
    console.log(COURSES)
  }
  else  
    res.status(404).send("Unauthorized Login!")
});

app.put('/admin/courses/:courseId', (req, res) => {
  let adminExists
  let id = req.params.courseId;
  for (let i = 0; i < ADMINS.length; i++) {
    if(req.headers.username == ADMINS[i].username && req.headers.password == ADMINS[i].password){
      adminExists = true;
      break
    }
  }
  if(adminExists){
    COURSES[id].title = req.body.title,
    COURSES[id].description = req.body.description,
    COURSES[id].price = req.body.price,
    COURSES[id].imageLink = req.body.image,
    COURSES[id].published = req.body.published
    res.status(200).send("Course Edited Successfully")
    console.log(COURSES)
  }
  else  
    res.status(404).send("Unauthorized Login!")
});

app.get('/admin/courses', (req, res) => {
  let adminExists
  for (let i = 0; i < ADMINS.length; i++) {
    if(req.headers.username == ADMINS[i].username && req.headers.password == ADMINS[i].password){
      adminExists = true;
      break
    }
  }
  if(adminExists){
    res.status(200).send(COURSES)
  }
  else  
    res.status(404).send("Unauthorized Login!")
});

// User routes
app.post('/users/signup', (req, res) => {
  for (let i = 0; i < USERS.length; i++) {
    if(req.body.username == USERS[i].username)
      res.status(404).send("user already exists")
  }
  let userData = {
    username: req.body.username,
    password: req.body.password
  }
  USERS.push(userData)
  res.status(200).send("User created successfully")
});

app.post('/users/login', (req, res) => {
  let userExists
  for (let i = 0; i < USERS.length; i++) {
    if(req.headers.username == USERS[i].username && req.headers.password == USERS[i].password){
      userExists = true;
      break
    }
  }
  if(userExists){
    res.status(200).send("Logged in Successfully")
  }
  else  
    res.status(404).send("Unauthorized Login!")
});

app.get('/users/courses', (req, res) => {
  let userExists
  for (let i = 0; i < USERS.length; i++) {
    if(req.headers.username == USERS[i].username && req.headers.password == USERS[i].password){
      userExists = true;
      break
    }
  }
  if(userExists){
    res.status(200).send(COURSES)
  }
  else  
    res.status(404).send("Unauthorized Login!")
});

app.post('/users/courses/:courseId', (req, res) => {
  let userExists
  let id = req.params.courseId
  for (let i = 0; i < USERS.length; i++) {
    if(req.headers.username == USERS[i].username && req.headers.password == USERS[i].password){
      userExists = true;
      break
    }
  }
  if(userExists){
    let courseInfo = {
      ...COURSES[id],
      purchasedBy: req.headers.username
    };
    PURCHASED.push(courseInfo)
    console.log(PURCHASED)
    res.status(200).send("COURSE purchased successfully!")
  }
  else  
    res.status(404).send("Unauthorized Login!")
});


app.get('/users/purchasedCourses', (req, res) => {
  let userExists
  let id = req.params.courseId
  for (let i = 0; i < USERS.length; i++) {
    if(req.headers.username == USERS[i].username && req.headers.password == USERS[i].password){
      userExists = true;
      break
    }
  }
  if(userExists){
    const purchasedCourses = PURCHASED.filter(course => course.purchasedBy === req.headers.username)
    res.status(200).send(purchasedCourses)
  }
  else  
    res.status(404).send("Unauthorized Login!")
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
