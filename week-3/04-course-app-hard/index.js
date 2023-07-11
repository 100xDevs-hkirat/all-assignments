const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
const SecretKey = 'SECr3tK3Y';

const userSchema = new mongoose.Schema({
  username: {type: String},
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const adminSchema=new mongoose.Schema({
  username:String,
  password:String
})

const courseSchema=new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
})

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SecretKey, (err, user) => {
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

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);//Models provide an interface for interacting with the database


mongoose.connect('mongodb+srv://<ID>:<PASSWORD>@cluster0.nuuprta.mongodb.net/courses', { useNewUrlParser: true, useUnifiedTopology: true });
//useUnifiedTopology ensures that Mongoose uses the new engine for server discovery and monitoring,  useNewUrlParser to true, you ensure that Mongoose uses the new connection string parser, allowing you to use the latest connection string format

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const admin= await Admin.findOne({ username });
  if (admin) {
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    const newAdmin = new Admin({username,password});
    newAdmin.save();
    const token = jwt.sign({ username, role: 'admin' }, SecretKey, { expiresIn: '1h' });//using role to differentiate admin & user
    res.json({ message: 'Admin created successfully', token });
  }
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, SecretKey, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.post('/admin/courses',authenticateJwt, async (req, res) => {
  // logic to create a course
  const course = new Course(req.body);
  await course.save();
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId',authenticateJwt,async (req, res) => {
  // logic to edit a course
  // Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true })
  // .then(updatedcourse => {
  //   if (updatedcourse) {
  //     // Document found and updated successfully
  //     res.json({ message: 'Course updated successfully' });
  //     console.log(updatedcourse);
  //   } else {
  //     // Document not found with the specified id
  //     console.log('No document found with the specified id');
  //   }
  // })
  // .catch(error => {
  //   // Handle error if any
  //   console.error(error);
  // });
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });//{ new: true } is provided to return the updated document instead of the original one.
  //ID should be 24-character hexadecimal string(The valid format for an ObjectId is a string consisting of 24 characters, which includes letters from a to f and numbers from 0 to 9), else CastError encounters
  if (course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authenticateJwt, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  res.json({ courses });
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    const newUser = new User({ username, password,purchasedCourses:[]});
    await newUser.save();
    const token = jwt.sign({ username, role: 'user' }, SecretKey, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: 'user' }, SecretKey, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.get('/users/courses', authenticateJwt, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({published: true});
  res.json({ courses });
});

app.post('/users/courses/:courseId',authenticateJwt, async(req, res) => {
  // logic to purchase a course
  const course = await Course.findById(req.params.courseId);//object ID:24 chars
  if (course) {
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
  //The populate() function is a method provided by Mongoose that allows you to populate referenced documents in a query result. It is used to fetch and include data from other collections that are referenced in the current document.
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses});
    // purchasedCourses: user.purchasedCourses || []  ==>  If user.purchasedCourses is falsy, it assigns an empty array [] as the default value.
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
