const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { decode } = require('punycode');
const secretKey = 'password'

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const authenticateJwt = (req, res, next) => {
  const token = req.heaader.authorization?.split('')[1];

  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Authentication failed' });
      }

      req.user = decode;
      next();
    });
  } else {
    res.status(401).json({ message: 'Unauthorized '})
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const {username, password } = req.body;
  if (adminAccounts.some((admin) => admin.username === username)) {
    return res.status(400).json({ message: 'Username already exists'});
  }

  const newAdmin = { username, password };
  ADMINS.push(newAdmin);
  const token = jwt.sign({ username }, secretKey, {expiresIn: '1h'});

  res.status(201).json({ message: 'Admin created successfuly', token});

});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username, password} = req.header;
  if (username === adminCredentials.username && password === adminCredentials.password) {
    const token = jwt.sign({ username }, secretKey, { expireIn: '1h'});

    return res.status(200).json({ message: 'Logged in successfully', token });
  }
  res.status(401).json({ message: 'Authentication failed' });
});


app.post('/admin/courses', authenticateJwt, (req, res) => {
  // logic to create a course
  const { body } = req;

  const newCourse = {
    courseId: courseIdCounter++,
    title: body.title,
    description: body.description,
    price: body.price,
    imageLink: body.imageLink,
    published: body.published,
  };

  COURSES.push(newCourse);

  res.status(201).json({ message: 'COurse created successfully', courseId: newCourse.courseId });
});

app.put('/admin/courses/:courseId',authenticateJwt, (req, res) => {
  // logic to edit a course
  const {params, body} = req;
  const courseId = parseInt(params.courseId);

  if (!courseToUpdate) {
    return res.status(404).json({ message: 'Course not found' });
  }

  courseToUpdate.title = body.title;
  courseToUpdate.description = body.description;
  courseToUpdate.price = body.price;
  courseToUpdate.imageLink = body.imageLink;
  courseToUpdate.published = body.published;

});

app.get('/admin/courses', authenticateJwt, (req, res) => {
  // logic to get all courses
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json({ COURSES });

});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const { username , password} = req.body;
  if (USERS.some((user) => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists'});
  }

  const newUser = { username, password};
  USERS.push(newUser);
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h'});

  res.status(201).json({ message: 'User created successfully', token});


});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;

  const user = USERS.find((u) => u.username === username && u.password === password);

  if (!USERS) {
    return res.status(401).json({ message: 'Authentication failed' });

  }

  const token = jwt.sign({ username }, secretKey, { expireIn: '1h' });

  res.status(200).json({ message: 'Logged in successfully', token});
});

app.get('/users/courses', authenticateJwt, (req, res) => {
  // logic to list all courses
  res.json({ COURSES });
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const{ params } = req;
  const courseId = parseInt(params.courseId);
  const courseToPurchase = COURSES.find((course) => course.id === courseId);
});

app.get('/users/purchasedCourses', authenticateJwt, (req, res) => {
  // logic to view purchased courses
  const userPurchasedCourses = purchasedCourses.filter((course) => course.username === req.user.username);

  res.json({ purchasedCourses: userPurchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
