const express = require('express');
const app = express();
const jwt= require('jsonwebtoken');

app.use(express.json());
const secretA= 'papis3cr3tADMIN';
const secretU= 'papis3cr3tUSER';

let ADMINS = [];
let USERS = [];
let COURSES = [];

const generateJwtAdmin = (input)=>{
  const payload= {username: input.username}
  return jwt.sign(payload, secretA, {expiresIn: '1h'});
}
const generateJwtUser = (input)=>{
  const payload= {username: input.username}
  return jwt.sign(payload, secretU, {expiresIn: '1h'});
  // console.log(token);
}

const authenticateJwtAdmin = ()=> {
  const authHeader= req.headers.authorization;

  if(authHeader){
    const token = authHeader.split(' ')[i];

    jwt.verify(token, secretA, (err, user)=>{
      if(err){
        return res.sendStatus(403);
      }

      req.user= user;
      next();
    })
  }else{
    res.sendStatus(401);
  }
}


const authenticateJwtUser = ()=> {
  const authHeader= req.headers.authorization;

  if(authHeader){
    const token = authHeader.split(' ')[i];

    jwt.verify(token, secretU, (err, user)=>{
      if(err){
        return res.sendStatus(403);
      }

      req.user= user;
      next();
    })
  }else{
    res.sendStatus(401);
  }
}

// const adminAuth= (req, res, next) =>{
//   const {username, password}= req.headers;

//   const admin= ADMINS.find(a=> a.username=== username && a.password=== password)

//   if(admin){
//     next();
//   }else{
//     res.status(403).json({message: 'Admin auth failed'});
//   }
// }

// const userAuth= (req, res, next) =>{
//   const{username, password}= req.headers;

//   const user= USERS.find(u => u.username=== username && u.password=== password);

//   if(user){
//     req.user= user;
//     next();
//   }else{
//     res.status(403).json({message: 'User auth failed'});
//   }

// }

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin= req.body;
  const existingAdmin= ADMINS.find(a => a.username === admin.username);

  if(existingAdmin){
    res.status(403).json({message: 'Admin already exists'});
  }else{
    ADMINS.push(admin);
    const token= generateJwtAdmin(admin);
    res.json({message: 'Admin created sucksexfullly', token})
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username, password}= req.headers;
  const admin= ADMINS.find(a => a.username=== username && a.password === password);

  if(admin){
    const token= generateJwtAdmin(admin);
    res.json({message: 'Logged in sucksexfully' , token})
  }else{
    res.status(403).json({message: 'Admin auth failed'})
  }
});

app.post('/admin/courses',authenticateJwtAdmin, (req, res) => {
  // logic to create a course
  const course= req.body;

  course.id= Date.now()+ Math.random()*100 ;
  COURSES.push(course);

  res.json({message: 'Course added', courseId: course.id});
});

app.put('/admin/courses/:courseId',authenticateJwtAdmin, (req, res) => {
  // logic to edit a course
  const courseId= parseInt(req.params.courseId);
  const course= COURSES.find(c=> c.id=== courseId);
  if(course){
    Object.assign(course, req.body);
    res.json({message: 'Course updated'});
  }else{
    res.status(403).json({message: 'Course not found'});
  }
});

app.get('/admin/courses',authenticateJwtAdmin, (req, res) => {
  // logic to get all courses
  res.json({courses: COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = req.body;
  const existingUser = USERS.find(u => u.username === user.username);
  if (existingUser) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    USERS.push(user);
    const token = generateJwtUser(user);
    // console.log(token);
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    const token = generateJwtUser(user);
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
});

app.get('/users/courses',authenticateJwtUser, (req, res) => {
  // logic to list all courses
  res.json({courses: COURSES});
});

app.post('/users/courses/:courseId',authenticateJwtUser, (req, res) => {
  // logic to purchase a course
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

app.get('/users/purchasedCourses',authenticateJwtUser, (req, res) => {
  // logic to view purchased courses
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
