const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (admin) => admin.username === username && admin.password === password
  );
  if (admin) {
    next();
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
};

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
};

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin

  const existingAdmin = ADMINS.find(
    (admin) => admin.username === req.body.username
  );

  if (existingAdmin) {
    return res.status(403).json({ message: 'Admins already exists' });
  } else {
    ADMINS.push(req.body);
    return res.status(200).json({ message: 'Admin created successfully' });
  }
});

app.post('/admin/login', adminAuthentication, (_req, res) => {
  // logic to log in admin
  return res.status(200).json({ message: 'Logged in successfully' });
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
  const { title, description, price, imageLink, published } = req.body;
  const courseId = Date.now();
  COURSES.push({ title, description, price, imageLink, published, courseId });

  return res
    .status(200)
    .json({ message: 'Course created successfully', courseId });
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to edit a course

  const { title, description, price, imageLink, published } = req.body;
  const courseId = Number(req.params.courseId);
  const existingCourse = COURSES.find((course) => course.courseId === courseId);

  if (existingCourse) {
    Object.assign(existingCourse, {
      courseId,
      title,
      description,
      price,
      imageLink,
      published
    });

    return res.status(200).json({ message: 'Course updated successfully' });
  }

  return res.status(404).json({ message: 'Course not found' });
});

app.get('/admin/courses', adminAuthentication, (_req, res) => {
  // logic to get all courses
  return res.status(200).json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const existingUser = USERS.find(
    (user) => user.username === req.body.username
  );

  if (existingUser) {
    return res.status(403).json({ message: 'Users already exists' });
  } else {
    USERS.push({ ...req.body, purchasedCourses: [] });
    return res.status(200).json({ message: 'Users created successfully' });
  }
});

app.post('/users/login', userAuthentication, (req, res) => {
  // logic to log in user
  return res.status(200).json({ message: 'Logged in successfully' });
});

app.get('/users/courses', userAuthentication, (req, res) => {
  // logic to list all courses
  return res
    .status(200)
    .json({ courses: COURSES.filter((course) => course.published) });
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  // logic to purchase a course
  const courseId = Number(req.params.courseId);
  const course = COURSES.find(
    (course) => course.courseId === courseId && course.published
  );
  if (course) {
    req.user.purchasedCourses.push(courseId);
    return res.json({ message: 'Course purchased successfully' });
  } else {
    return res
      .status(404)
      .json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  // logic to view purchased courses
  const purchasedCourses = COURSES.filter((course) =>
    req.user.purchasedCourses.includes(course.courseId)
  );
  return res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
