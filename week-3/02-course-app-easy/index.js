const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
function authenticateAdmin(req, res, next){
  const {username, password} = req.headers;
  const existingAdmin = ADMINS.find(obj => username === obj.username && password === obj.password);
  if(!existingAdmin){
    res.status(401).send('auth failed');
  }
  next();
}
function authenticateUser(req, res, next){
  const {username, password} = req.headers;
  const existingUser = USERS.find(obj => username === obj.username && password === obj.password);
  if(!existingUser){
    res.sendStatus(401)
  }
  next();
}

app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find(obj => admin.username === obj.username && admin.password === obj.password);
  if(existingAdmin){
    res.sendStatus(401)
  }
  ADMINS.push(admin);
  res.json({ 
    message: 'Admin created successfully' 
  });
});

app.post('/admin/login', authenticateAdmin, (req, res) => {
  // logic to log in admin
  res.json({ 
    message: 'Logged in successfully'
  });
});

app.post('/admin/courses', authenticateAdmin, (req, res) => {
  // logic to create a course
  //{ title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }
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
});

app.put('/admin/courses/:courseId', authenticateAdmin, (req, res) => {
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

app.get('/admin/courses', authenticateAdmin, (req, res) => {
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
  res.json({ 
    message: 'User created successfully' 
  });
});

app.post('/users/login', authenticateUser, (req, res) => {
  // logic to log in user
  res.json({ 
    message: 'Logged in successfully'
  });
});

app.get('/users/courses', authenticateUser, (req, res) => {
  // logic to list all courses
  
  res.json(COURSES.filter(course => course.published === true));
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const {username, password} = req.headers;
  const existingUser = USERS.find(obj => obj.username ===username  && obj.password === password);
  // console.log(existingUser);
  if(!existingUser){
    res.sendStatus(401)
  }
  //Number(req.params.courseId)
  existingUser.purchasedCourses.push(COURSES.find(course => course.courseId === Number(req.params.courseId)));
  res.json({ message: 'Course purchased successfully' });
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  const {username, password} = req.headers;
  const existingUser = USERS.find(obj => username === obj.username && password === obj.password);
  if(!existingUser){
    res.sendStatus(401)
  }
  res.json(existingUser.purchasedCourses);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
