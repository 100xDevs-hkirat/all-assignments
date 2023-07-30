const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminSecretKey = "abc";
const userSecretKey = "abcd";

const generateTokenAdmin = (admin) => {
  const payload = { username : admin.username,};
  return jwt.sign(payload,adminSecretKey, {expiresIn : '1h'});
}

const authenticateJwtAdmin = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, adminSecretKey , (err , admin) => {
    if(err) {
      res.sendStatus(403);
    }
    req.admin = admin;
    next();
  });
}

const generateTokenUser = (user) => {
  const payload = { username : user.username,};
  return jwt.sign(payload,userSecretKey, {expiresIn : '1h'});
}

const authenticateJwtUser = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, userSecretKey , (err , user) => {
    if(err) {
      res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const adminExisting = ADMINS.find(a => a.username === admin.username);
  if(adminExisting) {
    res.status(403).json({message : "admin already exists" });
  } else {
    ADMINS.push(admin);
    const token = generateTokenAdmin(admin);
    res.json({ message: 'Admin created successfully', token: token});
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username , password} = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);

  if(admin) {
    const token = generateTokenAdmin(admin);
    res.json({ message: 'Logged in successfully', token: token});
  } else {
    res.status(403).json({message : "Admin authentication failed" });
  }
});

app.post('/admin/courses', authenticateJwtAdmin, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = COURSES.length + 1;
  COURSES.push(course);
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', authenticateJwtAdmin, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const courseIndex = COURSES.findIndex(c => c.id === courseId);

  if(courseId !== -1) {
    const updatedCourse = {...COURSES[courseIndex], ...req.body};
    COURSES[courseIndex] = updatedCourse;
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }

});

app.get('/admin/courses', authenticateJwtAdmin, (req, res) => {
  // logic to get all courses
  res.json({courses : COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = req.body;
  const userExisting = USERS.find(a => a.username === user.username);
  if(userExisting) {
    res.status(403).json({message : "User already exists" });
  } else {
    USERS.push(user);
    const token = generateTokenUser(user);
    res.json({ message: 'User created successfully', token: token});
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const {username , password} = req.headers;
  const user = USERS.find(a => a.username === username && a.password === password);

  if(user) {
    const token = generateTokenUser(user);
    res.json({ message: 'Logged in successfully', token: token});
  } else {
    res.status(403).json({message : "User authentication failed" });
  }

});

app.get('/users/courses', authenticateJwtUser, (req, res) => {
  // logic to list all courses
  res.json({courses : COURSES});
});

app.post('/users/courses/:courseId', authenticateJwtUser, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);

  if(course) {
    const user = USERS.find(a => a.username === req.user.username);
    if(user) {
      if(!user.purchasedCourses) {
        user.purchasedCourses = [];
      }
      user.purchasedCourses.push(course);
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(403).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', authenticateJwtUser, (req, res) => {
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
