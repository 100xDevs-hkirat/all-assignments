const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// middelwares
const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;

  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );

  if (admin) {
    next();
  } else {
    res.status(403).json({ message: 'Admin Authentication failed' });
  }
};

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    req.user = user; //add user to
    next();
  } else {
    res.status(403).json({ message: 'user authentication failed' });
  }
};

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find((a) => a.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({ message: 'user already exist' });
  } else {
    ADMINS.push(admin);
    res.status(200).json({ message: 'Admin created successfully' });
  }
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({ message: 'Admin signed successfully' });
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
  let course = { ...req.body, id: Date.now() };

  COURSES.push(course);
  res
    .status(200)
    .json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to edit a course
  const id = parseInt(req.params.courseId);
  // const course=COURSES.find(c=>c.id===id)
  const courseIndex = COURSES.findIndex((c) => c.id === id);
  if (courseIndex === -1) {
    res.status(403).json({ message: 'course not available' });
  } else {
    COURSES[courseIndex] = { ...COURSES[courseIndex], ...req.body };
    console.log(COURSES);
    res.status(403).json({ message: 'course updated successfully' });
  }
});

app.get('/admin/courses', adminAuthentication, (req, res) => {
  // logic to get all courses
  res.status(200).json({ courseDetails: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = req.body;

  const existingUser = USERS.find((u) => u.username === user.username);

  if (existingUser) {
    res.status(403).json({ message: 'user already exists' });
  } else {
    USERS.push({ ...user, purchasedCourse: [] });
    console.log(USERS);
    res.status(200).json({ message: 'user created successfully' });
  }
});

app.post('/users/login', userAuthentication, (req, res) => {
  // logic to log in user
  res.status(200).json({ message: 'user signed successfully' });
});

app.get('/users/courses', userAuthentication, (req, res) => {
  console.log(req.user);
  // logic to list all courses

  res.status(200).json({ courses: COURSES.filter((c) => c.published) });
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  // logic to purchase a course
  const courseId = Number(req.params.courseId);
  const course = COURSES.find((c) => c.id === courseId);
  console.log('course', course);
  if (course) {
    req.user.purchasedCourse.push(courseId);
    console.log('COOURSE', COURSES);
    res.status(200).json({
      message: `Course purchased successfully ${courseId} ${course.id}`,
    });
  } else {
    res
      .status(403)
      .json({ message: `No item on the given course id : ${c_id}` });
  }
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  // logic to view purchased courses
  var purchasedCourse = COURSES.filter((p) =>
    req.user.purchasedCourse.includes(p.id)
  );
  res.status(200).json({ purchasedCourse });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
