const express = require('express');
const jwt=require("jsonwebtoken")

const app = express();


app.use(express.json());

const secretKey="lsd"

const generateJWT=(user)=>{
  const payload={username:user.usernam};
  return jwt.sign(payload,secretKey,{expiresIn:'1h'});
}

const authenticateJWT=(req,res,next)=>{
  const authHeader=req.headers.authorization;
  if(authHeader){
    const token=authHeader.split(" ")[1];
    jwt.verify(token,secretKey,(err,user)=>{
      if(err){
        return res.sendStatus(403)
      }
      req.user=user;
      next()
    });  
  }else{
      res.sendStatus(401);
  }
}


let ADMINS = [];
let USERS = [];
let COURSES = [];


// Admin routes
app.post('/admin/signup', (req, res) => {
  const admin=req.body;
  const existingAdmin=ADMINS.find(a =>a.username===admin.username)
  if(existingAdmin){
    res.status(403).json({message:'Admin exists'})
  }else{
    ADMINS.push(admin);
    const token=generateJWT(admin)
    res.json({message:'Admin created SUCCCESSFULLY',token})
  }
});

app.post('/admin/login', (req, res) => {
  const{username,password}=req.headers
  const admin=ADMINS.find(a=>a.username===username && a.password===password)
  if(admin){
    const token = generateJWT(admin)
    res.json({message:"logged in Successfully",token})
  }else{
    res.status(403).json({message:"Admin authentication failed "})
  }
  
});

app.post('/admin/courses', authenticateJWT, (req, res) => {
  const course=req.body;
  
  course.id=COURSES.length +1;
  COURSES.push(course);
  res.json({message:'Course created successfully',courseID:course.id})
});

app.put('/admin/courses/:courseId',authenticateJWT,  (req, res) => {
  const courseId=Number(req.params.courseId);
  const course=COURSES.find(c=>c.id===courseId);
  if(course){
    Object.assign(course,req.body);
    res.json({message:'Course UPDated Successfully'})
  }else{
    res.status(404).json({message:'Course not found'})
  }
});

app.get('/admin/courses',authenticateJWT, (req, res) => {
 res.json({course:COURSES})
});

// User routes
app.post('/users/signup', (req, res) => {
 const user=req.body;
 const existingUser=USERS.find(u=>u.username===user.username)
 if(existingUser){
  res.status(403).json({message:'user already exists'})
 }else{
  USERS.push(user)
  const token=generateJWT(user)
  res.json({message:'user created successfullu',token})
 }
 
});

app.post('/users/login', (req, res) => {
  res.json({message:'Logged in Successfully'})
});

app.get('/users/courses', (req, res) => {
  res.json({course:COURSES.filter(c=>c.published)})
});

app.post('/users/courses/:courseId', authenticateJWT, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if (course) {
    const user = USERS.find(u => u.username === req.user.username);
    if (user) {
      if (!user.purchasedCourses) {
        user.purchasedCourses = [];
      }
      user.purchasedCourses.push(course);
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', authenticateJWT, (req, res) => {
  const user = USERS.find(u => u.username === req.user.username);
  if (user && user.purchasedCourses) {
    res.json({ purchasedCourses: user.purchasedCourses });
  } else {
    res.status(404).json({ message: 'No courses purchased' });
  }
});


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
