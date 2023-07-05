const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
// function authenication(req, res, next) {
//   let admin = ADMINS.find((a, b) => a.email === req.email && b.password === req.password) 

// }
// Admin routes


app.get('/details', (req, res) => {
  if(ADMINS.length) {
    res.json({ADMINS})
    console.log(ADMINS)
  } else {
    return res.status(401).send("Unauthorized");
  }
})

app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  if (ADMINS.find((a) => a.email === admin.email)) {
    res.json({ message: 'Admin already exists' });
  } else {
    ADMINS.push(admin);
    res.json({ message: "Admin entered successfully"});
  }
});

app.post('/admin/login',  (req, res) => {
  // logic to log in admin
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
