const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Admin, User, Course } = require('./models');

const {
  validate,
  signUpSchema,
  courseSchema,
  updateCourseSchema,
} = require('./validator');

const app = express();

app.use(express.json());
dotenv.config();

// json error
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).json({ message: 'Invalid JSON payload.' });
  } else {
    next(err);
  }
});

// Connect to db
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log('Connected to DB successfully');
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('mongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('mongoDB connected');
});

//utils
const generateJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 13);
};

const checkPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
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

// Admin routes
app.post('/admin/signup', validate(signUpSchema), async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { username, password } = req.body;
  const admin = await Admin.exists({ username });
  if (admin) {
    res.status(400).json({ message: 'username not available.' });
  } else {
    try {
      const hashedPassword = await hashPassword(password);
      const newAdmin = new Admin({ username, password: hashedPassword });
      await newAdmin.save();
      const token = generateJWT({ username });

      res.send({ message: 'Admin created successfully.', token });
    } catch (err) {
      console.error('Error creating admin:', err);
      res.sendStatus(500);
    }
  }
});

app.post('/admin/login', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (admin) {
      const isValidPassword = await checkPassword(password, admin.password);
      if (isValidPassword) {
        const token = generateJWT({ username: req.body.username });
        res.send({ message: 'Logged in successfully.', token });
      } else {
        res.status(401).json({ message: 'Incorrect username or password' });
      }
    } else {
      res.status(401).json({ message: 'Incorrect username or password' });
    }
  } catch (err) {
    console.error('Error admin login:', err);
    res.sendStatus(500);
  }
});

app.post(
  '/admin/courses',
  isAuthenticated,
  validate(courseSchema),
  async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const course = new Course(req.body);

    try {
      await course.save();
      res.send({
        message: 'Course created successfully.',
        courseId: course.id,
      });
    } catch (err) {
      console.error('Error creating course:', err);
      res.sendStatus(500);
    }
  }
);

app.put(
  '/admin/courses/:courseId',
  isAuthenticated,
  validate(updateCourseSchema),
  async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const { courseId } = req.params;
    const updatedCourse = req.body;

    try {
      const course = await Course.findByIdAndUpdate(courseId, updatedCourse);
      if (course) {
        res.send({ message: 'Course updated successfully' });
      } else {
        res.status(404).json({ message: 'Course not found.' });
      }
    } catch (err) {
      console.error('Error updating course:', err);
      res.sendStatus(500);
    }
  }
);

app.get('/admin/courses', isAuthenticated, async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const courses = await Course.find();
    res.send({ courses });
  } catch (error) {
    console.error('Error fetching courses:', err);
    res.sendStatus(500);
  }
});

// // User routes
app.post('/users/signup', validate(signUpSchema), async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { username, password } = req.body;
  const user = await User.exists({ username });
  if (user) {
    res.status(400).json({ message: 'username not available.' });
  } else {
    try {
      const hashedPassword = await hashPassword(password);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      const token = generateJWT({ username });

      res.send({ message: 'User created successfully.', token });
    } catch (err) {
      console.error('Error creating user:', err);
      res.sendStatus(500);
    }
  }
});

app.post('/users/login', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const isValidPassword = await checkPassword(password, user.password);
      if (isValidPassword) {
        const token = generateJWT({ username: req.body.username });
        res.send({ message: 'Logged in successfully.', token });
      } else {
        res.status(401).json({ message: 'Incorrect username or password' });
      }
    } else {
      res.status(401).json({ message: 'Incorrect username or password' });
    }
  } catch (err) {
    console.error('Error user login:', err);
    res.sendStatus(500);
  }
});

app.get('/users/courses', isAuthenticated, async (req, res) => {
  try {
    const publishedCourses = await Course.find({ published: true });
    res.send(publishedCourses);
  } catch (error) {
    console.error('Error fetching courses:', err);
    res.sendStatus(500);
  }
});

app.post('/users/courses/:courseId', isAuthenticated, async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (course) {
      const user = await User.findOne({ username: req.user.username });

      if (user) {
        user.purchasedCourses.push(courseId);
        await user.save();
        res.send({ message: 'Course purchased successfully' });
      } else {
        res.status(403).json({ message: 'User not found' });
      }
    } else {
      res.status(404).json({ message: 'course not found.' });
    }
  } catch (error) {
    console.error('Error purchasing course:', err);
    res.sendStatus(500);
  }
});

app.get('/users/purchasedCourses', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).populate(
      'purchasedCourses'
    );
    if (user) {
      res.send({ purchasedCourses: user.purchasedCourses });
    } else {
      res.status(404).json({ message: 'No course found' });
    }
  } catch (error) {
    console.error('Error fetching purchased courses:', err);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  connectDB();
  console.log('Server is listening on port 3000');
});
