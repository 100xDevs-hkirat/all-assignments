const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secret = 'secret1234';

const generateJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, secret, { expiresIn: '1hr' });
};

// const adminAuthentication = (req, res, next) => {
//   const { username, password } = req.headers;

//   const admin = ADMINS.find(
//     (a) => a.username === username && a.password === password
//   );

//   if (admin) {
//     next();
//   } else {
//     res.status(403).json({ message: 'Admin Authentication failed' });
//   }
// };

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

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
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
    const token = generateJwt(admin);
    res
      .status(200)
      .json({ message: 'Admin created successfully', token: token });
  }
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.headers;

  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );

  if (admin) {
    const token = generateJwt(admin);
    res.status(200).json({ message: 'Admin signed successfully', token });
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
  // logic to log in admin
});

app.post('/admin/courses', authenticateJwt, (req, res) => {
  // logic to create a course
  let course = { ...req.body, id: Date.now() };

  COURSES.push(course);
  res
    .status(200)
    .json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
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

app.get('/admin/courses', authenticateJwt, (req, res) => {
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
    const token = generateJwt(user);
    res.status(200).json({ message: 'user created successfully', token });
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  const token = generateJwt(user);
  if (user) {
    res.status(200).json({ message: 'user signed successfully', token });
  } else {
    res.status(403).json({ message: 'forbidden' });
  }
});

app.get('/users/courses', authenticateJwt, (req, res) => {
  console.log(req.user);
  // logic to list all courses

  res.status(200).json({ courses: COURSES.filter((c) => c.published) });
});

app.post('/users/courses/:courseId', authenticateJwt, (req, res) => {
  // logic to purchase a course
  const courseId = Number(req.params.courseId);
  const course = COURSES.find((c) => c.id === courseId);
  console.log('course', course);
  if (course) {
    const user = USERS.find(u.username === req.user.username);
    if (user) {
      if (!user.purchasedCourse) {
        user.purchasedCourse = [];
      }
      req.user.purchasedCourse.push(courseId);
      console.log('COOURSE', COURSES);
      res.status(200).json({
        message: `Course purchased successfully ${courseId} ${course.id}`,
      });
    } else {
      res.status(403).json({ message: 'user not found' });
    }
  } else {
    res.status(403).json({ message: 'course not found' });
  }
});

app.get('/users/purchasedCourses', authenticateJwt, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find((u) => u.username === req.user.username);
  if (user && user.purchasedCourse) {
    res.status(200).json({ purchasedCourse });
  } else {
    res.status(403).json({ message: 'no purchased course' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
