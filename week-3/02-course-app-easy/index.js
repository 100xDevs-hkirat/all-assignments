const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuth = (req,res,next) => {
  const userName = req.header("userName");
  const pass = req.header("pass");
  for(let i=0;i<ADMINS.length;i++) 
    console.log(ADMINS[i].admin)
  const adminInd = ADMINS.findIndex(t => t.admin===userName && t.pass===parseInt(pass));
  if(adminInd !== -1)
    next();
  else 
    res.status(401).json({message:"Admin Authentication Failed"});
}

const userAuth = (req,res,next) => {
  //const {userName, pass} = req.headers;
  const userName = req.header("userName");
  const pass = req.header("pass");
  const user = USERS.find(t => t.username === userName && t.pass === parseInt(pass));
  if(user) {
    req.user = user;
    next();
  }
  else 
    res.status(401).json({message:"User Authentication Failed"});
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body.admin;
  const pass = req.body.pass;
  const signupData = {
    admin: admin,
    pass: pass
  }
  console.log("signup data " + signupData.admin)
  ADMINS.push(signupData);
  console.log("yaha " + ADMINS[0].admin);
  res.status(200).send("Admin created successfully");

});

app.post('/admin/login', adminAuth, (req, res) => {
  // logic to log in admin
  console.log("yoi" + ADMINS);
  res.json({message:"Logged in successfully"});
});

app.post('/admin/courses', adminAuth,(req, res) => {
  // logic to create a course
    const course = req.body;
    course.id =  COURSES.length + 1;
    COURSES.push(course);
    res.status(200).json({message:"Course Created Successfully", courseId: course.id})
});

app.put('/admin/courses/:courseId', adminAuth, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const courseInd = COURSES.findIndex(t => t.id === courseId);
  if(courseInd !== -1) {
    COURSES[courseInd] = req.body;
    res.json({massage:"Course updated successfully"});
  }
  else {
    res.status(401).json({message:'Course not found'});
  }
});

app.get('/admin/courses', adminAuth, (req, res) => {
  // logic to get all courses
  res.status(200).json({courses: COURSES})
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const userName = req.body.userName;
  const pass = req.body.pass;
  const user = {
    username: userName,
    pass: pass,
    purchasedCourses: []
  }
  USERS.push(user);
  res.status(201).json({message: "User created successfully"});
});

app.post('/users/login', userAuth, (req, res) => {
  // logic to log in user
  res.json({message:"Logged in successfully"})
});

app.get('/users/courses', userAuth, (req, res) => {
  // logic to list all courses
  let courses = [];
  for(let i=0;i<COURSES.length;i++) {
    if(COURSES[i].published)
      courses.push(COURSES[i]);
  }
  res.status(200).json({courses:courses})
});

app.post('/users/courses/:courseId', userAuth, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(t => t.id === courseId && t.published);
  if(course) {
    req.user.purchasedCourses.push(courseId);
    res.json({message: 'Course purchased successfully'});
  } else {
    res.status(404).json({message: 'Course not present'});
  }
});

app.get('/users/purchasedCourses', userAuth, (req, res) => {
  // logic to view purchased courses
  const purchasedCourses = req.user.purchasedCourses;
  let purchasedCoursesbyUser = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (purchasedCourses.indexOf(COURSES[i].id) !== -1) {
      purchasedCoursesbyUser.push(COURSES[i]);
    }
  }
  res.json({ purchasedCoursesbyUser });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
