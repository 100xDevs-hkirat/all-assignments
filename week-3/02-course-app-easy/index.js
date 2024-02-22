const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var username = req.body.username;
  var password = req.body.password;
  var id = Math.floor(Math.random() * 100);
  ADMINS.push({
    id: id,
    username: username,
    password: password,
    status: "Logged Out"
  });
  res.send({
    message: "Admin created successfully"
  });
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  var username = req.headers.username;
  var password = req.headers.password;
  if (ADMINS.find((element) => element.username === username && element.password === password) != undefined) {
    ADMINS.find((element) => element.username === username && element.password === password).status = "Logged In";
    res.send({
      message: "Logged in successfully"
    });
  }
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  var username = req.headers.username;
  var password = req.headers.password;
  if (ADMINS.find((element) => element.username === username && element.password === password) != undefined) {
    var obj = req.body;
    obj.id = COURSES.length + 1;
    COURSES.push(obj);
    res.send({
      message: "Course created successfully",
      id: COURSES.length
    });
  }
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  var username = req.headers.username;
  var password = req.headers.password;
  if (ADMINS.find((element) => element.username === username && element.password === password) === undefined) {
    res.send({
      message: "Invalid Credentials"
    });
  }
  var id = parseInt(req.params.courseId);
  if (COURSES.find((element) => element.id === id) != undefined) {
    COURSES[id - 1] = req.body;
    res.send({
      message: "Course updated successfully"
    })
  }
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  var username = req.headers.username;
  var password = req.headers.password;
  if (ADMINS.find((element) => element.username === username && element.password === password) != undefined) {
    res.send({
      courses: COURSES
    });
  }
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  var username = req.body.username;
  var password = req.body.password;
  var id = Math.floor(Math.random() * 100);
  USERS.push({
    id: id,
    username: username,
    password: password,
    status: "Logged Out",
    purchased: []
  });
  res.send({
    message: "User created successfully"
  });
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  var username = req.headers.username;
  var password = req.headers.password;
  if (USERS.find((element) => element.username === username && element.password === password) != undefined) {
    USERS.find((element) => element.username === username && element.password === password).status = "Logged In";
    res.send({
      message: "Logged in successfully"
    });
  }
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  var username = req.headers.username;
  var password = req.headers.password;
  if (USERS.find((element) => element.username === username && element.password === password) != undefined) {
    res.send({
      courses: COURSES
    });
  }
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  var username = req.headers.username;
  var password = req.headers.password;
  var id = parseInt(req.params.courseId);
  if (USERS.find((element) => element.username === username && element.password === password) != undefined) {
    USERS.find((element) => element.username === username && element.password === password).purchased.push(id - 1);
    res.send({
      message: "Course purchased successfully"
    });
  }
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  var username = req.headers.username;
  var password = req.headers.password;
  var courseList = [];
  if (USERS.find((element) => element.username === username && element.password === password) != undefined) {
    var element = USERS.find((element) => element.username === username && element.password === password);
    for (let i = 0; i < element.purchased.length; i++) {
      courseList.push(COURSES[element.purchased[i]]);
    }
    res.send({
      purchasedCourses: courseList
    });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
