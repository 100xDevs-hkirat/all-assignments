require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    minLength: 6,
    required: true,
  },
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    minLength: 6,
    required: true,
  }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    index: true,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    index: true,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageLink: {
    type: String,
    trim: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);

mongoose.connect(process.env.DB_URI);

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send();
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).send();
  }
};

app.use(express.json());

// Admin routes
app.post('/admin/signup', (req, res) => {
  const admin = new Admin(req.body);

  admin.save()
    .then((admin) => {
      const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET);

      res.json({ message: 'Admin created successfully', token: token });
    })
    .catch((err) => {
      console.log('Error saving new admin: ', err);
      res.status(500).json({ message: 'Something went wrong!' });
    });
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.headers;

  Admin
    .findOne({ username: username, password: password })
    .then((admin) => {
      if (admin) {
        token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET)

        res.json({ message: 'Logged in successfully', token: token });
      } else {
        res.status(401).json({ message: 'Invalid credentials!' });
      }
    })
    .catch((err) => {
      console.log('Error in admin login: ', err);
      res.status(500).json({ message: 'Something went wrong!' });
    });
});

app.post('/admin/courses', authenticateUser, (req, res) => {
  const course = new Course(req.body);

  course
    .save()
    .then((course) => {
      res.status(201).json({ message: 'Course created successfully', courseId: course.id });
    })
    .catch((err) => {
      console.log('Error saving new course: ', err);
      res.status(500).json({ message: 'Something went wrong!' });
    });
});

app.put('/admin/courses/:courseId', authenticateUser, (req, res) => {
  Course.findByIdAndUpdate(
    req.params.courseId,
    { $set: req.body },
    { new: true, runValidators: true }
  )
    .then((updatedCourse) => {
      if (updatedCourse) {
        res.json({ message: 'Course updated successfully' });
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    })
    .catch((error) => {
      console.log('Error updating course: ', error);
      res.status(500).json({ message: 'Something went wrong!' });
    });
});

app.get('/admin/courses', authenticateUser, (req, res) => {
  Course.find()
    .then((courses) => {
      res.json(courses);
    })
    .catch((error) => {
      console.error('Error retrieving courses: ', error);
      res.status(500).json({ message: 'Something went wrong!' });
    });
});

// User routes
app.post('/users/signup', (req, res) => {
  const user = new User(req.body);

  user.save()
    .then((user) => {
      const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);

      res.json({ message: 'Admin created successfully', token: token });
    })
    .catch((err) => {
      console.log('Error saving new user: ', err);
      res.status(500).json({ message: 'Something went wrong!' });
    });
});

app.post('/users/login', (req, res) => {
  const { username, password } = req.headers;

  User
    .findOne({ username: username, password: password })
    .then((user) => {
      if (user) {
        token = jwt.sign({ username: user.username }, process.env.JWT_SECRET)

        res.json({ message: 'Logged in successfully', token: token });
      } else {
        res.status(401).json({ message: 'Invalid credentials!' });
      }
    })
    .catch((err) => {
      console.log('Error in admin login: ', err);
      res.status(500).json({ message: 'Something went wrong!' });
    });
});

app.get('/users/courses', authenticateUser, (req, res) => {
  Course.find()
    .then((courses) => {
      res.json(courses);
    })
    .catch((error) => {
      console.error('Error retrieving courses: ', error);
      res.status(500).json({ message: 'Something went wrong!' });
    });
});

app.post('/users/courses/:courseId', authenticateUser, (req, res) => {
  const username = req.user.username;
  const courseId = req.params.courseId;

  User.findOneAndUpdate(
    { username },
    { $push: { purchasedCourses: courseId } },
    { new: true }
  )
    .then((user) => {
      res.json(user);
    })
    .catch(error => {
      console.error('Error purchasing course: ', error);
      res.status(500).json({ message: 'Something went wrong!' });
    });
});

app.get('/users/purchasedCourses', authenticateUser, (req, res) => {
  const username = req.user.username;

  User.findOne({ username })
    .populate('purchasedCourses')
    .then((user) => {
      const purchasedCourses = user.purchasedCourses;

      res.json(purchasedCourses);
    })
    .catch((error) => {
      console.error('Error retrieving user courses: ', error);
      res.status(500).json({ message: 'Something went wrong!' });
    });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
