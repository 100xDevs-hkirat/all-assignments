const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const fs = require('fs');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

try{
  ADMINS = JSON.parse(fs.readFileSync('admins.json', 'utf8'));
  USERS = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  COURSES = JSON.parse(fs.readFileSync('courses.json', 'utf8'));
}catch{
  ADMINS = [];
  USERS = [];
  COURSES = [];
}

const secretKey = "vjnfjldndjf";

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
    const token = jwt.sign({ username, role: 'admin' }, secretKey, { expiresIn: '1h' });
    fs.writeFileSync('admins.json', JSON.stringify(ADMINS));
    res.json({messege: "Admin signedUp successfully", token});
  }

});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);

  if(admin){
    const token = jwt.sign({ username, role: 'admin' }, secretKey, { expiresIn: '1h' });
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
  fs.writeFileSync('courses.json', JSON.stringify(COURSES));
  res.json({messege: "Course added successfully", courseId: course.id});
});

app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);

  const courseIndex = COURSES.findIndex(c => c.id === courseId);

  if (courseIndex > -1) {
    const updatedCourse = { ...COURSES[courseIndex], ...req.body };
    COURSES[courseIndex] = updatedCourse;
    fs.writeFileSync('courses.json', JSON.stringify(COURSES));
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
  const {username, password} = req.body;
  const userExists = USERS.find(a => a.username === username);
  if(userExists){
    res.status(403).json({messege: "User already exists"});
  } else {
    const newUser = {username, password}
    USERS.push(newUser);
    fs.writeFileSync('users.json', JSON.stringify(USERS));
    const token = jwt.sign({ username, role: 'user' }, secretKey, { expiresIn: '1h' });
    res.json({messege: "User signedUp successfully", token: token});
  }
});

app.post('/users/login', (req, res) => {
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    const token = jwt.sign({ username, role: 'user' }, secretKey, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
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
      fs.writeFileSync('users.json', JSON.stringify(USERS));
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
