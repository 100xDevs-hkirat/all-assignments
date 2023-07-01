const express = require('express');
const app = express();

app.use(express.json());

const ADMINS = [];
const USERS = [];
const COURSES = [];

function auth(credentialsArray) {
  return (req, res, next) => {
    const { username, password } = req.headers;
    const user = credentialsArray.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      res.locals.user = user;
      next();
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
    res.status(201).json({ message: 'Admin created successfully' });
  }
});

app.post('/admin/login', auth(ADMINS), (req, res) => {
  // logic to log in admin
  res.json({ message: 'Logged in successfully' });
});

app.post('/admin/courses', auth(ADMINS), (req, res) => {
  // logic to create a course
  const course = { ...req.body, courseId: Date.now() };
  COURSES.push(course);
  res.status(201).json({
    message: 'Course created successfully',
    courseId: course.courseId,
  });
});

app.put('/admin/courses/:courseId', auth(ADMINS), (req, res) => {
  // logic to edit a course
  const course = COURSES.find(
    (c) => c.courseId === parseInt(req.params.courseId)
  );
  if (course) {
    Object.assign(course, req.body);
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', auth(ADMINS), (req, res) => {
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
    res.status(201).json({ message: 'User created successfully' });
  }
});

app.post('/users/login', auth(USERS), (req, res) => {
  // logic to log in user
  res.json({ message: 'Logged in successfully' });
});

app.get('/users/courses', auth(USERS), (req, res) => {
  // logic to list all courses
  res.json({ course: COURSES.filter((course) => course.published) });
});

app.post('/users/courses/:courseId', auth(USERS), (req, res) => {
  // logic to purchase a course
  const course = COURSES.find(
    (c) => c.courseId === parseInt(req.params.courseId)
  );
  if (course) {
    res.locals.user.purchaseCourses.push(course.courseId);
    res.json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', auth(USERS), (req, res) => {
  // logic to view purchased courses
  const purchaseCourses = res.locals.user.purchaseCourses.map((courseId) =>
    COURSES.find((course) => course.courseId === courseId)
  );
  res.json({ purchaseCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
