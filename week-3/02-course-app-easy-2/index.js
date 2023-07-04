const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secret = "sdskfhouwgrguo2u1487tfeiqg*EQ&";

function createToken(USER) {
  const toEncrypt = {username: USER.username};
  return jwt.sign(toEncrypt,secret,{expiresIn: '1h'});
};

function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, secret,(err, user)=>{
    if(err){
      res.sendStatus(404);
    }
    req.user = user.username;
  });
  next();
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find(obj => admin.username === obj.username && admin.password === obj.password);
  if(existingAdmin){
    res.sendStatus(401)
  }
  ADMINS.push(admin);
  const token = createToken(admin);
  res.json({ 
    message: 'Admin created successfully',
    token
  });
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const admin = req.headers;
  const existingAdmin = ADMINS.find(obj => admin.username === obj.username && admin.password === obj.password);
  if(!existingAdmin){
    res.sendStatus(401)
  }
  const token = createToken(admin);
  res.json({ 
    message: 'Logged in successfully',
    token
  });
});

app.post('/admin/courses', verifyToken, (req, res) => {
  // logic to create a course
  const newCourse = {
    courseId : Math.floor(Math.random() * 100000),
    title : req.body.title,
    description : req.body.description,
    price : req.body.price,
    imageLink : req.body.imageLink,
    published : req.body.published
  };
  COURSES.push(newCourse);
  res.json({ 
      message: 'Course created successfully', courseId: newCourse.courseId 
  });
  res.sendStatus(200);
});

app.put('/admin/courses/:courseId', verifyToken, (req, res) => {
  // logic to edit a course
  const oldCourseIdx = COURSES.findIndex(course => course.courseId === parseInt(req.params.courseId));
  if(oldCourseIdx !== -1){
    COURSES[oldCourseIdx].title = req.body.title;
    COURSES[oldCourseIdx].description = req.body.description
    COURSES[oldCourseIdx].price = req.body.price
    COURSES[oldCourseIdx].imageLink = req.body.imageLink
    COURSES[oldCourseIdx].published = req.body.published
    res.json({ message: 'Course updated successfully' });
  }
  else{
    res.sendStatus(401);
  }
});

app.get('/admin/courses', verifyToken, (req, res) => {
  // logic to get all courses
  res.json(COURSES);
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = req.body;
  const existingUser = USERS.find(obj => user.username === obj.username && user.password === obj.password);
  if(existingUser){
    res.sendStatus(401)
  }
  const newUser = {
    username : req.body.username,
    password : req.body.password,
    purchasedCourses : []
  };
  USERS.push(newUser);
  const token = createToken(newUser);
  res.json({ 
    message: 'User created successfully',
    token
  });
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const user = req.headers;
  const existingUser = USERS.find(obj => user.username === obj.username && user.password === obj.password);
  if(!existingUser){
    res.sendStatus(401)
  }
  const token = createToken(user);
  res.json({ 
    message: 'Logged in successfully',
    token
  });
});

app.get('/users/courses', verifyToken, (req, res) => {
  // logic to list all courses
  res.json(COURSES.filter(course => course.published === true));
});

app.post('/users/courses/:courseId', verifyToken, (req, res) => {
  // logic to purchase a course
  const existingUser = USERS.find(obj => obj.username === req.user);
  existingUser.purchasedCourses.push(COURSES.find(course => course.courseId === Number(req.params.courseId)));
  res.json({ message: 'Course purchased successfully' });
});

app.get('/users/purchasedCourses', verifyToken, (req, res) => {
  // logic to view purchased courses
  const existingUser = USERS.find(obj => obj.username === req.user);
  res.json(existingUser.purchasedCourses);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
