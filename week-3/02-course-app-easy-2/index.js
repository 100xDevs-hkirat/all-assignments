const express = require('express');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const {
  validate,
  signUpSchema,
  courseSchema,
  updateCourseSchema,
} = require('./validator');

const app = express();

app.use(express.json());
dotenv.config();

let ADMINS = [];
let USERS = [];
let COURSES = [];

const generateJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) ?? null;
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Authentication failed' });
    }
    req.user = user;
    next();
  });
};

const isAdminAuthenticated = (req, res, next) => {
  const { username, password } = req.body;
  const admin = ADMINS.find(
    (admin) => admin.username === username && admin.password === password
  );

  if (admin) next();
  else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
};

const isUserAuthenticated = (req, res, next) => {
  const { username, password } = req.body;
  const user = USERS.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({ message: 'User authentication failed' });
  }
};

// Admin routes
app.post('/admin/signup', validate(signUpSchema), (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { username, password } = req.body;
  const adminFound = ADMINS.find((admin) => admin.username === username);
  if (adminFound) {
    res.status(400).json({ message: 'username not available.' });
  } else {
    ADMINS.push({ username, password });
    const token = generateJWT({ username });

    res.send({ message: 'Admin created successfully.', token });
  }
});

app.post('/admin/login', isAdminAuthenticated, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const token = generateJWT({ username: req.body.username });
  res.setHeader('Authorization', `Bearer ${token}`);
  res.send({ message: 'Logged in successfully.' });
});

app.post(
  '/admin/courses',
  isAuthenticated,
  validate(courseSchema),
  (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const courseBody = req.body;
    const course = { courseId: uuidv4(), ...courseBody };
    COURSES.push(course);
    res.send({
      message: 'Course created successfully.',
      courseId: course.courseId,
    });
  }
);

app.put(
  '/admin/courses/:courseId',
  isAuthenticated,
  validate(updateCourseSchema),
  (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const { courseId } = req.params;
    const updatedCourse = req.body;

    const courseIndex = COURSES.findIndex(
      (course) => course.courseId === courseId
    );
    if (courseIndex !== -1) {
      const course = COURSES[courseIndex];

      COURSES[courseIndex] = { ...course, ...updatedCourse };
      res.send({ message: 'Course updated successfully' });
    } else {
      res.status(404).json({ message: 'course not found.' });
    }
  }
);

app.get('/admin/courses', isAuthenticated, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({ courses: [...COURSES] });
});

// // User routes
app.post('/users/signup', validate(signUpSchema), (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { username } = req.body;
  const userFound = USERS.find((users) => users.username === username);
  if (userFound) {
    res.status(400).json({ message: 'username not available.' });
  } else {
    USERS.push({ ...req.body, purchasedCourses: [] });
    const token = generateJWT({ username });
    res.send({ message: 'User created successfully.', token });
  }
});

app.post('/users/login', isUserAuthenticated, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { username } = req.body;
  const token = generateJWT({ username });
  res.setHeader('Authorization', `Bearer ${token}`);
  res.send({ message: 'Logged in successfully.' });
});

app.get('/users/courses', isAuthenticated, (req, res) => {
  const publishedCourses = COURSES.filter((course) => course.published);
  res.send(publishedCourses);
});

app.post('/users/courses/:courseId', isAuthenticated, (req, res) => {
  const { courseId } = req.params;
  const course = COURSES.find(
    (course) => course.courseId === courseId && course.published
  );
  if (course) {
    const user = USERS.find((user) => user.username === req.user.username);

    if (user) {
      if (!user.purchasedCourses) {
        user.purchasedCourses = [];
      }
      user.purchasedCourses.push(courseId);
      res.send({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'course not found.' });
  }
});

app.get('/users/purchasedCourses', isAuthenticated, (req, res) => {
  const user = USERS.find((user) => user.username === req.user.username);
  if (user && user.purchasedCourses) {
    res.send({ purchasedCourses: user.purchasedCourses });
  } else {
    res.status(404).json({ message: 'No course found' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
