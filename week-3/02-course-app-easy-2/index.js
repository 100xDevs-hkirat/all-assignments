const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secret = "secret";

const generateJwt = (user)=>{
  const payload = user;
  return jwt.sign(payload,secret,{expiresIn:'1h'});
}

const authenticateJwt = (req,res,next)=>{
  const authHeader = req.headers.authorization;
  if(authHeader){
    const token = authHeader.split(' ')[1];
    jwt.verify(token,secret,(err,user)=>{
      if(err){
        res.json({error:"Forbidden"});
      }
      else{
        req.user = user;  
        next();            //but doing something with this user does not change orginal array
      }
    })
  }
  else{
    res.sendStatus(401);
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  let newAdmin = req.body;
  const isExisted = ADMINS.find(admin => admin.username===newAdmin.username && admin.password===newAdmin.password);
  if(isExisted){
    res.status(403).json({message:"User already exits."});
  }
  else{
    ADMINS.push(newAdmin);
    const token = generateJwt(newAdmin,secret);
    res.json({message:"Admin created successfully.",token:token});
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username,password} = req.headers;
  const isExisted = ADMINS.find(admins=> admins.username === username && admins.password===password);
  if(isExisted){
    const token = generateJwt(isExisted);
    res.send({message:"User login successfully",token});
  }
  else{
    res.json({message:"User authentication failed."});
  }
});

app.post('/admin/courses',authenticateJwt, (req, res) => {
  // logic to create a course
  const newCourse  = req.body;
  newCourse.id = COURSES.length+1;
  COURSES.push(newCourse);
  res.json({message:"course create successfully."});
});

app.put('/admin/courses/:courseId',authenticateJwt, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const isExisted = COURSES.findIndex(course=> course.id===courseId);
  if(isExisted!=-1){
    const updatedCourse={...isExisted,...req.body};
    COURSES[isExisted] = updatedCourse;
    res.json({message:"Course is updated successfully"});
  }
  else{
    res.status(404).json({message:"Course not found."});
  }

});

app.get('/admin/courses',authenticateJwt, (req, res) => {
  // logic to get all courses
  res.json({courses:COURSES});

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
