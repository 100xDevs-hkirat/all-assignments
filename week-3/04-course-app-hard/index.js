const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const JWT_TOKEN_SECRET = 'secret';

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'course' }],
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

const Admin = mongoose.model('admin', adminSchema);
const User = mongoose.model('user', userSchema);
const Course = mongoose.model('course', courseSchema);

const dbURI =
  'mongodb+srv://<username>:<password>@cluster0.u73jg73.mongodb.net/courses?retryWrites=true&w=majority';

mongoose
  .connect(dbURI)
  .then(() => console.log('db connected'))
  .catch(console.log);

function createJWT(username) {
  return jwt.sign({ username }, JWT_TOKEN_SECRET, {
    expiresIn: '1h',
  });
}

function authJWT(credentialsArray) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      jwt.verify(token, JWT_TOKEN_SECRET, async (err, data) => {
        if (!err) {
          res.locals.user = await credentialsArray.findOne({
            username: data.username,
          });
        }
        if (err || !res.locals.user) {
          res.sendStatus(401);
        } else {
          next();
        }
      });
    } else {
      res.sendStatus(401);
    }
  };
}

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  try {
    if (await Admin.findOne({ username: req.body.username })) {
      res
        .status(409)
        .json({ message: 'Admin with this username already exists' });
    } else {
      const admin = new Admin(req.body);
      await admin.save();
      res.status(201).json({
        message: 'Admin created successfully',
        token: createJWT(admin.username),
      });
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  try {
    const admin = await Admin.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    if (admin) {
      res.json({
        message: 'Logged in successfully',
        token: createJWT(admin.username),
      });
    } else {
      res.status(401).send({ message: 'Invalid username / password' });
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post('/admin/courses', authJWT(Admin), async (req, res) => {
  // logic to create a course
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({
      message: 'Course created successfully',
      courseId: course.courseId,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.put('/admin/courses/:courseId', authJWT(Admin), async (req, res) => {
  // logic to edit a course
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      {
        new: true,
      }
    );
    if (course) {
      res.json({ message: 'Course updated successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get('/admin/courses', authJWT(Admin), async (req, res) => {
  // logic to get all courses
  try {
    const courses = await Course.find({});
    res.json({ courses });
  } catch (error) {
    res.sendStatus(500);
  }
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  try {
    if (await User.findOne({ username: req.body.username })) {
      res
        .status(409)
        .json({ message: 'User with this username already exists' });
    } else {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({
        message: 'User created successfully',
        token: createJWT(user.username),
      });
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  try {
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    if (user) {
      res.json({
        message: 'Logged in successfully',
        token: createJWT(user.username),
      });
    } else {
      res.status(401).send({ message: 'Invalid username / password' });
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get('/users/courses', authJWT(User), async (req, res) => {
  // logic to list all courses
  try {
    const courses = await Course.find({});
    res.json({ courses: courses.filter((course) => course.published) });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post('/users/courses/:courseId', authJWT(User), async (req, res) => {
  // logic to purchase a course
  try {
    const user = res.locals.user;
    const course = await Course.findById(req.params.courseId);
    if (course) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/users/purchasedCourses', authJWT(User), async (req, res) => {
  // logic to view purchased courses
  try {
    const user = await res.locals.user.populate('purchasedCourses');
    res.json({ purchasedCourses: user.purchasedCourses });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
