const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuth= (req, res, next) =>{
  const {username, password}= req.headers;

  const admin= ADMINS.find(a=> a.username=== username && a.password=== password)

  if(admin){
    next();
  }else{
    res.status(403).json({message: 'Admin auth failed'});
  }
}

const userAuth= (req, res, next) =>{
  const{username, password}= req.headers;

  const user= USERS.find(u => u.username=== username && u.password=== password);

  if(user){
    req.user= user;
    next();
  }else{
    res.status(403).json({message: 'User auth failed'});
  }

}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin= req.body;
  const existingAdmin= ADMINS.find(a => a.username === admin.username);

  if(existingAdmin){
    res.status(403).json({message: 'Admin already exists'});
  }else{
    ADMINS.push(admin);
    res.json({message: 'Admin created sucksexfully'})
  }
});

app.post('/admin/login',adminAuth, (req, res) => {
  // logic to log in admin
  res.json({message: 'Logged in sucksexfully'})
});

app.post('/admin/courses',adminAuth, (req, res) => {
  // logic to create a course
  const course= req.body;

  course.id= Date.now()+ Math.random()*100 ;
  COURSES.push(course);

  res.json({message: 'Course added', courseId: course.id});
});

app.put('/admin/courses/:courseId',adminAuth, (req, res) => {
  // logic to edit a course
  const courseId= parseInt(req,params.courseId);
  const course= COURSES.find(c=> c.id=== courseId);
  if(course){
    Object.assign(course, req.body);
    res.json({message: 'Course updated'});
  }else{
    res.status(403).json({message: 'Course not found'});
  }
});

app.get('/admin/courses',adminAuth, (req, res) => {
  // logic to get all courses
  res.json({courses: COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user= {...req.body, purchasedCourses: []};

  USERS.push(user);
  res.json({message: 'User created sucksexfully'});
});

app.post('/users/login',userAuth, (req, res) => {
  // logic to log in user
  res.json({message: 'logged in'})
});

app.get('/users/courses',userAuth, (req, res) => {
  // logic to list all courses
  const filteredCourses= COURSES.filter(c => c.published);
  res.json({courses: filteredCourses});
});

app.post('/users/courses/:courseId',userAuth, (req, res) => {
  // logic to purchase a course
  const courseId= parseInt(req.params.courseId);
  const course= COURSES.find(c=> c.id=== courseId);

  if(course()){
    req.user.purchasedCourses.push(course);
    res.json({message: 'purchased successfully'});
  }else{
    res.sendStatus(403).json({message: 'course not found'})
  }
});

app.get('/users/purchasedCourses',userAuth, (req, res) => {
  // logic to view purchased courses
  var purchasedCourseIds = req.user.purchasedCourses; [1, 4];
  var purchasedCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (purchasedCourseIds.indexOf(COURSES[i].id) !== -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }

  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
