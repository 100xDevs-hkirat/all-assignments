const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

try {
  ADMINS = JSON.parse(fs.readFile("admin.json", "utf8"));
} catch {
  ADMINS = [];
}
try {
  USERS = JSON.parse(fs.readFile("user.json", "utf8"));
} catch {
  USERS = [];
}

try {
  COURSES = JSON.parse(fs.readFile("course.json", "utf8"));
} catch {
  COURSES = [];
}
console.log(ADMINS);
console.log(USERS);
console.log(COURSES);
const SECRET = "Akhilesh";

function authenticateJWT(req, res, next) {
  var authorization = req.headers.authorization;
  if (authorization) {
    var token = authorization.split(' ')[1];
    jwt.verify(token, SECRET, (err, data) => {
      if (err) {
        console.log(err);
        res.send("Could not verify the JSON web token");
      } else {
        res.user = data;
        next;
      }
    });
  } else {
    res.send("Could not find the right authorization header");
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const admin = ADMINS.find(a => a.username === username);
  console.log("admin signup");
  if (admin) {
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    const newAdmin = { username, password };
    ADMINS.push(newAdmin);
    fs.writeFileSync('admins.json', JSON.stringify(ADMINS));
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Admin created successfully', token });
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.post('/admin/courses', authenticateJWT, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = COURSES.length + 1;
  COURSES.push(course);
  fs.writeFileSync('courses.json', JSON.stringify(COURSES));
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', authenticateJWT, (req, res) => {
  // logic to edit a course
  const course = COURSES.find(c => c.id === parseInt(req.params.courseId));
  if (course) {
    Object.assign(course, req.body);
    fs.writeFileSync('courses.json', JSON.stringify(COURSES));
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authenticateJWT, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username);
  if (user) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    const newUser = { username, password };
    USERS.push(newUser);
    fs.writeFileSync('users.json', JSON.stringify(USERS));
    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.get('/users/courses', authenticateJWT, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES });
});

app.post('/users/courses/:courseId', authenticateJWT, (req, res) => {
  // logic to purchase a course
  const course = COURSES.find(c => c.id === parseInt(req.params.courseId));
  if (course) {
    const user = USERS.find(u => u.username === req.user.username);
    if (user) {
      if (!user.purchasedCourses) {
        user.purchasedCourses = [];
      }
      user.purchasedCourses.push(course);
      fs.writeFileSync('users.json', JSON.stringify(USERS));
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', authenticateJWT, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find(u => u.username === req.user.username);
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
