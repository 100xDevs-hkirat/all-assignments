const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let Id = 1;

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const username = req.body.username;
  const password = req.body.password;
  ADMINS.push({
    username : username,
    password : password
  })
  res.send("Admin created successfully");
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const username = req.headers.username;
  const password = req.headers.password;
  let userExists = false;

  for (let i = 0; i < ADMINS.length; i++) {
    if(ADMINS[i].username === username && ADMINS[i].password === password){
      userExists = true;
    }
  }

  if(userExists) {
    res.send("Logged in successfully");
  } else {
    res.status(400).send("User do not exist signup first");
  }
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  const username = req.headers.username;
  const password = req.headers.password;
  const course = req.body;
  let userExists = false;

  for (let i = 0; i < ADMINS.length; i++) {
    if(ADMINS[i].username === username && ADMINS[i].password === password){
      userExists = true;
    }
  }

  if(userExists) {
    COURSES.push({
      courseId : Id,
      title : course.title,
      description : course.description,
      price : course.price,
      imageLink : course.imageLink,
      published : course.published
    });
    res.send({
      message : "Course created successfully",
      courseId : Id++
    })
  } else {
    res.status(400).send("Your are not a admin");
  }
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const courseId = req.params.courseId;
  const username = req.headers.username;
  const password = req.headers.password;
  const course = req.body;
  let userExists = false;
  // let courseExists = false;

  for (let i = 0; i < ADMINS.length; i++) {
    if(ADMINS[i].username === username && ADMINS[i].password === password){
      userExists = true;
    }
  }
  let courseIndex = 0;
  for (let i = 0; i < COURSES.length; i++) {
    if(COURSES[i].courseId === courseId){
      courseIndex = i;
      break;
    }
  }


  if(userExists) {
    COURSES[courseIndex].title = req.body.title;
    COURSES[courseIndex].description = req.body.description;
    COURSES[courseIndex].price = req.body.price;
    COURSES[courseIndex].imageLink = req.body.imageLink;
    COURSES[courseIndex].published = req.body.published;
    res.send({
      message : "Course updated successfully",
    })
  } else {
    res.status(400).send("Your are not a admin");
  }

});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  const username = req.headers.username;
  const password = req.headers.password;
  const course = req.body;
  let userExists = false;

  for (let i = 0; i < ADMINS.length; i++) {
    if(ADMINS[i].username === username && ADMINS[i].password === password){
      userExists = true;
    }
  }

  if(userExists) {
    res.send(COURSES);
  } else {
    res.status(400);
  }

});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = req.body;
  USERS.push({
    username : user.username,
    password : user.password
  });
  res.send("User created successfully");
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const username = req.headers.username;
  const password = req.headers.password;
  let userExists = false;

  for (let i = 0; i < USERS.length; i++) {
    if(USERS[i].password === password && USERS[i].username === username) {
      userExists = true;
      break;
    }
  }

  if(userExists) {
    res.send("Logged in successfully");
  } else {
    res.status(400).send("User does not exists");
  }
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  const username = req.headers.username;
  const password = req.headers.password;
  let userExists = false;

  for (let i = 0; i < USERS.length; i++) {
    if(USERS[i].password === password && USERS[i].username === username) {
      userExists = true;
      break;
    }
  }
  if(userExists) {
    res.send(COURSES);
  } else {
    res.status(400).send("User does not exists");
  }
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const username = req.headers.username;
  const password = req.headers.password;
  const Id = req.params.courseId;
  let userExists = false;
  let courseExists = false;

  for (let i = 0; i < USERS.length; i++) {
    if(USERS[i].password === password && USERS[i].username === username) {
      userExists = true;
      break;
    }
  }

  for (let i = 0; i < COURSES.length; i++) {
    if(COURSES[i].courseId === Id) {
      courseExists = true;
      break;
    }
  }

  if(userExists && courseExists) {
    res.send("Course purchased successfully");
  } else {
    res.status(400).send("User does not exists");
  }
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  const username = req.headers.username;
  const password = req.headers.password;
  let userExists = false;

  for (let i = 0; i < USERS.length; i++) {
    if(USERS[i].password === password && USERS[i].username === username) {
      userExists = true;
      break;
    }
  }

  if(userExists) {
    res.send(COURSES);
  } else {
    res.status(400).send("User does not exists");
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
