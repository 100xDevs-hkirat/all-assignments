const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

app.use(express.json());

const secretKeyAdmin = "admin";
const secretKeyUser = "user";

// Define Mongoose Schema
const userSchema = new mongoose.Schema({
  username : String,
  password : {type : String}, // same
  purchasedCourses : [{type:mongoose.Schema.Types.ObjectId , ref: 'Course'}]
});

const adminSchema = new mongoose.Schema({
  username : {type : String},
  password : String
});

const courseSchema = new mongoose.Schema({
  title : String,
  description : String,
  price : Number,
  imageLink : String,
  published : Boolean
});

// Define Mongoose Model
const User = mongoose.model('User',userSchema);
const Admin = mongoose.model('Admin',adminSchema);
const Course = mongoose.model('Course',courseSchema);

// Connect to MongoDB
mongoose.connect('mongodb+srv://chiranjeevkundu2000:A0YCDIACGF44eWyI@cluster0.rrjm2bq.mongodb.net/courses',{ useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });

const authenticateJwtAdmin = (req, res ,next) => {
  const token = req.headers.authorization.split(' ')[1];
  if(token) {
    jwt.verify(token,secretKeyAdmin,(err,admin) => {
      if(err) {
        return res.sendStatus(403);
      }
      console.log(admin);
      req.admin = admin;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

const authenticateJwtUser = (req, res ,next) => {
  const token = req.headers.authorization.split(' ')[1];
  if(token) {
    jwt.verify(token,secretKeyUser,(err,user) => {
      if(err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

// Admin routes

app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  const {username, password} = req.body;
  const admin = await Admin.findOne({username});
  if (admin) {
    res.status(403).json({message: 'Admin already exists'});
  } else {
    const newAdmin = new Admin({username, password});
    await newAdmin.save(); // await not need
    const token = jwt.sign({ username, role: 'admin' }, secretKeyAdmin, {expiresIn: '1h'});
    res.json({message: 'Admin created successfully', token});
  }
});

// with .then(callback)
// not recommend

// app.post('/admin/signup', (req, res) => {
//   // logic to sign up admin
//   const {username, password} = req.body;
//   const callback = (admin) => {
//     if (admin) {
//       res.status(403).json({message: 'Admin already exists'});
//     } else {
//       const newAdmin = new Admin({username, password});
//       newAdmin.save();
//       const token = jwt.sign({ username, role: 'admin' }, secretKeyAdmin, {expiresIn: '1h'});
//       res.json({message: 'Admin created successfully', token});
//     }
//   }
//   Admin.findOne({username}).then(callback);
// });

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers;
  const admin = await Admin.findOne({username, password});
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, secretKeyAdmin, {expiresIn: '1h'});
    res.json({message: 'Admin logged in successfully', token});
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.post('/admin/courses', authenticateJwtAdmin, async (req, res) => {
  // logic to create a course
  const course = req.body;
  const newCourse = new Course(course);
  await newCourse.save(); // no need to use await but good for practice
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', authenticateJwtAdmin, async (req, res) => {
  // logic to edit a course
  const course = await Course.findByIdAndUpdate(req.params.courseId,req.body,{new : true});
  if(course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authenticateJwtAdmin, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find();
  res.json({courses : courses});
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const {username, password} = req.body;
  const user = await User.findOne({username});
  if(user) {
    res.status(403).json({message: 'User already exists'});
  } else {
    const newUser = new User({username, password});
    await newUser.save();
    const token = jwt.sign({ username, role: 'user' }, secretKeyUser, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
 });

app.post('/users/login', async(req, res) => {
  // logic to log in user
  const {username, password} = req.headers;
  const user = await User.findOne({username, password});
  if(user) {
    const token = jwt.sign({ username, role: 'user' }, secretKeyUser, {expiresIn: '1h'});
    res.json({message: 'User logged in successfully', token});
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.get('/users/courses', authenticateJwtUser, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({published : true});
  res.json({courses : courses});
});

app.post('/users/courses/:courseId', authenticateJwtUser, async (req, res) => {
  // logic to purchase a course
  const course = await Course.findById(req.params.courseId);
  console.log(course);
  if(course) {
    const user = await User.findOne({username : req.user.username});
    if(user) {
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

app.get('/users/purchasedCourses', authenticateJwtUser, async (req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
