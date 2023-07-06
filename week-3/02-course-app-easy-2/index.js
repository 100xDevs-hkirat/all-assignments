const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey1 = "bittuisthepowerofmyenergy";
const secretKey2 = "bittulove";

const generateJwtAdmin = (admin) => {
  const payload = { username: user.username };
  return jwt.sign(payload.secretKey1, {
    expiresIn: '1h'
  });
};

const generateJwtUser = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload.secretKey2, {
    expiresIn: '1h'
  });
};

const authenticateJwtAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey1, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res, sendStatus(401);
  }
};
const authenticateJwtUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey2, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res, sendStatus(401);
  }
};
// Admin routes
app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({
      message: 'Admin already exists'
    });
  } else {
    ADMINS.push(admin);
    const token = generateJwtAdmin(admin);
    res.json({
      message: 'Admin created successfully',
      token
    });
  }
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if (admin) {
    const token = generateJwtAdmin(admin);
    res.json({
      message: 'Logged in successfully',
      token
    });
  } else {
    res.status(403).json({
      message: 'Admin authentication failed'
    });
  }
});

app.post('/admin/courses', authenticateJwtAdmin, (req, res) => {
  const course = req.body;
  course.id = Date.now();
  COURSES.push(course);
  res.json({
    message: 'Course created successfully',
    courseID: course.id
  });
});

app.put('/admin/courses/:courseId', authenticateJwtAdmin, (req, res) => {
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

app.get('/admin/courses', authenticateJwtAdmin, (req, res) => {
  res.json({ courses: COURSES });
});

app.post('/users/signup', (req, res) => {
  const user = req.body;
  const existingUser = USERS.find(u => u.username === user.username);
  if (existingUser) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    USERS.push(user);
    const token = generateJwtUser(user);
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', (req, res) => {
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    const token = generateJwtUser(user);
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
});

app.get('/users/courses', authenticateJwtUser, (req, res) => {
  res.json({ courses: COURSES });
});

app.post('/users/courses/:courseId', authenticateJwtUser, (req, res) => {
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

app.get('/users/purchasedCourses', authenticateJwtUser, (req, res) => {
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
