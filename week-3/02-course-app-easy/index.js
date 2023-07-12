const express = require('express');

const { v4: uuidv4 } = require('uuid');

const {
  validate,
  signUpSchema,
  courseSchema,
  updateCourseSchema,
} = require('./validator');

const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const isAdminAuthenticated = (req, res, next) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (admin) => admin.username === username && admin.password === password
  );

  if (admin) next();
  else {
    res.status(401).json({ message: 'Incorrect username and password' });
  }
};

const isUserAuthenticated = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({ message: 'Incorrect username or password' });
  }
};

// Admin routes
app.post('/admin/signup', validate(signUpSchema), (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { username, password } = req.body;
  const adminFound =
    ADMINS.find((admin) => admin.username === username) ?? null;
  if (!adminFound) {
    ADMINS.push({ username, password });
    res.send({ message: 'Admin created successfully.' });
  } else {
    res.status(400).json({ message: 'username not available.' });
  }
});

app.post('/admin/login', isAdminAuthenticated, (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  res.send({ message: 'Logged in successfully.' });
});

app.post(
  '/admin/courses',
  isAdminAuthenticated,
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
  isAdminAuthenticated,
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

app.get('/admin/courses', isAdminAuthenticated, (req, res) => {
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
    res.send({ message: 'User created successfully.' });
  }
});

app.post('/users/login', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { username, password } = req.headers;
  const userFound = USERS.find(
    (user) => user.username === username && user.password === password
  );
  if (userFound) {
    res.send({ message: 'Logged in successfully.' });
  } else {
    res.status(400).json({ message: 'Incorrect username or password.' });
  }
});

app.get('/users/courses', isUserAuthenticated, (req, res) => {
  const publishedCourses = COURSES.filter((course) => course.published);
  res.send(publishedCourses);
});

app.post('/users/courses/:courseId', isUserAuthenticated, (req, res) => {
  const { courseId } = req.params;
  const course = COURSES.find(
    (course) => course.courseId === courseId && course.published
  );
  if (course) {
    req.user.purchasedCourses.push(courseId);
    res.send({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'course not found.' });
  }
});

app.get('/users/purchasedCourses', isUserAuthenticated, (req, res) => {
  const purchasedCourses = COURSES.filter((course) =>
    req.user.purchasedCourses.includes(course.courseId)
  );
  res.send({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
