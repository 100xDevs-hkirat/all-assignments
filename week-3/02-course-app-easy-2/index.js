const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey = "Course_selling_app_41"

// Functions 
const generateJwt = (username) => {
  const payload = { username }
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
  return token;
}

const authenticateJwt = (req, res, next) => {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    jwt.verify(token, secretKey, (error, user) => {
      if (error) {
        res.status(403).send("Authentication failed");
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401);
  }
}

// Admin routes

app.post('/admin/signup', (req, res) => {
  const { username, password } = req.body;
  const existingAdmin = ADMINS.find(a => a.username === username);
  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" })
  } else {
    ADMINS.push({ username, password });
    const token = generateJwt(username)
    res.json({ message: "Admin created successfully", token })
  }
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.headers;
  const existingAdmin = ADMINS.find(a => a.username === username && a.password === password);
  if (!existingAdmin) {
    res.status(403).json({ message: "Admin does not exists" })
  } else {
    const token = generateJwt(username)
    res.json({ message: "Logged in successfully", token })
  }
});

app.post('/admin/courses', authenticateJwt, (req, res) => {
  var course = req.body
  course.id = COURSES.length + 1;
  COURSES.push(req.body);
  res.json({ message: 'Course created successfully', courseId: course.id })
});

app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
  var courseId = parseInt(req.params.courseId);
  var course = COURSES.find(c => c.id === courseId)
  if (!course) {
    res.status(404).json({ message: "Course Not found" })
  } else {
    Object.assign(course, req.body);
    res.json({ message: 'Course updated successfully' })
  }
});

app.get('/admin/courses', authenticateJwt, (req, res) => {
  res.json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  const { username, password } = req.body;
  const existingUser = USERS.find(a => a.username === username);
  if (existingUser) {
    res.status(403).json({ message: "User already exists" })
  } else {
    USERS.push({ username, password, purchasedCourses: [] });
    const token = generateJwt(username)
    res.json({ message: "User created successfully", token })
  }
});

app.post('/users/login', (req, res) => {
  const { username, password } = req.headers;
  const existingUser = USERS.find(a => a.username === username && a.password === password);
  if (!existingUser) {
    res.status(403).json({ message: "Admin does not exists" })
  } else {
    const token = generateJwt(username)
    res.json({ message: "Logged in successfully", token })
  }
});

app.get('/users/courses', authenticateJwt,(req, res) => {
  var availableCourses = COURSES.filter(a => a.published)
  res.json({ Courses: availableCourses })
});

app.post('/users/courses/:courseId',authenticateJwt, (req, res) => {
  var courseId = parseInt(req.params.courseId);
  var course = COURSES.find(c => c.id === courseId && c.published)
  if (course) {
    var user = USERS.find(a => a.username === req.user.username)
    if (user) {
      user.purchasedCourses.push(course);
      res.json({ message: 'Course purchased successfully' })
    } else {
      res.status(403).json({ message: "User not found" })
    }
  } else {
    res.status(404).json({ message: "Course not found" })
  }
});

app.get('/users/purchasedCourses',authenticateJwt, (req, res) => {
  // logic to view purchased courses
  var user = USERS.find(u => u.username === req.user.username)
  if (user && user.purchasedCourses) {
    res.json({ purchasedCourses: user.purchasedCourses })
  } else {
    res.status(404).json("No purchased Course")
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
