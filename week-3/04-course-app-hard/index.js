const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Define mongoose schema

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourse: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Courses' }],
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

// Define mongoose models

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Courses', courseSchema);

const secret = 'secret1234';
// connect to mongoose
mongoose.connect(
  `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`
);
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
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  // const admin = ADMINS.find((a) => a.username === username);
  const admin = await Admin.findOne({ username });
  if (admin) {
    res.status(403).json({ message: 'user already exist' });
  } else {
    // const newAdmin = { username, password };
    const newAdmin = new Admin({ username, password });
    // ADMINS.push(newAdmin);
    // fs.writeFileSync('admins.json', JSON.stringify(ADMINS));

    await newAdmin.save();
    const token = jwt.sign({ username, role: 'admin' }, secret, {
      expiresIn: '1h',
    });
    res
      .status(200)
      .json({ message: 'Admin created successfully', token: token });
  }
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.headers;

  // const admin = ADMINS.find(
  //   (a) => a.username === username && a.password === password
  // );

  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, secret, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'Admin signed successfully', token });
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
  // logic to log in admin
});

app.post('/admin/courses', authenticateJwt, async (req, res) => {
  // logic to create a course
  // let course = { ...req.body};

  // COURSES.push(course);
  // fs.writeFileSync('courses.json', JSON.stringify(COURSES), 'utf8');

  const course = new Course(req.body);
  await course.save();
  res
    .status(200)
    .json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
  // logic to edit a course
  // const id = parseInt(req.params.courseId);
  // const course=COURSES.find(c=>c.id===id)
  // const courseIndex = COURSES.findIndex((c) => c.id === id);
  // if (courseIndex === -1) {
  //   res.status(403).json({ message: 'course not available' });
  // } else {
  //   COURSES[courseIndex] = { ...COURSES[courseIndex], ...req.body };
  //   fs.writeFileSync('courses.json', JSON.stringify(COURSES), 'utf8');
  //   console.log(COURSES);
  //   res.status(403).json({ message: 'course updated successfully' });
  // }
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
  });
  if (course) {
    res.json({ message: 'Course Updated Successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authenticateJwt, async (req, res) => {
  // logic to get all courses
  const course = await Course.find({});
  res.status(200).json({ course });
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;

  // const existingUser = USERS.find((u) => u.username === username);

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.status(403).json({ message: 'user already exists' });
  } else {
    const newUser = { username, password };
    USERS.push(newUser);
    // console.log(USERS);
    // fs.writeFileSync('users.json', JSON.stringify(USERS));
    const user = new User(newUser);
    await user.save();
    const token = jwt.sign({ username, role: 'user' }, secret, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'user created successfully', token });
  }
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  // const user = USERS.find(
  //   (u) => u.username === username && u.password === password
  // );

  const user = await User.findOne({ username, password });

  if (user) {
    const { username, password } = user;
    const token = jwt.sign({ username, role: 'user' }, secret, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'user signed successfully', token });
  } else {
    res.status(403).json({ message: 'forbidden' });
  }
});

app.get('/users/courses', authenticateJwt, async (req, res) => {
  console.log(req.user);
  // logic to list all courses
  const course = await Course.find({ published: true });

  res.status(200).json({ courses: course });
});

app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
  // logic to purchase a course
  // const courseId = Number(req.params.courseId);
  // const course = COURSES.find((c) => c.id === courseId);
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  console.log('course', course);
  if (course) {
    // const user = USERS.find((u) => u.username === req.user.username);
    const { username, password } = req.user;
    const user = await User.findOne({ username });
    if (user) {
      user.purchasedCourse.push(course);
      // fs.writeFileSync('users.json', JSON.stringify(USERS));
      await user.save();
      res.status(200).json({
        message: `Course purchased successfully ${courseId} ${course.id}`,
      });
      console.log('COOURSE', user);
    } else {
      res.status(403).json({ message: 'user not found' });
    }
  } else {
    res.status(403).json({ message: 'course not found' });
  }
});

app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {
  // logic to view purchased courses
  // const user = USERS.find((u) => u.username === req.user.username);
  const user = await User.findOne({ username: req.user.username }).populate(
    'purchasedCourse'
  );
  if (user) {
    res.status(200).json({ purchasedCourse: user.purchasedCourse || [] });
  } else {
    res.status(403).json({ message: 'no purchased course' });
  }
});
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
