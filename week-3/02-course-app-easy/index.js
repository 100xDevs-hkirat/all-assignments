const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req,res,next)=>{
  //check if admin exist in admin array if yes call next
  const admin = req.headers;
  const validAdmin = ADMINS.find(a=>a.username===admin.username
    &&a.password === admin.password  );
  if(validAdmin){
    next();
  }else{
    res.status(403).json({message:'Admin authentication failed'})
  }
}
const userAuthentication = (req,res,next)=>{
  //check if admin exist in admin array if yes call next
  const user = req.headers;
  const validUser = USERS.find(u=>u.username===user.username
    &&u.password === user.password  );
  if(validUser){
    // adding user object to req body because a user has purchased course in USERS array
    req.user = validUser;
    next();
  }else{
    res.status(403).json({message:'User Authentication failed'});
  }
}
// Admin routes
app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find(a=>a.username === admin.username
    && a.password ===admin.password );
  if(existingAdmin) 
    res.status(404).json({message: 'Admin already exist'});
  else{
    ADMINS.push(admin);
    res.json({message: 'Admin created successfully'})
  }
});

app.post('/admin/login',adminAuthentication, (req, res) => {
  console.log(req.headers);
  res.json({message: 'Logged in successfully'});
});

app.post('/admin/courses',adminAuthentication, (req, res) => {
  const course = req.body;
  course.id = Date.now();
  COURSES.push(course);
  res.json({ message: 'Course created successfully', courseId: 1 })
});

app.put('/admin/courses/:courseId',adminAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c=>c.id ===courseId);
  if(course){
    Object.assign(course,req.body);
    res.json({message: 'Course updated successfully'});
  }else{
    res.status(403).json({message:'Course not found'});
  }
});

app.get('/admin/courses',adminAuthentication, (req, res) => {
  res.json({courses: COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  const user = {...req.body,purchasedCourse: []};
  const existingUser = USERS.find(u=>u.username === user.username
    && u.password ===user.password );
  if(existingUser) 
    res.status(404).json({message: 'User already exist'});
  else{
    USERS.push(user);
    res.json({message: 'User created successfully'})
  }
});

app.post('/users/login',userAuthentication, (req, res) => {
  res.json({ message: 'Logged in successfully' });
});

app.get('/users/courses',userAuthentication, (req, res) => {
  let filteredCourses = COURSES.filter(c => c.published) ;
  res.json({course: filteredCourses});
});

app.post('/users/courses/:courseId',userAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c=>c.id === courseId &&c.published);
  if(course){
    req.user.purchasedCourse.push(course);
  res.json({message:'Course purchased successfully'})
  }else{
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses',userAuthentication, (req, res) => {
  // const user = USERS.find(u=>u.username === req.user.username);
  // res.json({purchasedCourses:req.user.purchasedCourse});
  const purchasedCourses = COURSES.filter(c=>req.user.purchasedCourses.includes(c.id));
  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
