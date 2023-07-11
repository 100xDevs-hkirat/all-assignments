const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function adminAuthenticaion(req,res,next){
  const {username, password} = req.headers;
   const admin = ADMINS.find(a => a.username === username && a.password === password);
   if(admin){
    next();
   }
   else{
    res.status(403).json({message:"Admin Authenticaion Unsuccessful"})
   }
}

function userAuthenticaion(req,res,next){
  const {username, password} = req.headers;
   const user = USERS.find(a => a.username === username && a.password === password);
   if(user){
    req.user = user;  
    next();
   }
   else{
    res.status(403).json({message:"User Authenticaion Unsuccessful"})
   }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    ADMINS.push(admin);
    res.json({ message: 'Admin created successfully' });
  }
  // logic to sign up admin
});


app.post('/admin/login',adminAuthenticaion, (req, res) => {
  res.json({message:'Admin Logged in successfully'});
  // logic to log in admin
});

app.post('/admin/courses',adminAuthenticaion, (req, res) => {
  const course =  req.body;
  course.id = Date.now();
  COURSES.push(course);
  res.json({message:'Course created successfully',courseId:course.id});
  // logic to create a course
});

app.put('/admin/courses/:courseId',adminAuthenticaion, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(a => a.id === courseId);
  if(course){
    Object.assign(course,req.body);
    res.status(200).json({message:"Course updated successfully"});
    }
  else{
    res.status(403).json({message: "Course not found"});
  }
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  res.json({courses :  COURSES});
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    purchasedCourses: []
  }; 
    USERS.push(user);
    res.json({ message: 'User created successfully' });
  // logic to sign up user
});

app.post('/users/login',userAuthenticaion, (req, res) => {
   res.json({message : "User logged in successfully"});
  // logic to log in user
});

app.get('/users/courses',userAuthenticaion, (req, res) => {
  let filteredCourses = [];
  for(var i = 0;i<COURSES.length;i++){
   if(COURSES[i].published){
    filteredCourses.push(COURSES[i]);
   }
  }
  res.json({courses : filteredCourses});
  // logic to list all courses
});

app.post('/users/courses/:courseId',userAuthenticaion, (req, res) => {
   const courseId =  Number(req.params.courseId);
   const course = COURSES.find(c => c.id === courseId && c.published);
   if(course){
    req.user.purchasedCourses.push(courseId);
    res.json({message : "Course purchased successfully"});
   }
   res.status(404).json({message : "Course not found"});
  // logic to purchase a course
});

app.get('/users/purchasedCourses',userAuthenticaion, (req, res) => {
  var purchasedCourseIds =  req.user.purchasedCourses;
  var purchasedCourses = COURSES.filter(course => purchasedCourseIds.indexOf(course.id) !== -1);
  res.json({courses :  purchasedCourses});
  // logic to view purchased courses
});

app.get('/test',(req,res) => {
  console.log("Just TEsting");
  res.status(200).json({message: "Just TEsting" })
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

