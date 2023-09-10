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
  const newUser = req.body;
  const isExisted = USERS.find(user=>user.username===newUser.username && user.password===newUser.password);
  if(isExisted){
    res.status(403).json({error:"User is already existed"});
  }
  else{
    USERS.push(newUser);
    const token = generateJwt(newUser);
    res.json({message:"user created successfully",token:token});
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const{username,password} = req.headers;
  const isExisted = USERS.find(user=>user.username===username && user.password===password);
  if(isExisted){
    const token = generateJwt(isExisted);
    res.json({message:"Successfully login."});
  }
  else{
    res.status(403).json({error:"User authentication failed."});
  }
});

app.get('/users/courses',authenticateJwt, (req, res) => {
  // logic to list all courses
  res.json({courses:COURSES});
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const courseId  = req.params.courseId;
  const courseToPurchased = COURSES.find(course=> course.id===courseId);
  if(courseToPurchased){
    const user = USERS.find(a=>a.username===req.user.username);
    if(user){
      if(!user.purchaseCourse){
        user.purchaseCourse=[];
      }
      user.purchaseCourse.push(courseToPurchased);
      res.json({message:"Course is purchased successfullly."});
    }
  }
  else{
    res.status(404).send({message:"course not found."});
  }
});

app.get('/users/purchasedCourses',authenticateJwt, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find(a=>a.username===req.user.username);
  if(user && user.purchaseCourse){
    res.json({courses:user.purchaseCourse});
  }
  else{
    res.send({error:"Not able to find the purchased course"});
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
