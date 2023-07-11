const express = require('express');
const app = express();
const jwt=require("jsonwebtoken");

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
const secretKeyAdmin='ABM357';
const secretKeyUser='UBM357';
let generateTokenAdmin=(obj)=>{
  let payload={username:obj.username,}
  return jwt.sign(payload,secretKeyAdmin, { expiresIn: '1h'});
  

}

let adminAuthenticationJwt=(req,res,next)=>{
  console.log(req);
  const authHeader=req.headers.authorization;

 if(authHeader){
  const token=jwt.verify(token,secretKeyAdmin,(err,user)=>{
    if(err){
      return res.sendStatus(403);
    }
    req.user=user;
    next();
  });
 }else{
  res.sendStatus(401);
 }

}

let generateTokenUser=(obj)=>{
  const payload={username:obj.username,};
  return jwt.sign(payload,secretKeyUser,{expiresIn: '1h'});

}

const UserAuthenticationJwt=(req,res,next)=>{
  //console.log(req);
  const authHeader=req.headers.authorization;
  if(authHeader){
    const token=authHeader.split(' ')[1];
    jwt.verify(token,secretKeyUser,(err,user)=>{
      if(err){
        return res.sendStatus(403);
      }
      req.user=user;
      next();
    })

  }else{
    res.sendStatus(401);
  }

}

app.post('/admin/signup', (req, res) => {
  let AdminDetails=req.body;

  const admin=ADMINS.find(user=>user.username===AdminDetails.username);

  if(admin){
    res.status(403).json({message: 'Admin already exists'});
  }else{
    ADMINS.push(AdminDetails);
    const token=generateTokenAdmin(AdminDetails);
    res.json({message: 'Admin created successfully',token});
  }



  // logic to sign up admin
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const AdminDetails=req.body;
  const admin=ADMINS.find(a=>a.username===AdminDetails.username && a.password===AdminDetails.password);

  if(admin){
    const token=generateTokenAdmin(AdminDetails);
    res.status(200).json({message: 'Logged in successfully', token});


  }else{
    res.status(403).json({message: "Admin authentication failed"});
  }
  

});

app.post('/admin/courses', adminAuthenticationJwt, (req, res) => {
  // logic to create a course
  const course=req.body;
  const CourseId=COURSES.length+1;
  course.id=CourseId;
  COURSES.push(course);
  res.json({message:'Course Created Successfully',courseID:courseID});

});

app.put('/admin/courses/:courseId',adminAuthenticationJwt, (req, res) => {

  // logic to edit a course
  const courseID=parseInt(req.params.courseId);
  const courseIndex=COURSES.findIndex(ob=>ob.id===courseID);
  if(courseIndex>-1){
    const updatedCourse={...COURSES[courseIndex],...req.body};
    COURSES[courseIndex]=updatedCourse;
    res.json({message: 'Course updated successfully'});

  }else{
    res.status(404).json({message: 'Course not found'});
  }



});

app.get('/admin/courses',adminAuthenticationJwt, (req, res) => {
  // logic to get all courses
  res.json({courses:COURSES});

});

// User routes
app.post('/users/signup',(req, res) => {
  // logic to sign up user
  const userDetails=req.body;
  const existingUser=USERS.find(u=>u.username===userDetails.username);
  if(!existingUser){
    const token=generateTokenUser(userDetails);
    USERS.push(userDetails);
    res.json({message:'User created successfully',token});
  }else{
    res.status(403).send({message:'User already exists'});
  }

});

app.post('/users/login', (req, res) => {
  // logic to log in user
 const {username,password}=req.body;
 const user=USERS.find(ob=> ob.username===username && ob.password===password);
 if(user){
  const token=generateTokenUser(user);
  res.json({message:'Logged in Successfully',token});

 }else{
  res.status(403).json({message:'User authentication fails'});


 }
});

app.get('/users/courses',UserAuthenticationJwt, (req, res) => {
  // logic to list all courses
  res.json({courses:COURSES});

});

app.post('/users/courses/:courseId', UserAuthenticationJwt,(req, res) => {
  // logic to purchase a course
  const id=parseInt(req.params.courseId);
  const course=COURSES.find(c=>c.id===id);
  if(course){
    const user=USERS.find(u=>u.username===req.user.username);
    if(user){
      if(!user.purchasedCourses){
        user.purchasedCourses=[];
      }
      user.purchasedCourses.push(course);
      res.json({message:'Course purchased successfully'});
    }else{
      res.status(403).json({ message: 'User not found' });
    }


  }else{
    res.status(404).json({message:'Course not found'});
  }

});

app.get('/users/purchasedCourses',UserAuthenticationJwt, (req, res) => {
  // logic to view purchased courses
  const user=USERS.find(u=>u.username===req.user.username);
  if(user && user.purchasedCourses){
    res.json({purchasedCourses:user.purchasedCourses});
  }else{
    res.status(404).json({message:'No courses purchased'});
  }

});


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
