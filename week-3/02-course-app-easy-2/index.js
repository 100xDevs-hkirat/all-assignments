const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const secretKey = "Akhilesh";
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function generateJwt(user) {
  return jwt.sign(user, secretKey, { expiresIn: '1h' });
}

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        res.send("Error in validating token");
      }
      req.user = user;
      next();
    })
  }
  else {
    res.send("Invalid token");
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var username = req.body.username;
  var password = req.body.password;
  var Obj = {
    username: username,
    password: password,
  };
  ADMINS.push(Obj);
  var token = generateJwt(Obj);
  res.send({
    message: "Admin created successfully",
    token: token
  })
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  var username = req.headers.username;
  var password = req.headers.password;
  if (ADMINS.filter((element) => element.username === username && element.password === password) != undefined) {
    var Obj = {
      username: username,
      password: password
    };
    var token = generateJwt(Obj);
    res.send({
      message: "Logged in successfully",
      token: token
    })
  }
  else {
    res.send("Invalid login credentials");
  }
});

app.post('/admin/courses', authenticateJwt, (req, res) => {
  // logic to create a course
  var course = req.body;
  COURSES.push(course);
  COURSES[COURSES.length - 1].id = COURSES.length;
  var id = COURSES.length;
  res.send({
    message: "Course added successfully",
    id: id
  })
});

app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
  // logic to edit a course
  var id = parseInt(req.params.courseId);
  var Obj = req.body;
  if (COURSES.length <= id) {
    COURSES[id - 1] = Obj;
    COURSES[id - 1].id = id;
    res.send({
      message: "Course updated successfully"
    });
  }
  else {
    res.send("Invalid Course Id");
  }
});

app.get('/admin/courses', authenticateJwt, (req, res) => {
  // logic to get all courses
  res.send({
    courses: COURSES
  })
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  var username = req.body.username;
  var password = req.body.password;
  var Obj = {
    username: username,
    password: password
  }
  USERS.push(Obj);
  var token = generateJwt(Obj);
  USERS[USERS.length - 1].purchased = [];
  res.send({
    message: "Logged in successfully",
    token: token
  })
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  var username = req.headers.username;
  var password = req.headers.password;
  var Obj = {
    username: username,
    password: password
  }
  if (USERS.filter((element) => element.username === username && element.password === password) == undefined) {
    res.send("Invalid user credentials");
  }
  var token = generateJwt(Obj);
  res.send({
    message: "User created successfully",
    token: token
  })
});

app.get('/users/courses', authenticateJwt, (req, res) => {
  // logic to list all courses
  res.send({
    courses: COURSES
  })
});

app.post('/users/courses/:courseId', authenticateJwt, (req, res) => {
  // logic to purchase a course
  var id = parseInt(req.params.courseId);
  var user = req.user;
  var update = USERS.filter((element) => element.username === user.username && element.password === user.password);
  if (update[0] != undefined && id <= COURSES.length) {
    update[0].purchased.push(id);
    res.send({
      message: "Course purchased successfully"
    });
  }
  else {
    res.send({
      method: "Unable to purchase Course"
    });
  }
});

app.get('/users/purchasedCourses', authenticateJwt, (req, res) => {
  // logic to view purchased courses
  var user = req.user;
  var toshow = USERS.filter((element) => element.username === user.username && element.password === user.password);
  if (toshow[0] != undefined) {
    res.send({
      purchasedCourses: toshow[0].purchased
    })
  }
  else {
    res.send("No user found with the given credentials");
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
