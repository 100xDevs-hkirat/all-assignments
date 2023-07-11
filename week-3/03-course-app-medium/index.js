const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const JWT_TOKEN_SECRET = 'secret';
let ADMINS = [];
let USERS = [];
let COURSES = [];

try {
  ADMINS = JSON.parse(
    fs.readFileSync(path.join(__dirname, './admins.json'), 'utf-8') || '[]'
  );
  USERS = JSON.parse(
    fs.readFileSync(path.join(__dirname, './users.json'), 'utf-8') || '[]'
  );
  COURSES = JSON.parse(
    fs.readFileSync(path.join(__dirname, './courses.json'), 'utf-8') || '[]'
  );
} catch (error) {
  console.log(error);
  process.exit(1);
}

function createJWT(username) {
  return jwt.sign({ username }, JWT_TOKEN_SECRET, {
    expiresIn: '1h',
  });
}

function authJWT(credentialsArray) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      jwt.verify(token, JWT_TOKEN_SECRET, (err, data) => {
        if (!err) {
          res.locals.user = credentialsArray.find(
            (u) => u.username === data.username
          );
        }
        if (err || !res.locals.user) {
          res.sendStatus(401);
        } else {
          next();
        }
      });
    } else {
      res.sendStatus(401);
    }
  };
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  if (ADMINS.find((a) => a.username === admin.username)) {
    res
      .status(409)
      .json({ message: 'Admin with this username already exists' });
  } else {
    ADMINS.push(admin);
    fs.writeFileSync(
      path.join(__dirname, './admins.json'),
      JSON.stringify(ADMINS)
    );
    res.status(201).json({
      message: 'Admin created successfully',
      token: createJWT(admin.username),
    });
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const admin = ADMINS.find(
    (a) => a.username === req.body.username && a.password === req.body.password
  );
  if (admin) {
    res.json({
      message: 'Logged in successfully',
      token: createJWT(admin.username),
    });
  } else {
    res.status(401).send({ message: 'Invalid username / password' });
  }
});

app.post('/admin/courses', authJWT(ADMINS), (req, res) => {
  // logic to create a course
  const course = { ...req.body, courseId: Date.now() };
  COURSES.push(course);
  fs.writeFileSync(
    path.join(__dirname, './courses.json'),
    JSON.stringify(COURSES)
  );
  res.status(201).json({
    message: 'Course created successfully',
    courseId: course.courseId,
  });
});

app.put('/admin/courses/:courseId', authJWT(ADMINS), (req, res) => {
  // logic to edit a course
  const course = COURSES.find(
    (c) => c.courseId === parseInt(req.params.courseId)
  );
  if (course) {
    Object.assign(course, req.body);
    fs.writeFileSync(
      path.join(__dirname, './courses.json'),
      JSON.stringify(COURSES)
    );
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authJWT(ADMINS), (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = req.body;
  if (USERS.find((u) => u.username === user.username)) {
    res.status(409).json({ message: 'User with this username already exists' });
  } else {
    USERS.push({ ...user, purchaseCourses: [] });
    fs.writeFileSync(
      path.join(__dirname, './users.json'),
      JSON.stringify(USERS)
    );
    res.status(201).json({
      message: 'User created successfully',
      token: createJWT(user.username),
    });
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const user = USERS.find(
    (u) => u.username === req.body.username && u.password === req.body.password
  );
  if (user) {
    res.json({
      message: 'Logged in successfully',
      token: createJWT(user.username),
    });
  } else {
    res.status(401).send({ message: 'Invalid username / password' });
  }
});

app.get('/users/courses', authJWT(USERS), (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES.filter((course) => course.published) });
});

app.post('/users/courses/:courseId', authJWT(USERS), (req, res) => {
  // logic to purchase a course
  const course = COURSES.find(
    (c) => c.courseId === parseInt(req.params.courseId)
  );
  if (course) {
    res.locals.user.purchaseCourses.push(course.courseId);
    fs.writeFileSync(
      path.join(__dirname, './users.json'),
      JSON.stringify(USERS)
    );
    res.json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', authJWT(USERS), (req, res) => {
  // logic to view purchased courses
  const purchaseCourses = res.locals.user.purchaseCourses.map((courseId) =>
    COURSES.find((course) => course.courseId === courseId)
  );
  res.json({ purchaseCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
