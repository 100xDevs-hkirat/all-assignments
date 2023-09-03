const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function adminAuthentication(req, res, next)
{
  const {username, password} = req.headers;
  let admin = ADMINS.find(a => a.username === username && a.password === password);
  if(admin)
  {
    next();
  }
  else{
    res.status(403).send('Admin authentication failed');
  }
}

function UserAuthentication(req, res, next)
{
  const {username, password} = req.headers;
  let user = USERS.find(a => a.username === username && a.password === password);
  if(user)
  {
    req.user = user;
    next();
  }
  else{
    res.status(403).send('User authentication failed');
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  body = req.body;
  let existingAdmin = ADMINS.find(a => a.username === body.username);

  if(existingAdmin){
    res.status(403).send('Admin already exists');
  }
  else{
    ADMINS.push(body);
    res.status(201).send('Admin created successfully');
  }
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  res.status(200).send('Logged in successfully');
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
  let course = req.body;

  course.id = Date.now(); //assign unique ID
  COURSES.push(course);
  res.status(201).send('Course created successfully');
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  let courseId = parseInt(req.params.courseId);
  let course = COURSES.find(c => c.id === courseId);

  if(course){
    Object.assign(course, req.body);
    res.status(200).send('Course updated successfully');
  }
  else{
    res.status(404).send('Course not found');
  }
});

app.get('/admin/courses', adminAuthentication, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  body = req.body;
  let existingUser = USERS.find(a => a.username === body.username);

  if(existingUser){
    res.status(403).send('User already exists');
  }
  else{
    let user = {...body, purchasedCourses : []};
    USERS.push(user);
    res.status(201).send('User created successfully');
  }
});

app.post('/users/login', UserAuthentication, (req, res) => {
  // logic to log in user
  res.status(200).send('User loggedn in successfully');
});

app.get('/users/courses', UserAuthentication, (req, res) => {
  // logic to list all courses
  let publishedCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (COURSES[i].published) {
      publishedCourses.push(COURSES[i]);
    }
  }
  res.json({ courses: publishedCourses });
});

app.post('/users/courses/:courseId',UserAuthentication, (req, res) => {
  // logic to purchase a course
  let courseId = parseInt(req.params.courseId);
  let course = COURSES.find(c => c.id === courseId && c.published);

  if(course)
  {
    req.user.purchasedCourses.push(courseId);
    res.status(200).send('Course purchased successfully');
  }
  else{
    res.status(404).send('Course not found');
  }
});

app.get('/users/purchasedCourses', UserAuthentication, (req, res) => {
  // logic to view purchased courses
  var purchasedCourseIds = req.user.purchasedCourses;
  var purchasedCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (purchasedCourseIds.indexOf(COURSES[i].id) !== -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }
  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
