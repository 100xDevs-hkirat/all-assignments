const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const lodash = require('lodash');

const app = express();
const PORT = 3000;

const jwtSecret = 'dev-jwt-secret';

const { mongoUrl } = require('./config');

console.log(mongoUrl, 'mongo');
const { Admin, Course, User } = require('./models');

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('connected to mongo');
  })
  .catch((e) => {
    console.log('error in connecting to mongo');
  });

const COURSE_PROPS = [
  'title',
  'description',
  'price',
  'imageLink',
  'published',
];

const COURSE_RES_PROPS = [...COURSE_PROPS, 'id'];

// ADMIN middleware

function authenticateJwt(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({
      message: 'Missing Authorization Headers',
      code: 'token_missing',
    });
  }

  try {
    const decryptedJwt = jwt.verify(authorization, jwtSecret);
    req.user = decryptedJwt;
    next();
  } catch (e) {
    return res
      .status(401)
      .send({ message: 'Token expired', code: 'token_expired' });
  }
}

function adminMiddleware(req, res, next) {
  const { role } = req.user;

  if (role !== 'admin') {
    return res.status(403).send({ message: 'Access restricted' });
  }

  next();
}

// Admin routes
app.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send({ message: 'Username and Password are required' });
  }

  const adminFromDb = await Admin.findOne({ username });

  if (adminFromDb) {
    return res.status(409).send({ message: 'User exists' });
  }

  const newAdmin = new Admin({ username, password });

  // payload should be object when expiresIn is used
  const token = jwt.sign({ username, role: 'admin' }, jwtSecret, {
    expiresIn: '1h', // expires in 1hour
  });

  await newAdmin.save();

  res
    .status(200)
    .send({ message: 'Admin created successfully', token, role: 'admin' });
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.headers;

  if (!username || !password) {
    return res
      .status(400)
      .send({ message: 'Username and Password are required' });
  }

  const adminFromDb = await Admin.findOne({ username, password });

  if (!adminFromDb) {
    return res.status(401).send({ message: 'Invalid username or password' });
  }

  // payload should be object when expiresIn is used
  const token = jwt.sign({ username, role: 'admin' }, jwtSecret, {
    expiresIn: '1h', // expires in 1hour
  });

  res.send({ message: 'Logged in successfully', token, role: 'admin' });
});

app.post(
  '/admin/courses',
  authenticateJwt,
  adminMiddleware,
  async (req, res) => {
    const { username } = req.user;

    const newCourse = new Course(req.body);

    const adminFromDb = await Admin.findOne({ username });

    newCourse.instructorId = adminFromDb._id;

    try {
      const createdCourse = await newCourse.save();
      res.send({
        message: 'Course created successfully',
        courseId: createdCourse._id,
      });
    } catch (e) {
      res.status(401).send({ message: 'All properties are required' });
    }
  }
);

app.put(
  '/admin/courses/:courseId',
  authenticateJwt,
  adminMiddleware,
  async (req, res) => {
    const { courseId } = req.params;
    const body = req.body;

    if (COURSE_PROPS.every((prop) => body[prop] === undefined)) {
      return res.status(400).send({ message: 'Atleast one field required' });
    }

    const updatedCourse = {};

    // this ensures only title, description, .. are only updated
    COURSE_PROPS.forEach((prop) => {
      if (body[prop] !== undefined) {
        updatedCourse[prop] = body[prop];
      }
    });

    try {
      const newUpdatedCourseFromDb = await Course.findByIdAndUpdate(
        courseId,
        updatedCourse,
        {
          new: true,
        }
      );

      if (!newUpdatedCourseFromDb) {
        return res.status(401).send({ message: 'Course not found' });
      }

      res.send({ message: 'Course updated successfully' });
    } catch (e) {
      console.log(e, 'catch error: update course');
      return res.status(500).send({ message: 'Something went wrong' });
    }
  }
);

app.get(
  '/admin/courses',
  authenticateJwt,
  adminMiddleware,
  async (req, res) => {
    const { username } = req.user;

    const adminFromDb = await Admin.findOne({ username });

    // if(!adminFromDb)

    const coursesByAdmin = await Course.find({ instructorId: adminFromDb._id });

    const coursesResponse = coursesByAdmin.map((course) => ({
      id: course._id,
      ...lodash.pick(course, COURSE_PROPS),
    }));

    return res.send({ courses: coursesResponse });
  }
);

// <-------------------- Admin DEV Route -------------------->
app.get('/admins', async (req, res) => {
  const { 'dev-mode': devMode } = req.headers;

  if (!devMode) {
    return res.send(401);
  }

  const dbRes = await Admin.find();

  res.send(dbRes);
});

// <-------------------- User routes -------------------->
app.post('/users/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send({ message: 'Username and Password are required' });
  }

  const userFromDb = await User.findOne({ username });

  if (userFromDb) {
    return res.status(409).send({ message: 'User exists' });
  }

  const newUser = new User({ username, password });

  await newUser.save();

  // generate token
  const token = jwt.sign({ username, role: 'user' }, jwtSecret, {
    expiresIn: '1h',
  });

  res
    .status(200)
    .send({ message: 'User created successfully', token, role: 'user' });
});

app.post('/users/login', async (req, res) => {
  const { username, password } = req.headers;

  if (!username || !password) {
    return res
      .status(400)
      .send({ message: 'Username and Password are required' });
  }

  const userFromDb = await User.findOne({ username, password });

  if (!userFromDb) {
    return res.status(401).send({ message: 'Invalid username or password' });
  }

  // generate token
  const token = jwt.sign({ username, role: 'user' }, jwtSecret, {
    expiresIn: '1h',
  });

  res.send({ message: 'Logged in successfully', token, role: 'user' });
});

app.get('/users/courses', authenticateJwt, async (req, res) => {
  const publishedCourses = await Course.find({ published: true });

  const coursesResponse = publishedCourses.map((c) => {
    return COURSE_RES_PROPS.reduce((acc, prop) => {
      acc[prop] = c[prop];
      return acc;
    }, {});
  });

  res.send({ courses: coursesResponse });
});

app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
  const { courseId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid courseId' });
    }

    const course = await Course.findOne({ _id: courseId, published: true });

    if (!course) {
      return res.status(401).send({ message: 'Course not found' });
    }

    const { username } = req.user;

    const currentUser = await User.findOne({ username });

    if (currentUser?.purchasedCourses.includes(courseId)) {
      // conflict status code
      return res.status(409).send({ message: 'Course purchased already' });
    }

    currentUser.purchasedCourses.push(courseId);

    await currentUser.save();

    res.send({ message: 'Course purchased successfully' });
  } catch (e) {
    console.log(e, 'catch error purchase course');
    return res.status(500).send({ message: 'Something went wrong' });
  }
});

app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {
  const { username } = req.user;

  const user = await User.findOne({ username }).populate('purchasedCourses');

  const coursesResponse = user.purchasedCourses?.map((c) => {
    return COURSE_RES_PROPS.reduce((acc, prop) => {
      acc[prop] = c[prop];
      return acc;
    }, {});
  });

  res.send({ courses: coursesResponse });
});

// <-------------------- USER DEV Route -------------------->
app.get('/users', async (req, res) => {
  const { 'dev-mode': devMode } = req.headers;

  if (!devMode) {
    return res.send(401);
  }

  const users = await User.find();

  res.send(users);
});

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log('Server is listening on port 3000');
});
