const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey = "vjnfjldndjf";

const generateJwt = (user) => {
  const payload = {username: user.username, password: user.password};
  return jwt.sign(payload, secretKey, {expiresIn: '1h'});
}

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if(authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    })

  }else {
    res.sendStatus(401);
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const adminExists = ADMINS.find(a => a.username === admin.username);
  if(adminExists){
    res.status(403).json({messege: "Admin already exis"});
  } else {
    ADMINS.push(admin);
    const token = generateJwt(admin);
    res.json({messege: "Admin signedUp successfully", token});
  }

});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);

  if(admin){
    const token = generateJwt(admin);
    res.json({ message: 'Logged in successfully', token });
  }else{
    res.status(403).json({ message: 'Admin authentication failed' });
  }
});

app.post('/admin/courses', authenticateJwt, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = COURSES.length + 1;
  COURSES.push(course);
  res.json({messege: "Course added successfully", courseId: course.id});
});

app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);

  const courseIndex = COURSES.findIndex(c => c.id === courseId);

  if (courseIndex > -1) {
    const updatedCourse = { ...COURSES[courseIndex], ...req.body };
    COURSES[courseIndex] = updatedCourse;
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authenticateJwt, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = req.body;
  const userExists = USERS.find(a => a.username === user.username);
  if(userExists){
    res.status(403).json({messege: "Admin already exists"});
  } else {
    ADMINS.push(user);
    const token = generateJwt(user);
    res.json({messege: "User signedUp successfully", token: token});
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const {username, password} = req.headers;
  const user = USERS.find(a => a.username === username && a.password === password);

  if(user){
    const token = generateJwt(user);
    res.json({ message: 'Logged in successfully', token });
  }else{
    res.status(403).json({ message: 'User authentication failed' });
  }
});

app.get('/users/courses', authenticateJwt, (req, res) => {
  // logic to list all courses
  res.json({courses: COURSES});
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const courseId  = parseInt(req.params.courseId);
  const course = COURSES.find(a => a.id === courseId);
  if(course){
    const user = USERS.find(u => u.username === req.user.username);
    if(user){
      if (!user.purchasedCourses) {
        user.purchasedCourses = [];
      }
      user.purchasedCourses.push(course);
      res.json({ message: 'Course purchased successfully' });
    }else{
      res.json({messege: "User not found"});
    }
  }else{
    res.json({messege: "Course not found"});
  }
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  const user = USERS.find(a => a.username === req.user.username);
  if(user && user.purchasedCourses){
    res.json({ purchasedCourses: user.purchasedCourses });
  }else{
    res.sendStatus(404).json({messege: "No courses purchased"})
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
