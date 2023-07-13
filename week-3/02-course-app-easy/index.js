const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;

  const admin = ADMINS.find(a => (a.username === username && a.password === password));
  if (!admin) {
    return res.status(403).json({ message: 'Admin authentication failed' })
  }
  next()
}

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;

  const user = USERS.find(a => (a.username === username && a.password === password));
  if (!user) {
    return res.status(403).json({ message: 'User authentication failed' })
  }
  // console.log(user);
  req.user = user
  next()
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  const { username, password } = req.body;
  const existingAdmin = ADMINS.find(a => a.username === username)
  if (existingAdmin) {
    return res.status(403).json({ message: 'Admin already exists from post' });
  }
  ADMINS.push(req.body);
  res.json({ message: 'Admin created successfully' })
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  res.json({ message: 'Logged in successfully' });
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  const course = req.body;
  course.id = COURSES.length + 1;

  COURSES.push(course);
  res.json({ message: 'Course created successfully', courseId: course.id })
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(a => courseId === a.id)
  if (course) {
    Object.assign(course, req.body);
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', adminAuthentication, (req, res) => {
  res.json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  const { username, password } = req.body;
  const user = { ...req.body, purchasedCourse: [] }
  // console.table(user);
  const existingUser = USERS.find(a => a.username === username)
  if (existingUser) {
    return res.status(403).json({ message: 'User already exists' });
  }
  USERS.push(user);
  res.json({ message: 'User created successfully' })
});

app.post('/users/login', userAuthentication, (req, res) => {
  res.json({ message: 'Logged in successfully' });
});

app.get('/users/courses', userAuthentication, (req, res) => {
  const filteredCourses = COURSES.filter(e => e.published)
  res.json({ courses: filteredCourses })
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(a => (a.id === courseId && a.published))
  if (course) {
    req.user.purchasedCourse.push(courseId);

    // console.log(req.user.purchasedCourse);
    res.json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: "Course not found" })
  }
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  var purchasedCourseId = COURSES.filter(a => req.user.purchasedCourse.includes(a.id))
  res.json(purchasedCourseId)
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
