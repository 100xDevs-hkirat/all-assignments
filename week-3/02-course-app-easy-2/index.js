const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const generateToken = (credentials) =>
  jwt.sign(credentials, 'S3cr3tK1Y', { expiresIn: '1h' });

// const verifyToken = (token) => jwt.verify(token, 'S3cr3tK1Y');

const validateLoginForAdmins = (req, res, next) => {
  const { username, password } = req.headers;
  const existingAdmin = ADMINS.find(
    (admin) => admin.username === username && admin.password === password
  );

  if (existingAdmin) {
    req.token = generateToken({ username, password });
    next();
  } else {
    return res.sendStatus(403);
  }
};

const validateLoginForUsers = (req, res, next) => {
  const { username, password } = req.headers;
  const existingUser = USERS.find(
    (user) => user.username === username && user.password === password
  );

  if (existingUser) {
    req.token = generateToken({ username, password });
    next();
  } else {
    return res.sendStatus(403);
  }
};

const adminAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'S3cr3tK1Y', (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    return res.sendStatus(401);
  }
};

const userAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'S3cr3tK1Y', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = USERS.find((usr) => usr.username === user.username);
      if (req.user) {
        next();
      } else {
        return res.sendStatus(404);
      }
    });
  } else {
    return res.sendStatus(401);
  }
};

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const existingAdmin = ADMINS.find((admin) => admin.username === username);

  if (existingAdmin) {
    return res.status(403).json({ message: 'Admins already exists' });
  } else {
    const credentials = { username, password };
    const token = generateToken(credentials);
    ADMINS.push({ ...credentials, token });
    return res.status(200).json({
      message: 'Admin created successfully',
      token
    });
  }
});

app.post('/admin/login', validateLoginForAdmins, (req, res) => {
  // logic to log in admin
  return res.status(200).json({
    message: 'Logged in success fully',
    token: req.token
  });
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

  const { username, password } = req.body;
  const existingUser = USERS.find((user) => user.username === username);

  if (existingUser) {
    return res.status(403).json({ message: 'Users already exists' });
  } else {
    const credentials = { username, password };
    USERS.push({ ...credentials, purchasedCourses: [] });
    const token = generateToken(credentials);
    return res
      .status(200)
      .json({ message: 'Users created successfully', token });
  }
});

app.post('/users/login', validateLoginForUsers, (req, res) => {
  // logic to log in user
  return res
    .status(200)
    .json({ message: 'Logged in successfully', token: req.token });
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
