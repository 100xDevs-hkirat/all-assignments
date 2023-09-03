const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
const adminSecretKey = "ADMIN_SECRET_KEY";
const userSecretKey = "USER_SECRET_KEY";

const generateJwtAdmin = (admin) => {
  const payload = { username: admin.username, };
  return jwt.sign(payload, adminSecretKey, { expiresIn: '1h' });
};

const generateJwtUser = (user) => {
  const payload = { username: user.username, };
  return jwt.sign(payload, userSecretKey, { expiresIn: '1h' });
}

function authenticateJwtAdmin(req, res, next)
{
  const authHeader = req.headers.authorization;
  if(authHeader){
    const token = authHeader.split(' ')[1];
    jwt.verify(token, adminSecretKey, (err, user) => {
      if(err){
        res.sendStatus(403);
      }
      req.user = user;
      next();
    })
  }
  else{
    res.sendStatus(401);
  }
}

function authenticateJwtUser(req, res, next)
{
  const authHeader = req.headers.authorization;
  if(authHeader){
    const token = authHeader.split(' ')[1];
    jwt.verify(token, userSecretKey, (err, user) => {
      if(err){
        res.sendStatus(403);
      }
      req.user = user;
      next();
    })
  }
  else{
    res.sendStatus(401);
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
    const token = generateJwtAdmin(body);
    ADMINS.push(body);
    res.json({ message: 'Admin created successfully', token });
  }
});

app.post('/admin/login', authenticateJwtAdmin, (req, res) => {
  // logic to log in admin
  res.status(200).send('Logged in successfully');
});

app.post('/admin/courses', authenticateJwtAdmin, (req, res) => {
  // logic to create a course
  let course = req.body;

  course.id = Date.now(); //assign unique ID
  COURSES.push(course);
  res.status(201).send('Course created successfully');
});

app.put('/admin/courses/:courseId', authenticateJwtAdmin, (req, res) => {
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

app.get('/admin/courses', authenticateJwtAdmin, (req, res) => {
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
    const token = generateJwtUser(body);
    let user = {...body, purchasedCourses : []};
    USERS.push(user);
    res.json({message: 'User created successfully', token});
  }
});

app.post('/users/login', authenticateJwtUser, (req, res) => {
  // logic to log in user
  res.status(200).send('User loggedn in successfully');
});

app.get('/users/courses', authenticateJwtUser, (req, res) => {
  // logic to list all courses
  let publishedCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (COURSES[i].published) {
      publishedCourses.push(COURSES[i]);
    }
  }
  res.json({ courses: publishedCourses });
});

app.post('/users/courses/:courseId', authenticateJwtUser, (req, res) => {
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

app.get('/users/purchasedCourses', authenticateJwtUser, (req, res) => {
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
