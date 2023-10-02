const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')

app.use(express.json());
app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretkey = 'Yashisking';

function generateJwt(user) {
  const person = {username: user.username};
  jwt.sign(person,secretkey,{expiresIn : '1h'});
}

function authenticateJwt(req,res,next()) {
  
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  try{
    const admins = req.body;
    const existingAdmin = ADMINS.find(u => u.username === username);
    if(existingAdmin){
    res.send("Admin already exists");
    }
    else{
      ADMINS.push(admins);
      const token = generateJwt(admins);
      res.status(201).send({message:"Admin created successfully",token:token});
    }

  }
  catch(error){
    res.status(400).send(`An ${error} has occurred`);

  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username,password} = req.body;
  const admins = ADMINS.find(u => u.username === username && u.password === password);

  if(admins){
    const token = generateJwt(admins);
    res.status(201).json({message : "Admin detected",token});
  }
  else{
    res.status(404).send("Admin not found");
  }
});

app.post('/admin/courses', authenticateJwt , (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = COURSES.length + 1;
  try{
  COURSES.push(course);
  res.status(201).json({message: "Course published successfully",course.id});
  }
  catch(error){
    res.status(400).send("An ${error} has occured");
  }
});

app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const courseIndex = COURSES.findIndex(u => u.id === courseId);
  if(courseIndex > -1) {
    COURSES[courseIndex] = {...COURSES[courseIndex], ...req.body};
    res.status(201).send("The course is edited");
  } 
  else{
    res.status(404).send("The course searched for not found");
  }
});

app.get('/admin/courses', authenticateJwt, (req, res) => {
  // logic to get all courses
  res.json({courses: COURSES});
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
